(() => {
  if (window.__aiPrlAssistLoaded) return;
  window.__aiPrlAssistLoaded = true;

  const deepMerge = (target, src) => {
    for (const k in src) {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
        if (!target[k]) target[k] = {};
        deepMerge(target[k], src[k]);
      } else if (src[k] !== undefined) {
        target[k] = src[k];
      }
    }
    return target;
  };

  const defaults = {
    id: '',
    accountId: '',
    color: '#E67E22',
    icon: 'https://storage.googleapis.com/msgsndr/ecow5j0SgdAz2vzC0C4Q/media/68b225bbb40ac6d4eb8b4ded.png',
    position: 'br', // br | bl | bottom-right | bottom-left
    size: 68,
    overlayBg: 'rgba(0,0,0,0.35)',
    windowMode: true,
    windowWidth: 420,
    windowHeight: 650,
    mobileFullscreen: true,
    showBubbleAfterMs: 1000,
    openAfterMs: 0,
    chatUrl: '' // optional direct URL; if set, overrides id/accountId
  };

  const toPos = (p) => (p === 'bottom-left' || p === 'bl') ? 'bl' : 'br';

  const buildUrl = (cfg) => {
    const baseUrl = cfg.chatUrl && cfg.chatUrl.includes('http')
      ? cfg.chatUrl
      : `https://app.aiprlassist.com/webchat/?p=${encodeURIComponent(cfg.accountId)}&id=${encodeURIComponent(cfg.id)}`;
    const url = new URL(baseUrl);
    url.searchParams.set('embed', '1');
    url.searchParams.set('host', location.hostname);
    url.searchParams.set('page', location.href);
    if (document.referrer) url.searchParams.set('ref', document.referrer);
    const qp = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => {
      const v = qp.get(k);
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  };

  const cssFor = (cfg) => `
    .ai-prl-chat-bubble { position: fixed; ${toPos(cfg.position)==='bl'?'left:20px':'right:20px'}; bottom: 20px; width:${cfg.size}px; height:${cfg.size}px; background:${cfg.color}; border-radius:50%; cursor:pointer; display:none; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.15); z-index:2147483647; transition: transform .2s ease; }
    .ai-prl-chat-bubble:hover { transform: scale(1.1); }
    .ai-prl-chat-bubble img { width:70%; height:70%; object-fit:contain; }
    .ai-prl-chat-overlay { position: fixed; inset: 0; background:${cfg.overlayBg}; z-index:2147483646; display:none; }
    .ai-prl-chat-modal { position: fixed; ${toPos(cfg.position)==='bl'?'left:20px':'right:20px'}; bottom: 20px; width:${cfg.windowWidth}px; height:${cfg.windowHeight}px; border-radius:12px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.3); background:#fff; }
    .ai-prl-chat-iframe { width:100%; height:100%; border:0; }
    .ai-prl-chat-close { position: fixed; ${toPos(cfg.position)==='bl'?'left:20px':'right:20px'}; bottom:${20 + cfg.windowHeight + 12}px; background:#fff; border:2px solid #e9ecef; border-radius:10px; padding:8px 10px; font:700 12px/1 system-ui,-apple-system,Segoe UI,Roboto; cursor:pointer; z-index:2147483647; }
    @media (max-width: 767px) {
      .ai-prl-chat-modal { display:none; }
      .ai-prl-chat-overlay.fullscreen { display:block; }
      .ai-prl-chat-overlay.fullscreen .ai-prl-chat-iframe { position: fixed; inset:0; width:100%; height:100%; border-radius:0; }
      .ai-prl-chat-close { display:none; }
    }
  `;

  const createDOM = (cfg) => {
    const root = document.createElement('div');
    root.innerHTML = `
      <style>${cssFor(cfg)}</style>
      <div class="ai-prl-chat-bubble"><img src="${cfg.icon}" alt="Chat"/></div>
      <div class="ai-prl-chat-overlay"><div class="ai-prl-chat-modal"><iframe class="ai-prl-chat-iframe" src="about:blank"></iframe></div></div>
      <button class="ai-prl-chat-close">✕ Cerrar</button>
    `;
    document.body.appendChild(root);
    return {
      bubble: root.querySelector('.ai-prl-chat-bubble'),
      overlay: root.querySelector('.ai-prl-chat-overlay'),
      modal: root.querySelector('.ai-prl-chat-modal'),
      iframe: root.querySelector('.ai-prl-chat-iframe'),
      closeBtn: root.querySelector('.ai-prl-chat-close')
    };
  };

  const schedule = (els, cfg) => {
    setTimeout(() => { els.bubble.style.display = 'flex'; }, Math.max(0, cfg.showBubbleAfterMs||0));
    if ((cfg.openAfterMs||0) > 0) {
      setTimeout(() => { window.ChatWidget.open(); }, cfg.openAfterMs);
    }
  };

  const attachAPI = (els, cfg) => {
    const openDesktop = () => {
      els.iframe.src = buildUrl(cfg);
      els.overlay.style.display = 'block';
      els.overlay.classList.remove('fullscreen');
      els.modal.style.display = cfg.windowMode ? 'block' : 'none';
    };
    const openMobile = () => {
      els.iframe.src = buildUrl(cfg);
      els.overlay.style.display = 'block';
      els.overlay.classList.add('fullscreen');
    };
    window.ChatWidget.open = () => {
      if (window.innerWidth < 768 && cfg.mobileFullscreen) openMobile();
      else openDesktop();
      console.log('[AI PRL Assist] Chat opened');
    };
    window.ChatWidget.close = () => {
      els.overlay.style.display = 'none';
      els.overlay.classList.remove('fullscreen');
      els.iframe.src = 'about:blank';
      console.log('[AI PRL Assist] Chat closed');
    };
  };

  // Global namespace
  window.ChatWidget = window.ChatWidget || {};

  // Setup function - supports direct params or remote config via siteId/configUrl
  window.ChatWidget.setup = async (config) => {
    try {
      const baseCfg = deepMerge({}, defaults);
      let finalCfg = deepMerge(baseCfg, config || {});

      // Remote config support
      if (config && config.siteId && config.configUrl) {
        let url = String(config.configUrl);
        url = url.replace(/\{\{\s*siteId\s*\}\}/g, config.siteId);
        try {
          const res = await fetch(url, { credentials: 'omit', cache: 'no-store' });
          if (res.ok) {
            const remote = await res.json();
            finalCfg = deepMerge(finalCfg, remote || {});
          } else {
            console.warn('[AI PRL Assist] Remote config fetch failed:', res.status);
          }
        } catch (e) {
          console.warn('[AI PRL Assist] Remote config fetch error:', e);
        }
      }

      // Validate essentials if no direct chatUrl
      if (!finalCfg.chatUrl && (!finalCfg.id || !finalCfg.accountId)) {
        console.error('[AI PRL Assist] Missing id/accountId or chatUrl');
        return;
      }

      const els = createDOM(finalCfg);
      attachAPI(els, finalCfg);
      els.bubble.addEventListener('click', () => window.ChatWidget.open());
      els.overlay.addEventListener('click', (e) => { if (e.target === els.overlay) window.ChatWidget.close(); });
      els.closeBtn.addEventListener('click', () => window.ChatWidget.close());

      // ESC key to close
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.ChatWidget.close(); });

      schedule(els, finalCfg);
      console.log('[AI PRL Assist] Widget ready');
    } catch (err) {
      console.error('[AI PRL Assist] setup error', err);
    }
  };
})();
