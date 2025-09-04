import { Client } from 'pg';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use POST.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const { 
    event, 
    siteId, 
    sessionId, 
    utm, 
    page, 
    visitor,
    chatUrl,
    timestamp 
  } = req.body;

  if (!event || !siteId) {
    return res.status(400).json({ 
      error: 'Missing event or siteId',
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
    
    // Create webhook events table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS webhook_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        site_id VARCHAR(100) NOT NULL,
        session_id VARCHAR(100),
        utm_data JSONB,
        page_data JSONB,
        visitor_data JSONB,
        chat_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
    
    // Insert webhook event
    const result = await client.query(`
      INSERT INTO webhook_events 
      (event_type, site_id, session_id, utm_data, page_data, visitor_data, chat_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, created_at
    `, [
      event,
      siteId,
      sessionId || `sess_${Date.now()}`,
      JSON.stringify(utm || {}),
      JSON.stringify(page || {}),
      JSON.stringify(visitor || {}),
      chatUrl
    ]);

    const eventRecord = result.rows[0];
    
    // Send webhook to client's system (if configured)
    const configResult = await client.query(
      'SELECT config FROM widget_configs WHERE site_id = $1',
      [siteId]
    );
    
    let webhookSent = false;
    if (configResult.rows.length > 0) {
      const config = configResult.rows[0].config;
      const webhookUrl = config.webhooks?.chatOpen || config.webhooks?.leadCapture;
      
      if (webhookUrl) {
        try {
          const webhookPayload = {
            event,
            timestamp: new Date().toISOString(),
            siteId,
            sessionId: sessionId || `sess_${Date.now()}`,
            utm,
            page,
            visitor,
            chatUrl,
            eventId: eventRecord.id
          };
          
          const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Source': 'ai-prl-assist-widget',
              'X-Event-Type': event
            },
            body: JSON.stringify(webhookPayload)
          });
          
          webhookSent = webhookResponse.ok;
        } catch (webhookError) {
          console.error('Webhook send failed:', webhookError);
        }
      }
    }
    
    return res.status(200).json({
      success: true,
      eventId: eventRecord.id,
      event,
      siteId,
      utm: utm || {},
      webhookSent,
      timestamp: eventRecord.created_at
    });

  } catch (error) {
    console.error('[Webhook UTM Error]', error);
    
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
