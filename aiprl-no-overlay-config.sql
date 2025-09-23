INSERT INTO widget_configs (site_id, client_name, config) VALUES 
('aiprl-no-overlay', 'AI PRL Assist - No Overlay', '{
  "chatUrl": "https://app.aiprlassist.com/webchat/?p=1047143&id=O1T4KXJ9xZ",
  "fallbackUrl": "https://app.aiprlassist.com/webchat/?p=1047143&ref=1746442093403",
  "bubble": {
    "bg": "#007bff",
    "size": 85,
    "color": "#ffffff",
    "label": "Hi! Need help with AI PRL Assist?",
    "position": "br",
    "iconUrl": "https://storage.googleapis.com/msgsndr/ecow5j0SgdAz2vzC0C4Q/media/6820bf78e698d61eccb97894.png",
    "pulse": true,
    "zIndex": 2147483647,
    "outline": "#0056b3",
    "outlineWidth": "2px",
    "outlineOffset": "1px"
  },
  "teaser": {
    "enabled": true,
    "text": "Hi! Need help with AI PRL Assist? I am here to help!",
    "delayMs": 3000,
    "autocloseMs": 15000,
    "bg": "#ffffff",
    "color": "#007bff",
    "border": "2px solid #007bff",
    "borderRadius": "12px",
    "boxShadow": "0 4px 20px rgba(0, 123, 255, 0.2)",
    "fontFamily": "system-ui, -apple-system, sans-serif",
    "fontWeight": "600",
    "fontSize": "14px",
    "minWidth": "280px",
    "maxWidth": "320px"
  },
  "onlineIndicator": {
    "enabled": true,
    "size": 18,
    "color": "#28a745",
    "pulse": true,
    "border": "3px solid white",
    "offsetX": "15px",
    "offsetY": "75px",
    "position": "bottom-right-offset",
    "boxShadow": "0 0 10px 2px rgba(40, 167, 69, 0.5)"
  },
  "customStyles": {
    "bubbleImageWidth": "75%",
    "bubbleImageHeight": "75%",
    "bubbleImageTransform": "none",
    "bubbleImageBorderRadius": "8px"
  },
  "triggers": {
    "showBubbleAfterMs": 2000,
    "openAfterMs": 0,
    "triggerOnScrollPercent": 0,
    "triggerOnExitIntent": false
  },
  "rules": {
    "includePaths": ["*"],
    "excludePaths": [],
    "showOnMobile": true,
    "showOnDesktop": true,
    "minWidth": 0,
    "maxWidth": 99999,
    "frequencyCapHours": 24,
    "appendUTM": true
  },
  "overlay": {
    "bg": "rgba(0,0,0,0.5)",
    "closeOnEsc": true,
    "windowMode": true,
    "windowWidth": "420px",
    "windowHeight": "650px"
  },
  "analytics": {
    "console": true,
    "trackOpens": true
  },
  "noOverlay": true,
  "webhookUrl": "",
  "webhookEvents": []
}');





