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

  const { siteId, clientName, config } = req.body;

  if (!siteId || !config) {
    return res.status(400).json({ 
      error: 'Missing siteId or config in request body',
      code: 'MISSING_PARAMS'
    });
  }

  // Validate required config fields
  const requiredFields = ['chatUrl', 'bubble', 'triggers', 'rules'];
  for (const field of requiredFields) {
    if (!config[field]) {
      return res.status(400).json({ 
        error: `Missing required config field: ${field}`,
        code: 'INVALID_CONFIG',
        field
      });
    }
  }

  let client;
  
  try {
    // Direct Postgres connection using .env credentials
    client = new Client({
      connectionString: process.env.POSTGRES_URL
    });
    
    await client.connect();
    
    // Save configuration to real database
    const result = await client.query(`
      INSERT INTO widget_configs (site_id, client_name, config, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (site_id)
      DO UPDATE SET 
        client_name = $2,
        config = $3, 
        updated_at = NOW()
      RETURNING id, created_at, updated_at
    `, [siteId, clientName || `Client ${siteId}`, JSON.stringify(config)]);

    const row = result.rows[0];
    
    return res.status(200).json({
      success: true,
      saved: true,
      siteId,
      clientName: clientName || `Client ${siteId}`,
      id: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      source: 'postgres_direct'
    });

  } catch (error) {
    console.error('[Save Config Error]', error);
    
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
