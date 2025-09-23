import { Client } from 'pg';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  let client;
  
  try {
    client = new Client({
      connectionString: process.env.POSTGRES_URL
    });
    
    await client.connect();
    
    // Simple test query
    const result = await client.query(
      `SELECT COUNT(*) as total_messages FROM teaser_messages WHERE delivered = FALSE`
    );
    
    const sessionResult = await client.query(
      `SELECT session_id, message_text FROM teaser_messages WHERE session_id = 'sess_1758669538090_ly0r95f71' AND delivered = FALSE LIMIT 1`
    );
    
    return res.status(200).json({
      success: true,
      totalUndelivered: result.rows[0].total_messages,
      testSession: sessionResult.rows.length > 0 ? sessionResult.rows[0] : null,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
}
