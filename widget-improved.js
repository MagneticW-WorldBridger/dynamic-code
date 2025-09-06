(() => {
  // Prevent multiple loads
  if (window.__aiPrlAssistLoaded) return;
  window.__aiPrlAssistLoaded = true;

  // INTERCOM/RASA STYLE APPROACH - More reliable
  const settings = window.ChatWidgetSettings || {};
  
  // Default configuration
  const defaultConfig = {
    serverUrl: "https://app.aiprlassist.com/webchat/",
    siteId: "aiprlassist-default",
    autoOpen: false,
    showDelay: 3000,
    position: "bottom-right",
    size: 68,
    color: "#E67E22",
    icon: "https://storage.googleapis.com/msgsndr/ecow5j0SgdAz2vzC0C4Q/media/68b225bbb40ac6d4eb8b4ded.png",
    utmCapture: true,
    windowMode: "windowed",
    windowWidth: 420,
    windowHeight: 650,
    fallbackUrl: null,
    analytics: true
  };

  // Merge settings
  const config = { ...defaultConfig, ...settings };

  // BEST PRACTICE: Wait for DOM properly (GHL compatible)
  const initWidget = () => {
    // UTM Parameter capture (CONTEXT7 BEST PRACTICE)
    const captureUTMs = () => {
      const params = new URLSearchParams(window.location.search);
      const utmData = {};
      
      // Capture ALL possible UTM parameters
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 
       'utm_id', 'gclid', 'fbclid', 'msclkid'].forEach(param => {
        const value = params.get(param);
        if (value) utmData[param] = value;
      });
      
      return utmData;
    };

    // Build chat URL with context
    const buildChatUrl = () => {
      const baseUrl = `${config.serverUrl}?p=1047143&id=xaLiCGQ3VYp6mQF2k`;
      const url = new URL(baseUrl);
      
      // Add page context
      url.searchParams.set('embed', '1');
      url.searchParams.set('host', window.location.hostname);
      url.searchParams.set('page', window.location.href);
      if (document.referrer) url.searchParams.set('ref', document.referrer);
      
      // Add UTM parameters if enabled
      if (config.utmCapture) {
        const utms = captureUTMs();
        Object.entries(utms).forEach(([key, value]) => {
          url.searchParams.set(key, value);
        });
      }
      
      return url.toString();
    };

    // SHADOW DOM APPROACH (RASA STYLE - BEST PRACTICE)
    const createWidget = () => {
      const widgetContainer = document.createElement('div');
      widgetContainer.id = 'ai-prl-chat-widget';
      
      // Use Shadow DOM for isolation (BEST PRACTICE)
      const shadowRoot = widgetContainer.attachShadow({ mode: 'closed' });
      
      const styles = `
        <style>
          :host {
            all: initial;
            position: fixed;
            ${config.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            bottom: 20px;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .chat-bubble {
            width: ${config.size}px;
            height: ${config.size}px;
            background: ${config.color};
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.2s ease;
            border: none;
          }
          
          .chat-bubble:hover {
            transform: scale(1.1);
          }
          
          .chat-bubble img {
            width: 70%;
            height: 70%;
            object-fit: contain;
          }
          
          .chat-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            display: none;
            z-index: 2147483646;
          }
          
          .chat-iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          
          .chat-close {
            position: fixed;
            ${config.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            bottom: ${config.windowHeight + 100}px;
            background: #fff;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 8px 12px;
            font: 700 12px/1 system-ui;
            cursor: pointer;
            z-index: 2147483648;
            display: none;
          }
          
          @media (min-width: 768px) {
            .chat-overlay {
              display: flex;
              align-items: flex-end;
              justify-content: ${config.position.includes('right') ? 'flex-end' : 'flex-start'};
              padding: 20px;
            }
            
            .chat-iframe {
              width: ${config.windowWidth}px;
              height: ${config.windowHeight}px;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              margin-bottom: 80px;
            }
            
            .chat-close {
              display: block;
            }
          }
        </style>
      `;
      
      const html = `
        ${styles}
        <button class="chat-bubble">
          <img src="${config.icon}" alt="Chat" />
        </button>
        <div class="chat-overlay">
          <iframe class="chat-iframe" src="about:blank"></iframe>
        </div>
        <button class="chat-close">✕ Close</button>
      `;
      
      shadowRoot.innerHTML = html;
      
      // Event handlers
      const bubble = shadowRoot.querySelector('.chat-bubble');
      const overlay = shadowRoot.querySelector('.chat-overlay');
      const iframe = shadowRoot.querySelector('.chat-iframe');
      const closeBtn = shadowRoot.querySelector('.chat-close');
      
      let chatOpened = false;
      
      const openChat = () => {
        const chatUrl = buildChatUrl();
        iframe.src = chatUrl;
        overlay.style.display = window.innerWidth >= 768 ? 'flex' : 'block';
        closeBtn.style.display = window.innerWidth >= 768 ? 'block' : 'none';
        chatOpened = true;
        
        if (config.analytics) {
          console.log('[AI PRL Assist] Chat opened:', chatUrl);
        }
      };
      
      const closeChat = () => {
        overlay.style.display = 'none';
        closeBtn.style.display = 'none';
        iframe.src = 'about:blank';
        chatOpened = false;
        
        if (config.analytics) {
          console.log('[AI PRL Assist] Chat closed');
        }
      };
      
      bubble.addEventListener('click', openChat);
      closeBtn.addEventListener('click', closeChat);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeChat();
      });
      
      // ESC key support
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatOpened) closeChat();
      });
      
      // Add to DOM
      document.body.appendChild(widgetContainer);
      
      // Show after delay
      setTimeout(() => {
        bubble.style.display = 'flex';
        if (config.analytics) {
          console.log('[AI PRL Assist] Widget ready');
        }
      }, config.showDelay);
      
      // Auto-open if configured
      if (config.autoOpen) {
        setTimeout(openChat, config.showDelay + 1000);
      }
      
      return { openChat, closeChat };
    };

    return createWidget();
  };

  // GOHIGHLEVEL COMPATIBLE INITIALIZATION
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else if (document.readyState === 'interactive') {
    // GHL sometimes loads in interactive state
    setTimeout(initWidget, 100);
  } else {
    initWidget();
  }

  // Global API (INTERCOM STYLE)
  window.ChatWidget = {
    open: () => window.__aiPrlWidget?.openChat(),
    close: () => window.__aiPrlWidget?.closeChat(),
    settings: config
  };
  
  // Store widget instance
  setTimeout(() => {
    window.__aiPrlWidget = initWidget();
  }, 100);
})();
