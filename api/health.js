import { sql } from '@vercel/postgres';

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
      error: `Method ${req.method} not allowed`,
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const startTime = Date.now();
    
    // Test database connection
    const result = await sql`SELECT COUNT(*) as total FROM widget_configs`;
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return res.status(200).json({
      status: 'healthy',
      database: 'connected',
      totalConfigs: parseInt(result.rows[0].total),
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });

  } catch (error) {
    console.error('[Health Check Error]', error);
    
    return res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
