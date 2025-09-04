import { Client } from 'pg';

export default async function handler(req, res) {
  // Enable CORS for AI agent access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use GET.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const { sessionId, siteId, chatId, userId } = req.query;

  if (!sessionId && !siteId && !chatId && !userId) {
    return res.status(400).json({ 
      error: 'Missing identifier (sessionId, siteId, chatId, or userId)',
      code: 'MISSING_IDENTIFIER'
    });
  }

  let client;
  
  try {
    client = new Client({
      connectionString: process.env.POSTGRES_URL
    });
    
    await client.connect();
    
    // Build dynamic query based on available identifiers
    let query = `
      SELECT 
        we.event_type,
        we.site_id,
        we.session_id,
        we.utm_data,
        we.page_data,
        we.visitor_data,
        we.chat_url,
        we.created_at,
        wc.client_name,
        wc.config
      FROM webhook_events we
      LEFT JOIN widget_configs wc ON we.site_id = wc.site_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (sessionId) {
      query += ` AND we.session_id = $${paramIndex++}`;
      params.push(sessionId);
    }
    
    if (siteId) {
      query += ` AND we.site_id = $${paramIndex++}`;
      params.push(siteId);
    }
    
    if (chatId) {
      query += ` AND we.chat_url LIKE $${paramIndex++}`;
      params.push(`%id=${chatId}%`);
    }
    
    if (userId) {
      query += ` AND we.visitor_data->>'userId' = $${paramIndex++}`;
      params.push(userId);
    }
    
    query += ` ORDER BY we.created_at DESC LIMIT 10`;
    
    const result = await client.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'No context data found for the provided identifiers',
        code: 'NO_CONTEXT_FOUND',
        searchedFor: { sessionId, siteId, chatId, userId }
      });
    }

    // Process results for AI agent consumption
    const contextData = result.rows.map(row => ({
      eventType: row.event_type,
      siteId: row.site_id,
      sessionId: row.session_id,
      clientName: row.client_name,
      timestamp: row.created_at,
      
      // UTM Context for AI personalization
      utm: {
        source: row.utm_data?.source,           // Where they came from (facebook, google, email)
        medium: row.utm_data?.medium,           // How they came (social, cpc, email)
        campaign: row.utm_data?.campaign,       // Which campaign (promo2024, summer_sale)
        term: row.utm_data?.term,               // Keywords (ai_chat, customer_service)
        content: row.utm_data?.content          // Ad content (test_ad, banner_1)
      },
      
      // Page Context for AI understanding
      page: {
        host: row.page_data?.host,              // Which domain
        url: row.page_data?.url,                // Exact page URL
        referrer: row.page_data?.referrer       // Previous page
      },
      
      // Visitor Context for AI personalization
      visitor: {
        ip: row.visitor_data?.ip,
        userAgent: row.visitor_data?.userAgent,
        country: row.visitor_data?.country,
        userId: row.visitor_data?.userId
      },
      
      // Widget Configuration for AI behavior
      widgetConfig: {
        chatUrl: row.chat_url,
        bubbleColor: row.config?.bubble?.bg,
        clientBranding: row.config?.bubble?.iconUrl
      }
    }));
    
    // Generate AI-friendly summary
    const latestEvent = contextData[0];
    const aiContext = {
      // Quick summary for AI agent
      summary: {
        customerCameFrom: latestEvent.utm.source || 'direct',
        campaignContext: latestEvent.utm.campaign || 'organic',
        currentPage: latestEvent.page.url || 'unknown',
        clientBrand: latestEvent.clientName || 'Unknown Client'
      },
      
      // Suggested AI responses based on UTM
      suggestedApproach: generateAISuggestions(latestEvent.utm),
      
      // Full context data
      fullContext: contextData
    };
    
    return res.status(200).json({
      success: true,
      contextFound: result.rows.length,
      aiContext,
      searchedFor: { sessionId, siteId, chatId, userId },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[AI Agent Context Error]', error);
    
    return res.status(500).json({ 
      error: 'Context retrieval failed',
      code: 'CONTEXT_ERROR',
      message: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// Generate AI suggestions based on UTM context
function generateAISuggestions(utm) {
  const suggestions = {
    greeting: 'Hello! How can I help you today?',
    tone: 'professional',
    focus: 'general'
  };
  
  // Customize based on UTM source
  if (utm.source === 'facebook') {
    suggestions.greeting = 'Hi there! I saw you came from our Facebook page. What can I help you with?';
    suggestions.tone = 'friendly';
    suggestions.focus = 'social_media_visitor';
  } else if (utm.source === 'google') {
    suggestions.greeting = 'Welcome! I see you found us through Google. Are you looking for something specific?';
    suggestions.tone = 'helpful';
    suggestions.focus = 'search_visitor';
  } else if (utm.source === 'email') {
    suggestions.greeting = 'Thanks for clicking through from our email! How can I assist you?';
    suggestions.tone = 'warm';
    suggestions.focus = 'email_subscriber';
  }
  
  // Customize based on campaign
  if (utm.campaign && utm.campaign.includes('promo')) {
    suggestions.focus = 'promotion_interested';
    suggestions.greeting += ' I see you\'re interested in our current promotion!';
  } else if (utm.campaign && utm.campaign.includes('support')) {
    suggestions.focus = 'support_needed';
    suggestions.tone = 'supportive';
  }
  
  return suggestions;
}
