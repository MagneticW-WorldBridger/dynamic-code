export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
    if (req.method === 'GET') {
      // For now, return the default config from our database record
      // This simulates the database call until we fix the connection
      if (siteId === 'aiprlassist-default') {
        const config = {
          chatUrl: "https://app.aiprlassist.com/webchat/?p=1047143&id=xaLiCGQ3VYp6mQF2k",
          fallbackUrl: "https://app.aiprlassist.com/webchat/?p=1047143&ref=1746442093403",
          bubble: {
            position: "br",
            size: 68,
            bg: "#E67E22",
            color: "#ffffff",
            outline: "#3498DB",
            label: "Hi! Need help with your retail experience?",
            iconUrl: "https://storage.googleapis.com/msgsndr/ecow5j0SgdAz2vzC0C4Q/media/68b225bbb40ac6d4eb8b4ded.png",
            pulse: true,
            zIndex: 2147483000
          },
          triggers: {
            showBubbleAfterMs: 3000,
            openAfterMs: 0,
            triggerOnScrollPercent: 0,
            triggerOnExitIntent: false
          },
          rules: {
            includePaths: ["*"],
            excludePaths: [],
            showOnMobile: true,
            showOnDesktop: true,
            appendUTM: true
          },
          overlay: {
            bg: "rgba(0,0,0,0.45)",
            closeOnEsc: true,
            windowMode: true,
            windowWidth: "420px",
            windowHeight: "650px"
          },
          analytics: {
            console: true
          }
        };

        return res.status(200).json({
          success: true,
          siteId,
          clientName: "AI PRL Assist (Default)",
          config: config,
          source: "database_simulation",
          timestamp: new Date().toISOString()
        });
      } else {
        return res.status(404).json({ 
          error: `Configuration not found for siteId: ${siteId}`,
          code: 'CONFIG_NOT_FOUND',
          siteId
        });
      }
    }

    return res.status(405).json({ 
      error: `Method ${req.method} not allowed`,
      code: 'METHOD_NOT_ALLOWED'
    });

  } catch (error) {
    console.error('[API Error]', error);
    
    return res.status(500).json({ 
      error: 'API operation failed',
      code: 'API_ERROR',
      message: error.message,
      siteId
    });
  }
}
