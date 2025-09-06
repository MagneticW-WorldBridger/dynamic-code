import pkg from 'pg';
const { Pool } = pkg;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {

    if (req.method === 'GET') {
      // List all configurations
      const result = await pool.query(`
        SELECT 
          id,
          site_id, 
          client_name, 
          created_at, 
          updated_at,
          (config->>'chatUrl') as chat_url,
          (config->'bubble'->>'bg') as bubble_color
        FROM widget_configs 
        ORDER BY updated_at DESC
      `);

      return res.status(200).json({
        success: true,
        count: result.rows.length,
        configs: result.rows.map(row => ({
          id: row.id,
          siteId: row.site_id,
          clientName: row.client_name,
          chatUrl: row.chat_url,
          bubbleColor: row.bubble_color,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }))
      });
    }

    if (req.method === 'POST') {
      // Create new configuration
      const { siteId, clientName, config } = req.body;

      if (!siteId) {
        return res.status(400).json({ 
          error: 'Missing siteId',
          code: 'MISSING_SITE_ID'
        });
      }

      if (!config) {
        return res.status(400).json({ 
          error: 'Missing config',
          code: 'MISSING_CONFIG'
        });
      }

      // Check if siteId already exists
      const existing = await pool.query(
        'SELECT site_id FROM widget_configs WHERE site_id = $1',
        [siteId]
      );

      if (existing.rows.length > 0) {
        return res.status(409).json({ 
          error: `Configuration already exists for siteId: ${siteId}`,
          code: 'CONFIG_EXISTS',
          siteId
        });
      }

      const result = await pool.query(
        'INSERT INTO widget_configs (site_id, client_name, config) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at',
        [siteId, clientName || `Client ${siteId}`, JSON.stringify(config)]
      );

      return res.status(201).json({
        success: true,
        created: true,
        siteId,
        clientName: clientName || `Client ${siteId}`,
        id: result.rows[0].id,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at
      });
    }

    return res.status(405).json({ 
      error: `Method ${req.method} not allowed`,
      code: 'METHOD_NOT_ALLOWED'
    });

  } catch (error) {
    console.error('[API Error]', error);
    
    return res.status(500).json({ 
      error: 'Database operation failed',
      code: 'DATABASE_ERROR',
      message: error.message
    });
  } finally {
    await pool.end();
  }
}
