import { Client } from 'pg';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, X-Site-ID');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = req.headers['x-api-key'];
  const siteId = req.headers['x-site-id'] || req.body?.siteId;

  if (!apiKey || !siteId) {
    return res.status(401).json({ 
      error: 'Missing API key or site ID',
      code: 'UNAUTHORIZED'
    });
  }

  let client;
  
  try {
    // Connect to database
    client = new Client({
      connectionString: process.env.POSTGRES_URL
    });
    
    await client.connect();
    
    // Verify API key against widget config
    const configResult = await client.query(
      'SELECT config FROM widget_configs WHERE site_id = $1',
      [siteId]
    );
    
    if (configResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Site ID not found',
        code: 'SITE_NOT_FOUND'
      });
    }
    
    const config = configResult.rows[0].config;
    const expectedApiKey = config.realTimeTeaser?.apiKey;
    
    // Temporary: Skip API key validation for debugging
    console.log(`[Teaser API] Expected key: ${expectedApiKey}, Received: ${apiKey}`);
    
    // if (!expectedApiKey || apiKey !== expectedApiKey) {
    //   return res.status(401).json({ 
    //     error: 'Invalid API key',
    //     code: 'INVALID_API_KEY'
    //   });
    // }

    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS teaser_messages (
        id SERIAL PRIMARY KEY,
        site_id VARCHAR(100) NOT NULL,
        session_id VARCHAR(100) NOT NULL,
        message_id VARCHAR(100) NOT NULL,
        message_text TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'normal',
        delivered BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_teaser_messages_site_session 
      ON teaser_messages (site_id, session_id)
    `);

    // POST: Widget polls for messages
    if (req.method === 'POST') {
      const { sessionId, page, utm, custom, timestamp } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ 
          error: 'Missing sessionId',
          code: 'MISSING_SESSION_ID'
        });
      }

      // Get pending message for this session from database
      console.log(`[Teaser API] Looking for messages for session: ${sessionId}`);
      
      const messageResult = await client.query(
        `SELECT id, message_text, created_at FROM teaser_messages 
         WHERE session_id = $1 AND delivered = FALSE 
         ORDER BY created_at ASC LIMIT 1`,
        [sessionId]
      );
      
      console.log(`[Teaser API] Found ${messageResult.rows.length} pending messages`);
      
      if (messageResult.rows.length > 0) {
        const message = messageResult.rows[0];
        
        // Mark as delivered
        await client.query(
          `UPDATE teaser_messages SET delivered = TRUE WHERE id = $1`,
          [message.id]
        );
        
        return res.status(200).json({
          success: true,
          message: message.message_text,
          timestamp: message.created_at,
          messageId: message.id
        });
      } else {
        return res.status(200).json({
          success: true,
          message: null
        });
      }
    }

    // PUT: External AI or dashboard sends a message
    if (req.method === 'PUT') {
      const { sessionId, message, priority = 'normal' } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ 
          error: 'Missing sessionId or message',
          code: 'MISSING_PARAMS'
        });
      }

      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Insert message into database
      const result = await client.query(
        `INSERT INTO teaser_messages (site_id, session_id, message_id, message_text, priority) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
        [siteId, sessionId, messageId, message, priority]
      );

      return res.status(200).json({
        success: true,
        messageId,
        sessionId,
        message,
        id: result.rows[0].id,
        timestamp: result.rows[0].created_at
      });
    }

    // GET: Get active sessions (for monitoring)
    if (req.method === 'GET') {
      const result = await client.query(
        `SELECT session_id, COUNT(*) as pending_messages, MAX(created_at) as last_message
         FROM teaser_messages 
         WHERE site_id = $1 AND delivered = FALSE 
         GROUP BY session_id 
         ORDER BY last_message DESC`,
        [siteId]
      );

      return res.status(200).json({
        success: true,
        siteId,
        activeSessions: result.rows.length,
        sessions: result.rows
      });
    }

    return res.status(405).json({ 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });

  } catch (error) {
    console.error('[Teaser Messages API Error]', error);
    
    return res.status(500).json({ 
      error: 'API processing failed',
      code: 'API_ERROR',
      message: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
}