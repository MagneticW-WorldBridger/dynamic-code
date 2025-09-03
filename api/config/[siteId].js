import { createPool } from '@vercel/postgres';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS for widget loading
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { siteId } = req.query;

  if (!siteId) {
    return res.status(400).json({ 
      error: 'Missing siteId parameter',
      code: 'MISSING_SITE_ID'
    });
  }

  try {
    // Create connection pool with explicit connection string
    const pool = createPool({
      connectionString: process.env.POSTGRES_URL
    });

    if (req.method === 'GET') {
      // Load configuration
      const result = await pool.sql`
        SELECT config, client_name, updated_at 
        FROM widget_configs 
        WHERE site_id = ${siteId}
      `;

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: `Configuration not found for siteId: ${siteId}`,
          code: 'CONFIG_NOT_FOUND',
          siteId
        });
      }

      const config = result.rows[0];
      
      return res.status(200).json({
        success: true,
        siteId,
        clientName: config.client_name,
        config: config.config,
        updatedAt: config.updated_at,
        source: 'database'
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      // Save configuration
      const { config, clientName } = req.body;

      if (!config) {
        return res.status(400).json({ 
          error: 'Missing config in request body',
          code: 'MISSING_CONFIG'
        });
      }

      // Validate config structure
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

      const result = await pool.sql`
        INSERT INTO widget_configs (site_id, client_name, config, updated_at)
        VALUES (${siteId}, ${clientName || `Client ${siteId}`}, ${JSON.stringify(config)}, NOW())
        ON CONFLICT (site_id)
        DO UPDATE SET 
          client_name = ${clientName || `Client ${siteId}`},
          config = ${JSON.stringify(config)}, 
          updated_at = NOW()
        RETURNING id, created_at, updated_at
      `;

      return res.status(200).json({
        success: true,
        siteId,
        clientName: clientName || `Client ${siteId}`,
        saved: true,
        id: result.rows[0].id,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at
      });
    }

    if (req.method === 'DELETE') {
      // Delete configuration
      const result = await pool.sql`
        DELETE FROM widget_configs 
        WHERE site_id = ${siteId}
        RETURNING id, client_name
      `;

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: `Configuration not found for siteId: ${siteId}`,
          code: 'CONFIG_NOT_FOUND',
          siteId
        });
      }

      return res.status(200).json({
        success: true,
        deleted: true,
        siteId,
        clientName: result.rows[0].client_name
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
      message: error.message,
      siteId
    });
  }
}
