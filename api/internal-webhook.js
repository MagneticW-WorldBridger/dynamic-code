import { Client } from 'pg';

// In-memory event cache for real-time dashboard
const eventCache = new Map();
const MAX_CACHE_SIZE = 1000;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Widget-Source, X-Site-ID, X-Event-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return cached events for dashboard
    const events = Array.from(eventCache.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 100); // Last 100 events

    return res.status(200).json({
      success: true,
      events,
      totalCached: eventCache.size,
      lastUpdated: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const {
    event,
    timestamp,
    siteId,
    sessionId,
    page,
    utm,
    custom,
    visitor,
    host,
    sessionData,
    shouldTriggerAI,
    ...eventData
  } = req.body;

  if (!event || !siteId || !sessionId) {
    return res.status(400).json({ 
      error: 'Missing required fields: event, siteId, sessionId',
      code: 'MISSING_PARAMS'
    });
  }

  let client;
  
  try {
    // Connect to database
    client = new Client({
      connectionString: process.env.POSTGRES_URL
    });
    
    await client.connect();

    // Create events table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS webhook_events_internal (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        site_id VARCHAR(100) NOT NULL,
        session_id VARCHAR(100) NOT NULL,
        page_data JSONB,
        utm_data JSONB,
        custom_data JSONB,
        visitor_data JSONB,
        session_data JSONB,
        should_trigger_ai BOOLEAN DEFAULT FALSE,
        ai_triggered BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Insert event into database
    const result = await client.query(`
      INSERT INTO webhook_events_internal 
      (event_type, site_id, session_id, page_data, utm_data, custom_data, visitor_data, session_data, should_trigger_ai)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at
    `, [
      event,
      siteId,
      sessionId,
      JSON.stringify(page || {}),
      JSON.stringify(utm || {}),
      JSON.stringify(custom || {}),
      JSON.stringify(visitor || {}),
      JSON.stringify(sessionData || {}),
      shouldTriggerAI || false
    ]);

    const eventRecord = result.rows[0];

    // Cache event for real-time dashboard
    const cacheKey = `${eventRecord.id}_${Date.now()}`;
    const cachedEvent = {
      id: eventRecord.id,
      event,
      timestamp: eventRecord.created_at,
      siteId,
      sessionId,
      page: page || {},
      utm: utm || {},
      custom: custom || {},
      sessionData: sessionData || {},
      shouldTriggerAI: shouldTriggerAI || false,
      interactionScore: sessionData?.interactionScore || 0,
      pageViews: sessionData?.pageViews || 0
    };

    eventCache.set(cacheKey, cachedEvent);

    // Clean cache if too large
    if (eventCache.size > MAX_CACHE_SIZE) {
      const oldestKey = eventCache.keys().next().value;
      eventCache.delete(oldestKey);
    }

    // AI TRIGGERING LOGIC
    let aiResponse = null;
    if (shouldTriggerAI) {
      try {
        // Mark as AI triggered
        await client.query(
          'UPDATE webhook_events_internal SET ai_triggered = TRUE WHERE id = $1',
          [eventRecord.id]
        );

        // Generate AI message based on context
        const aiMessage = generateAIMessage(page, utm, custom, sessionData);
        
        if (aiMessage) {
          // Send to teaser API
          const teaserResponse = await fetch(`${req.headers.origin || 'https://dynamiccode-ochre.vercel.app'}/api/teaser-messages`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': 'woodstock_rt_key_2024', // This should come from config
              'X-Site-ID': siteId
            },
            body: JSON.stringify({
              sessionId,
              message: aiMessage,
              priority: 'high',
              expiresIn: 300000 // 5 minutes
            })
          });

          if (teaserResponse.ok) {
            const teaserData = await teaserResponse.json();
            aiResponse = {
              triggered: true,
              message: aiMessage,
              messageId: teaserData.messageId
            };
          }
        }
      } catch (aiError) {
        console.error('AI triggering failed:', aiError);
        aiResponse = {
          triggered: false,
          error: aiError.message
        };
      }
    }

    return res.status(200).json({
      success: true,
      eventId: eventRecord.id,
      event,
      siteId,
      sessionId,
      shouldTriggerAI,
      aiResponse,
      cached: true,
      timestamp: eventRecord.created_at
    });

  } catch (error) {
    console.error('[Internal Webhook Error]', error);
    
    return res.status(500).json({ 
      error: 'Webhook processing failed',
      code: 'WEBHOOK_ERROR',
      message: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// AI Message Generation Logic
function generateAIMessage(page, utm, custom, sessionData) {
  const messages = [];
  
  // Customer-specific messages
  if (custom.customer_id) {
    messages.push(`👋 Welcome back, customer #${custom.customer_id}!`);
  }
  
  // Page-specific messages
  if (page.pathname?.includes('/chairs')) {
    messages.push(`🪑 I see you're browsing chairs! Check out our ergonomic collection with 30% off!`);
  } else if (page.pathname?.includes('/checkout')) {
    messages.push(`🛒 Almost done! Need help completing your order?`);
  } else if (page.pathname?.includes('/cart')) {
    messages.push(`🛍️ Items in your cart! Don't miss our limited-time offers!`);
  }
  
  // UTM-based messages
  if (utm.utm_source === 'facebook') {
    messages.push(`📱 Thanks for coming from Facebook! Exclusive social media discount available!`);
  }
  
  // Interaction-based messages
  if (sessionData.pageViews >= 3) {
    messages.push(`🔍 I notice you're really exploring our site! Let me help you find exactly what you need!`);
  }
  
  if (sessionData.interactionScore >= 70) {
    messages.push(`⭐ You seem very interested! I'm here to help with any questions!`);
  }
  
  // Return random message or combine them
  if (messages.length === 0) {
    return `💬 Hi there! I'm here to help with any questions about our furniture!`;
  }
  
  return messages.length === 1 ? messages[0] : messages.join(' ');
}
