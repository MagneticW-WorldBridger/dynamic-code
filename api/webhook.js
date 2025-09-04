export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Svix-Signature');

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

  try {
    const { event, siteId, timestamp, data, webhookUrl } = req.body;

    if (!event || !siteId) {
      return res.status(400).json({ 
        error: 'Missing required fields: event, siteId',
        code: 'MISSING_PARAMS'
      });
    }

    // Build webhook payload
    const webhookPayload = {
      event,
      siteId,
      timestamp: timestamp || new Date().toISOString(),
      source: 'ai_prl_assist_widget',
      data: {
        ...data,
        // Always include page context
        host: data?.host || 'unknown',
        page: data?.page || 'unknown',
        userAgent: data?.userAgent || 'unknown'
      }
    };

    console.log('[Webhook] Sending event:', webhookPayload);

    // If webhookUrl provided, forward the event
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'AI-PRL-Assist-Widget/1.0',
            'X-Widget-Source': 'ai-prl-assist',
            'X-Event-Type': event
          },
          body: JSON.stringify(webhookPayload)
        });

        return res.status(200).json({
          success: true,
          event,
          siteId,
          webhook: {
            sent: true,
            status: webhookResponse.status,
            statusText: webhookResponse.statusText
          },
          timestamp: webhookPayload.timestamp
        });

      } catch (webhookError) {
        console.error('[Webhook] Failed to send:', webhookError);
        
        return res.status(200).json({
          success: true,
          event,
          siteId,
          webhook: {
            sent: false,
            error: webhookError.message
          },
          timestamp: webhookPayload.timestamp
        });
      }
    }

    // No webhook URL provided, just log the event
    return res.status(200).json({
      success: true,
      event,
      siteId,
      webhook: {
        sent: false,
        reason: 'No webhook URL configured'
      },
      timestamp: webhookPayload.timestamp
    });

  } catch (error) {
    console.error('[Webhook API Error]', error);
    
    return res.status(500).json({ 
      error: 'Webhook processing failed',
      code: 'WEBHOOK_ERROR',
      message: error.message
    });
  }
}
