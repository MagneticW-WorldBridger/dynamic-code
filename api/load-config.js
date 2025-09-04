import { Client } from 'pg';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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

  const { siteId } = req.query;

  if (!siteId) {
    return res.status(400).json({ 
      error: 'Missing siteId parameter',
      code: 'MISSING_SITE_ID'
    });
  }

  let client;
  
  try {
    // Direct Postgres connection using .env credentials
    client = new Client({
      connectionString: process.env.POSTGRES_URL
    });
    
    await client.connect();
    
    // Load configuration from real database
    const result = await client.query(
      'SELECT config, client_name, updated_at FROM widget_configs WHERE site_id = $1',
      [siteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: `Configuration not found for siteId: ${siteId}`,
        code: 'CONFIG_NOT_FOUND',
        siteId
      });
    }

    const row = result.rows[0];
    
    return res.status(200).json({
      success: true,
      siteId,
      clientName: row.client_name,
      config: row.config,
      updatedAt: row.updated_at,
      source: 'postgres_direct'
    });

  } catch (error) {
    console.error('[Load Config Error]', error);
    
    return res.status(500).json({ 
      error: 'Database operation failed',
      code: 'DATABASE_ERROR',
      message: error.message,
      siteId
    });
  } finally {
    if (client) {
      await client.end();
    }
  }
}
