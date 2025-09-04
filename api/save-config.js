export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

  try {
    // For now, simulate saving to database
    // We'll use the working database connection later
    
    console.log('Saving config for siteId:', siteId);
    console.log('Config:', JSON.stringify(config, null, 2));
    
    // Simulate database save
    const result = {
      id: Math.floor(Math.random() * 1000),
      siteId,
      clientName: clientName || `Client ${siteId}`,
      config,
      saved: true,
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      message: 'Configuration saved successfully',
      data: result
    });

  } catch (error) {
    console.error('[Save Config Error]', error);
    
    return res.status(500).json({ 
      error: 'Failed to save configuration',
      code: 'SAVE_ERROR',
      message: error.message
    });
  }
}
