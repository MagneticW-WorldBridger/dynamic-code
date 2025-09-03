export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    return res.status(200).json({
      status: 'API Working',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      environment: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        nodeVersion: process.version,
        platform: process.platform
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Test endpoint failed',
      message: error.message
    });
  }
}
