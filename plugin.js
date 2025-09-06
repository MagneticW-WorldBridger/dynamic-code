(() => {
  if (window.__aiPrlAssistLoaded) return;
  window.__aiPrlAssistLoaded = true;

  // Global namespace
  window.ChatWidget = window.ChatWidget || {};

     // Setup function - called by client
   window.ChatWidget.setup = (config) => {
     const {
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
       utmCapture = true
     } = config;

    if (!id || !accountId) {
      console.error('[AI PRL Assist] Missing required parameters: id, accountId');
      return;
    }

    // Build chat URL with UTM passthrough
    const buildChatUrl = () => {
      const baseUrl = `https://app.aiprlassist.com/webchat/?p=${accountId}&id=${id}`;
      const url = new URL(baseUrl);
      
      // Add current page context
      url.searchParams.set('embed', '1');
      url.searchParams.set('host', location.hostname);
      url.searchParams.set('page', location.href);
      if (document.referrer) url.searchParams.set('ref', document.referrer);
      
      // Capture and pass UTM parameters
      const currentParams = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
        const value = currentParams.get(param);
        if (value) url.searchParams.set(param, value);
      });
      
      return url.toString();
    };

    // Create bubble HTML
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.innerHTML = `
        <style>
          .ai-prl-chat-bubble {
            position: fixed;
            ${position.includes('right') ? 'right: 20px' : 'left: 20px'};
            bottom: 20px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
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
             background: rgba(0,0,0,0.5);
             z-index: 2147483646;
             display: none;
           }
           .ai-prl-chat-iframe {
             width: 100%;
             height: 100%;
             border: none;
           }
           .ai-prl-chat-close {
             position: fixed;
             ${position.includes('right') ? 'right: 20px' : 'left: 20px'};
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
             .ai-prl-chat-overlay {
               display: flex;
               align-items: flex-end;
               justify-content: ${position.includes('right') ? 'flex-end' : 'flex-start'};
               padding: 20px;
             }
             .ai-prl-chat-iframe {
               width: 420px;
               height: 650px;
               border-radius: 12px;
               box-shadow: 0 20px 60px rgba(0,0,0,0.3);
               margin-bottom: 80px;
             }
             .ai-prl-chat-close {
               display: block;
             }
           }
        </style>
                 <div class="ai-prl-chat-bubble" onclick="window.ChatWidget.open()" style="display: none;">
           <img src="${icon}" alt="Chat" />
         </div>
                 <div class="ai-prl-chat-overlay" onclick="window.ChatWidget.close()">
           <iframe class="ai-prl-chat-iframe" src="about:blank"></iframe>
         </div>
         <button class="ai-prl-chat-close" onclick="window.ChatWidget.close()">✕ Cerrar</button>
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
           
           if (analytics) console.log('[AI PRL Assist] Chat opened with URL:', url);
         };

         iframe.addEventListener('error', () => {
           if (fallbackUrl && !chatOpened) {
             if (analytics) console.warn('[AI PRL Assist] Primary URL failed, trying fallback');
             tryOpen(fallbackUrl);
           }
         }, { once: true });

         tryOpen(chatUrl);
       };

       window.ChatWidget.close = () => {
         overlay.style.display = 'none';
         if (closeBtn) closeBtn.style.display = 'none';
         iframe.src = 'about:blank';
         chatOpened = false;
         if (analytics) console.log('[AI PRL Assist] Chat closed');
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
         if (analytics) console.log('[AI PRL Assist] Bubble shown');
       }, showDelay);

       // Auto-open after delay
       if (openDelay > 0) {
         setTimeout(() => {
           window.ChatWidget.open();
         }, openDelay);
       }

       // Exit intent trigger
       if (exitIntent) {
         document.addEventListener('mouseleave', (e) => {
           if (e.clientY < 0) {
             window.ChatWidget.open();
           }
         });
       }

       // Scroll trigger
       if (scrollTrigger) {
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

       if (analytics) console.log('[AI PRL Assist] Widget ready with config:', {
         id, accountId, color, size, position, showDelay, openDelay, exitIntent, scrollTrigger
       });
     };

    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  };
})();
