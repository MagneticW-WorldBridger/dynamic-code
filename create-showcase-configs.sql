-- Luxury Hotel & Spa Configuration
INSERT INTO widget_configs (site_id, client_name, config) VALUES 
('luxury-hotel-spa', 'Luxury Hotel & Spa', '{
  "chatUrl": "https://app.aiprlassist.com/webchat/?p=1047143&id=LuxuryHotelSpa001",
  "fallbackUrl": "https://app.aiprlassist.com/webchat/?p=1047143&ref=luxury-fallback",
  "bubble": {
    "bg": "#667eea",
    "size": 75,
    "color": "#ffffff",
    "label": "Need assistance with your stay?",
    "position": "br",
    "iconUrl": "https://storage.googleapis.com/msgsndr/ecow5j0SgdAz2vzC0C4Q/media/68b225bbb40ac6d4eb8b4ded.png",
    "pulse": true,
    "zIndex": 2147483647,
    "outline": "#ffd700",
    "outlineWidth": "3px",
    "outlineOffset": "2px"
  },
  "teaser": {
    "enabled": true,
    "text": "Welcome to luxury! How may we enhance your experience?",
    "delayMs": 2000,
    "autocloseMs": 20000,
    "bg": "#667eea",
    "color": "#ffffff",
    "border": "2px solid #ffd700",
    "borderRadius": "15px",
    "boxShadow": "0 10px 30px rgba(102, 126, 234, 0.3)",
    "fontFamily": "Georgia, serif",
    "fontWeight": "normal",
    "fontSize": "16px",
    "minWidth": "280px",
    "maxWidth": "350px"
  },
  "onlineIndicator": {
    "enabled": true,
    "size": 22,
    "color": "#ffd700",
    "pulse": true,
    "border": "4px solid white",
    "offsetX": "15px",
    "offsetY": "65px",
    "position": "bottom-right-offset",
    "boxShadow": "0 0 15px 3px rgba(255, 215, 0, 0.6)"
  },
  "customStyles": {
    "bubbleImageWidth": "60%",
    "bubbleImageHeight": "60%",
    "bubbleImageTransform": "rotate(-5deg)",
    "bubbleImageBorderRadius": "20%"
  },
  "triggers": {
    "showBubbleAfterMs": 1500,
    "openAfterMs": 0,
    "triggerOnScrollPercent": 30,
    "triggerOnExitIntent": true
  },
  "rules": {
    "includePaths": ["*"],
    "excludePaths": ["/admin/*", "/staff/*"],
    "showOnMobile": true,
    "showOnDesktop": true,
    "minWidth": 768,
    "maxWidth": 99999,
    "frequencyCapHours": 12,
    "appendUTM": true
  },
  "overlay": {
    "bg": "rgba(102, 126, 234, 0.8)",
    "closeOnEsc": true,
    "windowMode": true,
    "windowWidth": "500px",
    "windowHeight": "700px"
  },
  "analytics": {
    "console": true,
    "trackOpens": true
  },
  "noOverlay": false,
  "webhookUrl": "https://luxury-hotel.com/api/chat-webhook",
  "webhookEvents": ["chat_opened", "teaser_shown", "teaser_autoclosed"]
}');

-- Tech Startup Dark Mode Configuration  
INSERT INTO widget_configs (site_id, client_name, config) VALUES 
('tech-startup-dark', 'Tech Startup (Dark Mode)', '{
  "chatUrl": "https://app.aiprlassist.com/webchat/?p=1047143&id=TechStartupDark001",
  "fallbackUrl": "https://app.aiprlassist.com/webchat/?p=1047143&ref=tech-fallback",
  "bubble": {
    "bg": "#0d1117",
    "size": 60,
    "color": "#00ff88",
    "label": "Need help shipping faster?",
    "position": "bl",
    "iconUrl": "https://storage.googleapis.com/msgsndr/ecow5j0SgdAz2vzC0C4Q/media/68b225bbb40ac6d4eb8b4ded.png",
    "pulse": false,
    "zIndex": 2147483647,
    "outline": "#00ff88",
    "outlineWidth": "1px",
    "outlineOffset": "3px"
  },
  "teaser": {
    "enabled": true,
    "text": "Got questions about our API? Let us help!",
    "delayMs": 4000,
    "autocloseMs": 12000,
    "bg": "#0d1117",
    "color": "#00ff88",
    "border": "1px solid #00ff88",
    "borderRadius": "8px",
    "boxShadow": "0 0 20px rgba(0, 255, 136, 0.2)",
    "fontFamily": "Monaco, Consolas, monospace",
    "fontWeight": "normal",
    "fontSize": "13px",
    "minWidth": "250px",
    "maxWidth": "320px"
  },
  "onlineIndicator": {
    "enabled": true,
    "size": 16,
    "color": "#00ff88",
    "pulse": false,
    "border": "2px solid #0d1117",
    "offsetX": "8px",
    "offsetY": "50px",
    "position": "bottom-left-offset",
    "boxShadow": "0 0 10px rgba(0, 255, 136, 0.5)"
  },
  "customStyles": {
    "bubbleImageWidth": "80%",
    "bubbleImageHeight": "80%",
    "bubbleImageTransform": "none",
    "bubbleImageBorderRadius": "10%",
    "bubbleImageFit": "cover"
  },
  "triggers": {
    "showBubbleAfterMs": 500,
    "openAfterMs": 0,
    "triggerOnScrollPercent": 0,
    "triggerOnExitIntent": false
  },
  "rules": {
    "includePaths": ["/docs/*", "/api/*", "/pricing"],
    "excludePaths": ["/admin/*"],
    "showOnMobile": true,
    "showOnDesktop": true,
    "minWidth": 0,
    "maxWidth": 99999,
    "frequencyCapHours": 6,
    "appendUTM": true
  },
  "overlay": {
    "bg": "rgba(13, 17, 23, 0.95)",
    "closeOnEsc": true,
    "windowMode": true,
    "windowWidth": "450px",
    "windowHeight": "600px"
  },
  "analytics": {
    "console": true,
    "trackOpens": true
  },
  "noOverlay": false,
  "webhookUrl": "https://tech-startup.com/webhooks/chat",
  "webhookEvents": ["chat_opened", "chat_closed"]
}');

-- Fashion E-commerce Configuration
INSERT INTO widget_configs (site_id, client_name, config) VALUES 
('ecommerce-fashion', 'Fashion E-commerce', '{
  "chatUrl": "https://app.aiprlassist.com/webchat/?p=1047143&id=FashionStore001",
  "fallbackUrl": "https://app.aiprlassist.com/webchat/?p=1047143&ref=fashion-fallback",
  "bubble": {
    "bg": "#ff6b9d",
    "size": 80,
    "color": "#ffffff",
    "label": "Need styling help?",
    "position": "br",
    "iconUrl": "https://storage.googleapis.com/msgsndr/ecow5j0SgdAz2vzC0C4Q/media/68b225bbb40ac6d4eb8b4ded.png",
    "pulse": true,
    "zIndex": 2147483647,
    "outline": "#ffffff",
    "outlineWidth": "4px",
    "outlineOffset": "0px"
  },
  "teaser": {
    "enabled": true,
    "text": "New collection just dropped! Need help finding your style?",
    "delayMs": 3000,
    "autocloseMs": 18000,
    "bg": "#ffffff",
    "color": "#ff6b9d",
    "border": "3px solid #ff6b9d",
    "borderRadius": "25px",
    "boxShadow": "0 8px 25px rgba(255, 107, 157, 0.3)",
    "fontFamily": "Poppins, sans-serif",
    "fontWeight": "600",
    "fontSize": "15px",
    "minWidth": "300px",
    "maxWidth": "380px"
  },
  "onlineIndicator": {
    "enabled": true,
    "size": 20,
    "color": "#00ff00",
    "pulse": true,
    "border": "3px solid #ffffff",
    "offsetX": "20px",
    "offsetY": "70px",
    "position": "bottom-right-offset",
    "boxShadow": "0 0 12px 2px rgba(0, 255, 0, 0.4)"
  },
  "customStyles": {
    "bubbleImageWidth": "70%",
    "bubbleImageHeight": "70%",
    "bubbleImageTransform": "scale(1.1)",
    "bubbleImageBorderRadius": "50%"
  },
  "triggers": {
    "showBubbleAfterMs": 2000,
    "openAfterMs": 15000,
    "triggerOnScrollPercent": 50,
    "triggerOnExitIntent": true
  },
  "rules": {
    "includePaths": ["*"],
    "excludePaths": ["/checkout/*", "/account/*"],
    "showOnMobile": true,
    "showOnDesktop": true,
    "minWidth": 0,
    "maxWidth": 99999,
    "frequencyCapHours": 24,
    "appendUTM": true
  },
  "overlay": {
    "bg": "rgba(255, 107, 157, 0.6)",
    "closeOnEsc": true,
    "windowMode": true,
    "windowWidth": "480px",
    "windowHeight": "720px"
  },
  "analytics": {
    "console": true,
    "trackOpens": true
  },
  "noOverlay": false,
  "webhookUrl": "https://fashion-store.com/api/chat-events",
  "webhookEvents": ["chat_opened", "teaser_shown", "chat_closed", "teaser_autoclosed"]
}');





