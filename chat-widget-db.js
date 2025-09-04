(() => {
  if (window.__aiPrlAssistLoaded) return;
  window.__aiPrlAssistLoaded = true;

  // Global namespace
  window.ChatWidget = window.ChatWidget || {};

  // Setup function - called by client
  window.ChatWidget.setup = async (config) => {
    const {
      siteId,
      id,
      accountId, 
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
      apiBase = null // Allow custom API base for testing
    } = config;

    // Determine configuration source
    let finalConfig = null;

    if (siteId) {
      // Load from database API
      try {
        const baseUrl = apiBase || window.location.origin;
        const response = await fetch(`${baseUrl}/api/load-config?siteId=${siteId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.config) {
            finalConfig = data.config;
            if (analytics) {
              console.log(`[AI PRL Assist] Loaded config from database for siteId: ${siteId}`, {
                clientName: data.clientName,
                source: 'database',
                updatedAt: data.updatedAt
              });
            }
          } else {
            if (analytics) console.warn(`[AI PRL Assist] Invalid config response for siteId: ${siteId}`, data);
          }
        } else {
          if (analytics) console.warn(`[AI PRL Assist] Failed to load config for siteId: ${siteId}`, response.status);
        }
      } catch (error) {
        if (analytics) console.error(`[AI PRL Assist] Error loading config for siteId: ${siteId}`, error);
      }
    }

    // Fallback to inline config if database load failed
    if (!finalConfig) {
      if (!id || !accountId) {
        console.error('[AI PRL Assist] Missing required parameters: siteId (for database) or id+accountId (for inline)');
        return;
      }

      // Build inline config
      finalConfig = {
        chatUrl: `https://app.aiprlassist.com/webchat/?p=${accountId}&id=${id}`,
        fallbackUrl: fallbackUrl,
        bubble: {
          position: position === "bottom-left" ? "bl" : "br",
          size: size,
          bg: color,
          color: "#ffffff",
          iconUrl: icon,
          pulse: true,
          zIndex: 2147483000
        },
        triggers: {
          showBubbleAfterMs: showDelay,
          openAfterMs: openDelay,
          triggerOnScrollPercent: scrollTrigger ? 75 : 0,
          triggerOnExitIntent: exitIntent
        },
        rules: {
          includePaths: ["*"],
          excludePaths: [],
          showOnMobile: true,
          showOnDesktop: true,
          appendUTM: utmCapture
        },
        overlay: {
          bg: "rgba(0,0,0,0.45)",
          closeOnEsc: true,
          windowMode: windowMode === "windowed",
          windowWidth: windowWidth + "px",
          windowHeight: windowHeight + "px"
        },
        analytics: {
          console: analytics
        }
      };

      if (analytics) {
        console.log(`[AI PRL Assist] Using inline config (database load ${siteId ? 'failed' : 'not attempted'})`, finalConfig);
      }
    }

    // Build chat URL with UTM passthrough
    const buildChatUrl = () => {
      const baseUrl = finalConfig.chatUrl;
      const url = new URL(baseUrl);
      
      // Add current page context
      url.searchParams.set('embed', '1');
      url.searchParams.set('host', location.hostname);
      url.searchParams.set('page', location.href);
      if (document.referrer) url.searchParams.set('ref', document.referrer);
      
      // Capture and pass UTM parameters
      if (finalConfig.rules.appendUTM) {
        const currentParams = new URLSearchParams(location.search);
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
          const value = currentParams.get(param);
          if (value) url.searchParams.set(param, value);
        });
      }
      
      return url.toString();
    };

    // Create bubble HTML
    const createBubble = () => {
      const bubble = document.createElement('div');
      const bubbleConfig = finalConfig.bubble;
      const overlayConfig = finalConfig.overlay;
      
      bubble.innerHTML = `
        <style>
          .ai-prl-chat-bubble {
            position: fixed;
            ${bubbleConfig.position === 'bl' ? 'left: 20px' : 'right: 20px'};
            bottom: 20px;
            width: ${bubbleConfig.size}px;
            height: ${bubbleConfig.size}px;
            background: ${bubbleConfig.bg};
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: ${bubbleConfig.zIndex || 2147483647};
            transition: transform 0.2s ease;
            ${bubbleConfig.pulse ? 'animation: ai-prl-pulse 2s infinite;' : ''}
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
            background: ${overlayConfig.bg};
            z-index: ${(bubbleConfig.zIndex || 2147483647) - 1};
            display: none;
          }
          .ai-prl-chat-iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          .ai-prl-chat-close {
            position: fixed;
            ${bubbleConfig.position === 'bl' ? 'left: 20px' : 'right: 20px'};
            bottom: ${parseInt(overlayConfig.windowHeight) + 40}px;
            background: #fff;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 8px 12px;
            font: 700 12px/1 system-ui, -apple-system, Segoe UI, Roboto;
            cursor: pointer;
            z-index: ${bubbleConfig.zIndex || 2147483647};
            display: none;
          }
          @keyframes ai-prl-pulse {
            0% { box-shadow: 0 0 0 0 ${bubbleConfig.bg}66; }
            70% { box-shadow: 0 0 0 10px ${bubbleConfig.bg}00; }
            100% { box-shadow: 0 0 0 0 ${bubbleConfig.bg}00; }
          }
          @media (min-width: 768px) {
            .ai-prl-chat-overlay {
              display: flex;
              align-items: ${overlayConfig.windowMode ? 'flex-end' : 'center'};
              justify-content: ${bubbleConfig.position === 'bl' ? 'flex-start' : 'flex-end'};
              padding: 20px;
            }
            .ai-prl-chat-iframe {
              width: ${overlayConfig.windowMode ? overlayConfig.windowWidth : '100%'};
              height: ${overlayConfig.windowMode ? overlayConfig.windowHeight : '100%'};
              border-radius: ${overlayConfig.windowMode ? '12px' : '0'};
              box-shadow: ${overlayConfig.windowMode ? '0 20px 60px rgba(0,0,0,0.3)' : 'none'};
              margin-bottom: ${overlayConfig.windowMode ? '80px' : '0'};
            }
            .ai-prl-chat-close {
              display: ${overlayConfig.windowMode ? 'block' : 'none'};
            }
          }
        </style>
        <div class="ai-prl-chat-bubble" onclick="window.ChatWidget.open()">
          <img src="${bubbleConfig.iconUrl}" alt="Chat" />
        </div>
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
          overlay.style.display = window.innerWidth >= 768 ? 'flex' : 'block';
          if (closeBtn) closeBtn.style.display = window.innerWidth >= 768 ? 'block' : 'none';
          chatOpened = true;
          
          if (finalConfig.analytics.console) {
            console.log('[AI PRL Assist] Chat opened with URL:', url);
          }
        };

        iframe.addEventListener('error', () => {
          if (finalConfig.fallbackUrl && !chatOpened) {
            if (finalConfig.analytics.console) {
              console.warn('[AI PRL Assist] Primary URL failed, trying fallback');
            }
            tryOpen(finalConfig.fallbackUrl);
          }
        }, { once: true });

        tryOpen(chatUrl);
      };

      window.ChatWidget.close = () => {
        overlay.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'none';
        iframe.src = 'about:blank';
        chatOpened = false;
        if (finalConfig.analytics.console) {
          console.log('[AI PRL Assist] Chat closed');
        }
      };

      // Event handlers
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) window.ChatWidget.close();
      });
      
      if (closeBtn) {
        closeBtn.addEventListener('click', window.ChatWidget.close);
      }

      // ESC key to close
      if (finalConfig.overlay.closeOnEsc) {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') window.ChatWidget.close();
        });
      }

      // Show bubble after delay
      setTimeout(() => {
        bubble.style.display = 'flex';
        if (finalConfig.analytics.console) {
          console.log('[AI PRL Assist] Bubble shown');
        }
      }, finalConfig.triggers.showBubbleAfterMs);

      // Auto-open after delay
      if (finalConfig.triggers.openAfterMs > 0) {
        setTimeout(() => {
          window.ChatWidget.open();
        }, finalConfig.triggers.openAfterMs);
      }

      // Exit intent trigger
      if (finalConfig.triggers.triggerOnExitIntent) {
        document.addEventListener('mouseleave', (e) => {
          if (e.clientY < 0) {
            window.ChatWidget.open();
          }
        });
      }

      // Scroll trigger
      if (finalConfig.triggers.triggerOnScrollPercent > 0) {
        let triggered = false;
        window.addEventListener('scroll', () => {
          if (triggered) return;
          const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercent >= finalConfig.triggers.triggerOnScrollPercent) {
            window.ChatWidget.open();
            triggered = true;
          }
        });
      }

      if (finalConfig.analytics.console) {
        console.log('[AI PRL Assist] Widget ready with config:', {
          source: siteId ? 'database' : 'inline',
          siteId: siteId || 'inline',
          chatUrl: finalConfig.chatUrl,
          triggers: finalConfig.triggers
        });
      }
    };

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  };
})();
