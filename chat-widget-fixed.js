(() => {
  const NS = "cw_v1";
  if (window.__chatWidgetLoaded) return;
  window.__chatWidgetLoaded = true;

  // CONFIGURACIÓN SIMPLIFICADA QUE FUNCIONA
  const defaults = {
    chatUrl: "https://app.aiprlassist.com/webchat/?p=1145545&ref=1746548719207",
    bubble: {
      position: "br",
      size: 64,
      bg: "#ff0000", // ROJO para debug
      color: "#ffffff",
      zIndex: 9999999 // z-index más bajo
    },
    triggers: {
      showBubbleAfterMs: 1000
    },
    rules: {
      includePaths: ["*"],
      excludePaths: [],
      showOnMobile: true,
      showOnDesktop: true
    },
    analytics: { console: true }
  };

  const state = { cfg: null, open: false, shadow: null, els: {} };

  const getConfig = () => {
    const g = window.ChatWidget || {};
    const inline = g.inlineConfig || {};
    return Object.assign({}, defaults, inline);
  };

  // CSS SIMPLIFICADO QUE FUNCIONA
  const css = (cfg) => `
    .cw-bubble { 
      position: fixed !important; 
      ${cfg.bubble.position === 'bl' ? 'left: 20px' : 'right: 20px'} !important; 
      bottom: 20px !important; 
      width: ${cfg.bubble.size}px !important; 
      height: ${cfg.bubble.size}px !important; 
      border-radius: 50% !important; 
      background: ${cfg.bubble.bg} !important; 
      color: ${cfg.bubble.color} !important; 
      border: none !important;
      cursor: pointer !important; 
      z-index: ${cfg.bubble.zIndex} !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 24px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    }
    .cw-overlay { 
      position: fixed !important; 
      top: 0 !important; 
      left: 0 !important; 
      width: 100% !important; 
      height: 100% !important; 
      background: rgba(0,0,0,0.5) !important; 
      z-index: ${cfg.bubble.zIndex + 1} !important;
      display: none;
    }
    .cw-iframe { 
      width: 100% !important; 
      height: 100% !important; 
      border: 0 !important; 
    }
    .cw-close { 
      position: fixed !important; 
      top: 20px !important; 
      right: 20px !important; 
      background: white !important; 
      border: 2px solid #ccc !important; 
      padding: 10px !important; 
      cursor: pointer !important; 
      z-index: ${cfg.bubble.zIndex + 2} !important;
    }
  `;

  const createShadowDOM = () => {
    const host = document.createElement('div');
    host.id = `${NS}-host`;
    document.body.appendChild(host); // ← CAMBIO: usar body en lugar de documentElement
    const shadow = host.attachShadow({ mode: 'open' });
    state.shadow = shadow;
    return shadow;
  };

  const appendParams = (url) => {
    try {
      const u = new URL(url);
      u.searchParams.set('embed', '1');
      // include port when present (e.g., localhost:8000)
      u.searchParams.set('host', location.host);
      u.searchParams.set('page', location.href);
      if (document.referrer) u.searchParams.set('ref', document.referrer);
      const qp = new URLSearchParams(location.search);
      ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => {
        const v = qp.get(k);
        if (v) u.searchParams.set(k, v);
      });
      return u.toString();
    } catch (_) {
      const sep = url.includes('?') ? '&' : '?';
      return `${url}${sep}embed=1&host=${encodeURIComponent(location.host)}`;
    }
  };

  const buildUI = (cfg) => {
    console.log('[ChatWidget] Building UI with config:', cfg);
    
    const shadow = createShadowDOM();
    
    // Styles
    const style = document.createElement('style');
    style.textContent = css(cfg);
    shadow.appendChild(style);

    // Bubble
    const bubble = document.createElement('button');
    bubble.className = 'cw-bubble';
    bubble.textContent = '💬';
    bubble.onclick = () => openChat(cfg);
    shadow.appendChild(bubble);

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'cw-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) closeChat(); };
    
    const iframe = document.createElement('iframe');
    iframe.className = 'cw-iframe';
    try { iframe.referrerPolicy = 'origin-when-cross-origin'; } catch (_) {}
    
    const close = document.createElement('button');
    close.className = 'cw-close';
    close.textContent = '✕ Cerrar';
    close.onclick = closeChat;
    
    overlay.appendChild(iframe);
    overlay.appendChild(close);
    shadow.appendChild(overlay);

    state.els = { bubble, overlay, iframe, close };
    
    console.log('[ChatWidget] UI created, elements:', state.els);
    
    // MOSTRAR INMEDIATAMENTE (sin delays complicados)
    setTimeout(() => {
      console.log('[ChatWidget] Showing bubble now');
      // NO OCULTAR - dejar visible
    }, cfg.triggers.showBubbleAfterMs);
  };

  const openChat = (cfg) => {
    console.log('[ChatWidget] Opening chat');
    if (state.open) return;
    state.open = true;
    const { overlay, iframe } = state.els;
    const finalUrl = appendParams(cfg.chatUrl);
    console.log('[ChatWidget] iframe src =>', finalUrl);
    iframe.src = finalUrl;
    overlay.style.display = 'block';
  };

  const closeChat = () => {
    console.log('[ChatWidget] Closing chat');
    if (!state.open) return;
    state.open = false;
    const { overlay, iframe } = state.els;
    overlay.style.display = 'none';
    iframe.src = 'about:blank';
  };

  const shouldShow = (cfg) => {
    console.log('[ChatWidget] Checking if should show...');
    // SIMPLIFICADO - siempre mostrar para debug
    return true;
  };

  const boot = () => {
    console.log('[ChatWidget] Booting...');
    const cfg = getConfig();
    state.cfg = cfg;
    console.log('[ChatWidget] Final config:', cfg);

    if (!shouldShow(cfg)) {
      console.log('[ChatWidget] Should not show, aborting');
      return;
    }

    buildUI(cfg);

    // API pública
    window.ChatWidget = Object.assign(window.ChatWidget || {}, {
      open: () => openChat(cfg),
      close: closeChat,
      version: NS
    });

    console.log('[ChatWidget] Ready!');
  };

  // BOOT INMEDIATO
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
