import { Client } from 'pg';

// In-memory store for teaser messages (you might want to use Redis in production)
const teaserMessages = new Map();

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
    // Connect to database to verify API key and get config
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
    
    if (!expectedApiKey || expectedApiKey !== apiKey) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    }

    if (req.method === 'POST') {
      // Widget polling for messages
      const { sessionId, page, utm, custom } = req.body;
      
      // Log the polling request for analytics
      await client.query(`
        INSERT INTO teaser_polls (site_id, session_id, page_data, utm_data, custom_data, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT DO NOTHING
      `, [
        siteId,
        sessionId,
        JSON.stringify(page),
        JSON.stringify(utm),
        JSON.stringify(custom)
      ]);
      
      // Get pending message for this session
      const messageKey = `${siteId}:${sessionId}`;
      const message = teaserMessages.get(messageKey);
      
      if (message) {
        // Clear the message after sending
        teaserMessages.delete(messageKey);
        
        return res.status(200).json({
          success: true,
          message: message.text,
          timestamp: message.timestamp,
          messageId: message.id
        });
      }
      
      return res.status(200).json({
        success: true,
        message: null
      });
    }

    if (req.method === 'PUT') {
      // External AI sending message
      const { sessionId, message, priority = 'normal', expiresIn = 300000 } = req.body; // 5 min default expiry
      
      if (!sessionId || !message) {
        return res.status(400).json({ 
          error: 'Missing sessionId or message',
          code: 'MISSING_PARAMS'
        });
      }
      
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const messageKey = `${siteId}:${sessionId}`;
      
      // Store message in memory
      teaserMessages.set(messageKey, {
        id: messageId,
        text: message,
        priority,
        timestamp: new Date().toISOString(),
        expiresAt: Date.now() + expiresIn
      });
      
      // Log the message in database
      await client.query(`
        INSERT INTO teaser_messages (site_id, session_id, message_id, message_text, priority, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [
        siteId,
        sessionId,
        messageId,
        message,
        priority
      ]);
      
      // Set expiry timeout
      setTimeout(() => {
        teaserMessages.delete(messageKey);
      }, expiresIn);
      
      return res.status(200).json({
        success: true,
        messageId,
        sessionId,
        message,
        expiresIn
      });
    }

    if (req.method === 'GET') {
      // Get active sessions for this site
      const sessions = [];
      for (const [key, message] of teaserMessages.entries()) {
        if (key.startsWith(`${siteId}:`)) {
          sessions.push({
            sessionId: key.split(':')[1],
            message: message.text,
            timestamp: message.timestamp,
            priority: message.priority
          });
        }
      }
      
      return res.status(200).json({
        success: true,
        siteId,
        activeSessions: sessions.length,
        sessions
      });
    }

    return res.status(405).json({ 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED'
    });

  } catch (error) {
    console.error('[Teaser Messages API Error]', error);
    
    return res.status(500).json({ 
      error: 'Internal server error',
      code: 'SERVER_ERROR',
      message: error.message
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
}
