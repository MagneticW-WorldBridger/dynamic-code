(() => {
  if (window.__aiPrlAssistLoaded) return;
  window.__aiPrlAssistLoaded = true;

  // Global namespace
  window.ChatWidget = window.ChatWidget || {};

     // Setup function - called by client
   window.ChatWidget.setup = async (config) => {
     const {
       id,
       accountId,
       siteId, // NEW: For remote config
       color = "#E67E22",
       icon = "https://storage.googleapis.com/msgsndr/ecow5j0SgdAz2vzC0C4Q/media/68b225bbb40ac6d4eb8b4ded.png",
       position = "bottom-right",
       size = 68,
       showDelay = 1000,
       openDelay = 0,
       exitIntent = false,
       scrollTrigger = false,
       windowMode = "windowed",
       windowWidth = 420,
       windowHeight = 650,
       fallbackUrl = null,
       analytics = true,
       utmCapture = true,
       noOverlay = false // NEW: Disable overlay
     } = config;

     // NEW: Load remote config if siteId provided
     let remoteConfig = {};
     if (siteId) {
       try {
         const response = await fetch(`https://dynamiccode-ochre.vercel.app/api/load-config?siteId=${siteId}`);
         const data = await response.json();
         if (data.success && data.config) {
           remoteConfig = data.config;
           if (analytics) console.log('[AI PRL Assist] Remote config loaded:', data.config);
         }
       } catch (error) {
         if (analytics) console.warn('[AI PRL Assist] Failed to load remote config:', error);
       }
     }

     // Merge configs: remote overrides local
     const finalConfig = { 
       id, accountId, color, icon, position, size, showDelay, openDelay,
       exitIntent, scrollTrigger, windowMode, windowWidth, windowHeight,
       fallbackUrl, analytics, utmCapture, noOverlay,
       // Map remote config structure to local structure
       ...(remoteConfig.bubble && {
         color: remoteConfig.bubble.bg,
         icon: remoteConfig.bubble.icon,
         position: remoteConfig.bubble.position,
         size: remoteConfig.bubble.size
       }),
       ...(remoteConfig.triggers && {
         showDelay: remoteConfig.triggers.showBubbleAfterMs,
         openDelay: remoteConfig.triggers.openAfterMs,
         exitIntent: remoteConfig.triggers.exitIntent,
         scrollTrigger: remoteConfig.triggers.scrollTrigger
       }),
       ...(remoteConfig.overlay && {
         windowMode: remoteConfig.overlay.windowMode ? 'windowed' : 'fullscreen',
         windowWidth: parseInt(remoteConfig.overlay.windowWidth) || 420,
         windowHeight: parseInt(remoteConfig.overlay.windowHeight) || 650
       }),
       ...(remoteConfig.rules && {
         utmCapture: remoteConfig.rules.appendUTM
       }),
       // Direct remote config overrides
       noOverlay: remoteConfig.noOverlay || false,
       fallbackUrl: remoteConfig.fallbackUrl || fallbackUrl,
       analytics: remoteConfig.analytics?.console || analytics,
       // Teaser messages
       teaserEnabled: remoteConfig.teaserEnabled || false,
       teaserText: remoteConfig.teaserText || "Need help?",
       teaserDelay: remoteConfig.teaserDelay || 5000,
       teaserAutoclose: remoteConfig.teaserAutoclose || 10000,
       // Webhook system
       webhookUrl: remoteConfig.webhookUrl || null,
       webhookEvents: remoteConfig.webhookEvents || ['chat_opened', 'chat_closed']
     };

    if (!finalConfig.id || !finalConfig.accountId) {
      console.error('[AI PRL Assist] Missing required parameters: id, accountId');
      return;
    }

    // Build chat URL with UTM passthrough
    const buildChatUrl = () => {
      const baseUrl = `https://app.aiprlassist.com/webchat/?p=${finalConfig.accountId}&id=${finalConfig.id}`;
      const url = new URL(baseUrl);
      
      // Add current page context
      url.searchParams.set('embed', '1');
      url.searchParams.set('host', location.hostname);
      url.searchParams.set('page', location.href);
      if (document.referrer) url.searchParams.set('ref', document.referrer);
      
      // Capture and pass UTM parameters if enabled
      if (finalConfig.utmCapture) {
        const currentParams = new URLSearchParams(location.search);
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
          const value = currentParams.get(param);
          if (value) url.searchParams.set(param, value);
        });
      }
      
      return url.toString();
    };

    // Webhook system
    const sendWebhook = (event, data = {}) => {
      if (!finalConfig.webhookUrl || !finalConfig.webhookEvents.includes(event)) return;
      
      const payload = {
        event,
        timestamp: new Date().toISOString(),
        siteId: siteId,
        page: location.href,
        host: location.hostname,
        userAgent: navigator.userAgent,
        ...data
      };

      fetch(finalConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(error => {
        if (finalConfig.analytics) console.warn('[AI PRL Assist] Webhook failed:', error);
      });
    };

    // Create bubble HTML
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.innerHTML = `
        <style>
          .ai-prl-chat-bubble {
            position: fixed;
            ${finalConfig.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            bottom: 20px;
            width: ${finalConfig.size}px;
            height: ${finalConfig.size}px;
            background: ${finalConfig.color};
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2147483647;
            transition: transform 0.2s ease;
          }
          .ai-prl-chat-bubble:hover {
            transform: scale(1.1);
          }
          .ai-prl-chat-bubble img {
            width: 70%;
            height: 70%;
            object-fit: contain;
          }
          .ai-prl-chat-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            ${finalConfig.noOverlay ? 'background: transparent;' : 'background: rgba(0,0,0,0.5);'}
            z-index: 2147483646;
            display: none !important;
          }
          .ai-prl-chat-iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          .ai-prl-chat-close {
            position: fixed;
            ${finalConfig.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            bottom: 680px;
            background: #fff;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 8px 12px;
            font: 700 12px/1 system-ui, -apple-system, Segoe UI, Roboto;
            cursor: pointer;
            z-index: 2147483648;
            display: none;
          }
          @media (min-width: 768px) {
            .ai-prl-chat-overlay.show {
              display: flex !important;
              align-items: flex-end;
              justify-content: ${finalConfig.position.includes('right') ? 'flex-end' : 'flex-start'};
              padding: 20px;
            }
            .ai-prl-chat-iframe {
              width: ${finalConfig.windowWidth}px;
              height: ${finalConfig.windowHeight}px;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              margin-bottom: 80px;
            }
            .ai-prl-chat-close.show {
              display: block !important;
            }
          }
          .ai-prl-teaser {
            position: fixed;
            ${finalConfig.position.includes('right') ? 'right: 20px' : 'left: 20px'};
            bottom: 100px;
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 12px;
            padding: 15px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2147483646;
            max-width: 300px;
            animation: slideUp 0.3s ease;
          }
          .ai-prl-teaser-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }
          .ai-prl-teaser-text {
            font: 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto;
            color: #333;
            margin: 0;
          }
          .ai-prl-teaser-close {
            background: none;
            border: none;
            font-size: 18px;
            color: #666;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        </style>
                 <div class="ai-prl-chat-bubble" onclick="window.ChatWidget.open()" style="display: none;">
           <img src="${finalConfig.icon}" alt="Chat" />
         </div>
         ${finalConfig.teaserEnabled ? `
         <div class="ai-prl-teaser" style="display: none;">
           <div class="ai-prl-teaser-content">
             <span class="ai-prl-teaser-text">${finalConfig.teaserText}</span>
             <button class="ai-prl-teaser-close" onclick="window.ChatWidget.closeTeaser()">×</button>
           </div>
         </div>
         ` : ''}
                 <div class="ai-prl-chat-overlay" onclick="window.ChatWidget.close()">
           <iframe class="ai-prl-chat-iframe" src="about:blank"></iframe>
         </div>
         <button class="ai-prl-chat-close" onclick="window.ChatWidget.close()">✕ Close</button>
      `;
      
      document.body.appendChild(bubble);
      return bubble;
    };

         // Initialize
     const init = () => {
       const widget = createBubble();
       const overlay = widget.querySelector('.ai-prl-chat-overlay');
       const iframe = widget.querySelector('.ai-prl-chat-iframe');
       const closeBtn = widget.querySelector('.ai-prl-chat-close');
       const bubble = widget.querySelector('.ai-prl-chat-bubble');

       let chatOpened = false;

       // Public API
       window.ChatWidget.open = () => {
         let chatUrl = buildChatUrl();
         
         // Try fallback URL if primary fails
        const tryOpen = (url) => {
          iframe.src = url;
          overlay.classList.add('show');
          if (closeBtn) closeBtn.classList.add('show');
          chatOpened = true;
          sendWebhook('chat_opened', { url });
          
          if (finalConfig.analytics) console.log('[AI PRL Assist] Chat opened with URL:', url);
        };

        iframe.addEventListener('error', () => {
          if (finalConfig.fallbackUrl && !chatOpened) {
            if (finalConfig.analytics) console.warn('[AI PRL Assist] Primary URL failed, trying fallback');
            tryOpen(finalConfig.fallbackUrl);
          }
        }, { once: true });

         tryOpen(chatUrl);
       };

       window.ChatWidget.close = () => {
         overlay.classList.remove('show');
         if (closeBtn) closeBtn.classList.remove('show');
         iframe.src = 'about:blank';
         chatOpened = false;
         sendWebhook('chat_closed');
         if (finalConfig.analytics) console.log('[AI PRL Assist] Chat closed');
       };

       // Teaser functions
       window.ChatWidget.closeTeaser = () => {
         const teaser = document.querySelector('.ai-prl-teaser');
         if (teaser) teaser.style.display = 'none';
       };

       window.ChatWidget.showTeaser = () => {
         const teaser = document.querySelector('.ai-prl-teaser');
         if (teaser) teaser.style.display = 'block';
       };

       // Event handlers
       overlay.addEventListener('click', (e) => {
         if (e.target === overlay) window.ChatWidget.close();
       });
       
       if (closeBtn) {
         closeBtn.addEventListener('click', window.ChatWidget.close);
       }

       // ESC key to close
       document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape') window.ChatWidget.close();
       });

       // Show bubble after delay
       setTimeout(() => {
         bubble.style.display = 'flex';
         if (finalConfig.analytics) console.log('[AI PRL Assist] Bubble shown');
       }, finalConfig.showDelay);

       // Show teaser after delay
       if (finalConfig.teaserEnabled) {
         setTimeout(() => {
           window.ChatWidget.showTeaser();
           sendWebhook('teaser_shown');
           if (finalConfig.analytics) console.log('[AI PRL Assist] Teaser shown');
         }, finalConfig.teaserDelay);

         // Auto-close teaser
         if (finalConfig.teaserAutoclose > 0) {
           setTimeout(() => {
             window.ChatWidget.closeTeaser();
             sendWebhook('teaser_autoclosed');
           }, finalConfig.teaserDelay + finalConfig.teaserAutoclose);
         }
       }

       // Auto-open after delay
       if (finalConfig.openDelay > 0) {
         setTimeout(() => {
           window.ChatWidget.open();
         }, finalConfig.openDelay);
       }

       // Exit intent trigger
       if (finalConfig.exitIntent) {
         document.addEventListener('mouseleave', (e) => {
           if (e.clientY < 0) {
             window.ChatWidget.open();
           }
         });
       }

       // Scroll trigger
       if (finalConfig.scrollTrigger) {
         let triggered = false;
         window.addEventListener('scroll', () => {
           if (triggered) return;
           const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
           if (scrollPercent >= 75) {
             window.ChatWidget.open();
             triggered = true;
           }
         });
       }

       if (finalConfig.analytics) console.log('[AI PRL Assist] Widget ready with config:', finalConfig);
     };

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  };
})();
