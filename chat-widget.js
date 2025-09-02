(() => {
  const NS = "cw_v1";
  if (window.__chatWidgetLoaded) return; // idempotent
  window.__chatWidgetLoaded = true;

  const deepMerge = (target, src) => {
    for (const k in src) {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
        if (!target[k]) target[k] = {};
        deepMerge(target[k], src[k]);
      } else {
        target[k] = src[k];
      }
    }
    return target;
  };

  const defaults = {
    chatUrl: "https://app.aiprlassist.com/webchat/?p=1145545&id=O1T4KXJ9xZ",
    delay: 0, // legacy
    bubbleText: "¿Necesitas ayuda?",
    bubble: {
      position: "br", // br | bl
      size: 64,
      bg: "#6f0302",
      color: "#ffffff",
      outline: "#ffffff",
      label: "",
      iconUrl: "",
      pulse: true,
      zIndex: 2147483000
    },
    teaser: {
      enabled: true,
      text: "¿Te ayudo?",
      delayMs: 3000,
      autocloseMs: 0
    },
    triggers: {
      showBubbleAfterMs: 1000,
      openAfterMs: 0,
      triggerOnScrollPercent: 0,
      triggerOnExitIntent: false
    },
    rules: {
      includePaths: ["*"],
      excludePaths: [],
      showOnMobile: true,
      showOnDesktop: true,
      minWidth: 0,
      maxWidth: 100000,
      frequencyCapHours: 24,
      appendUTM: true
    },
    overlay: {
      bg: "rgba(0,0,0,0.4)",
      closeOnEsc: true
    },
    analytics: { console: false }
  };

  const state = {
    cfg: null,
    open: false,
    shadow: null,
    els: {},
    lastAutoOpenKey: `${NS}_last_auto_open`
  };

  const getGlobalCfg = () => {
    const g = window.ChatWidget || {};
    const inline = g.inlineConfig || {};
    const base = deepMerge({}, defaults);
    deepMerge(base, inline);
    if (g.siteId) base.siteId = g.siteId;

    // Resolve remote config URL
    let remoteUrl = g.configUrl;
    if (remoteUrl && base.siteId) {
      remoteUrl = remoteUrl.replace(/\{\{siteId\}\}/g, base.siteId);
    }
    return { base, remoteUrl };
  };

  const fetchRemoteCfg = async (url) => {
    if (!url) return null;
    try {
      const res = await fetch(url, { credentials: 'omit', cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  };

  const matchPath = (patterns) => {
    if (!patterns || !patterns.length) return true;
    const path = window.location.pathname;
    const result = patterns.some((p) => {
      if (p === "*") return true;
      if (p.endsWith("*")) return path.startsWith(p.slice(0, -1));
      return path === p;
    });
    console.log('[ChatWidget] matchPath:', { path, patterns, result });
    return result;
  };

  const css = (cfg) => `
    :host { all: initial; }
    .cw-wrap { position: fixed; inset: 0; pointer-events: none; }
    .cw-bubble { position: fixed; ${cfg.bubble.position === 'bl' ? 'left:20px' : 'right:20px'}; bottom:20px; width:${cfg.bubble.size}px; height:${cfg.bubble.size}px; border-radius:50%; background:${cfg.bubble.bg}; color:${cfg.bubble.color}; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 10px 24px rgba(0,0,0,.18); outline:2px solid ${cfg.bubble.outline}; pointer-events:auto; z-index:${cfg.bubble.zIndex}; }
    .cw-bubble img { width:70%; height:70%; object-fit:contain; border-radius:50%; }
    .cw-label { position: fixed; ${cfg.bubble.position === 'bl' ? 'left' : 'right'}:${20 + cfg.bubble.size + 12}px; bottom:${20 + (cfg.bubble.size/2 - 16)}px; background:#fff; color:#1c1c1e; border:2px solid #e9ecef; border-radius:8px; padding:6px 10px; font:600 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto; box-shadow:0 4px 14px rgba(0,0,0,.12); pointer-events:auto; z-index:${cfg.bubble.zIndex}; }
    .cw-label.hide { display:none; }
    .cw-teaser { position: fixed; ${cfg.bubble.position === 'bl' ? 'left:20px' : 'right:20px'}; bottom:${20 + cfg.bubble.size + 12}px; background:#fff; color:#1c1c1e; border:2px solid #e9ecef; border-radius:8px; padding:8px 12px; font:600 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto; box-shadow:0 4px 14px rgba(0,0,0,.12); display:none; pointer-events:auto; z-index:${cfg.bubble.zIndex}; max-width: 300px; }
    .cw-overlay { position: fixed; inset: 0; background:${cfg.overlay.bg}; display:none; z-index:${cfg.bubble.zIndex + 1}; }
    .cw-modal { position: fixed; inset:0; background:#0000; display:flex; align-items:stretch; justify-content:stretch; }
    .cw-iframe { width:100%; height:100%; border:0; }
    .cw-close { position: fixed; top:14px; ${cfg.bubble.position === 'bl' ? 'left:14px' : 'right:14px'}; background:#fff; border:2px solid #e9ecef; border-radius:10px; font:700 13px/1 system-ui, -apple-system, Segoe UI, Roboto; padding:10px 12px; cursor:pointer; z-index:${cfg.bubble.zIndex + 2}; }
    .cw-pulse { animation: cw-pulse 1.2s infinite; }
    @keyframes cw-pulse { 0%{box-shadow:0 0 0 0 rgba(18,167,18,.6)} 70%{box-shadow:0 0 0 14px rgba(18,167,18,0)} 100%{box-shadow:0 0 0 0 rgba(18,167,18,0)} }
  `;

  const addShadow = () => {
    const host = document.createElement('div');
    host.id = `${NS}-host`;
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    state.shadow = shadow;
    return shadow;
  };

  const buildUI = (cfg) => {
    const shadow = state.shadow || addShadow();
    const style = document.createElement('style');
    style.textContent = css(cfg);

    const wrap = document.createElement('div');
    wrap.className = 'cw-wrap';

    // Bubble
    const bubble = document.createElement('button');
    bubble.className = `cw-bubble ${cfg.bubble.pulse ? 'cw-pulse' : ''}`;
    bubble.setAttribute('aria-label', 'Abrir chat');
    if (cfg.bubble.iconUrl) {
      const img = document.createElement('img');
      img.src = cfg.bubble.iconUrl;
      img.alt = 'Chat icon';
      bubble.appendChild(img);
    } else {
      bubble.textContent = '💬';
    }

    // Label (optional)
    const label = document.createElement('div');
    label.className = 'cw-label';
    label.textContent = cfg.bubble.label || '';
    if (!cfg.bubble.label) label.classList.add('hide');

    // Teaser
    const teaser = document.createElement('div');
    teaser.className = 'cw-teaser';
    teaser.textContent = cfg.teaser.text || '¿Necesitas ayuda?';

    // Overlay + iframe
    const overlay = document.createElement('div');
    overlay.className = 'cw-overlay';
    const modal = document.createElement('div');
    modal.className = 'cw-modal';
    const iframe = document.createElement('iframe');
    iframe.className = 'cw-iframe';

    const close = document.createElement('button');
    close.className = 'cw-close';
    close.textContent = '✕ Cerrar chat';

    modal.appendChild(iframe);
    overlay.appendChild(modal);

    shadow.appendChild(style);
    shadow.appendChild(wrap);
    shadow.appendChild(teaser);
    shadow.appendChild(label);
    shadow.appendChild(bubble);
    shadow.appendChild(overlay);
    shadow.appendChild(close);

    state.els = { bubble, label, teaser, overlay, iframe, close };

    // Events
    bubble.addEventListener('click', () => openChat(cfg));
    teaser.addEventListener('click', () => openChat(cfg));
    close.addEventListener('click', closeChat);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeChat(); });
    if (cfg.overlay.closeOnEsc) {
      window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChat(); });
    }
  };

  const appendParams = (url, cfg) => {
    try {
      const u = new URL(url);
      u.searchParams.set('embed', '1');
      u.searchParams.set('host', location.hostname);
      u.searchParams.set('page', location.href);
      if (document.referrer) u.searchParams.set('ref', document.referrer);
      if (cfg.rules.appendUTM) {
        const qp = new URLSearchParams(location.search);
        ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => {
          if (qp.get(k)) u.searchParams.set(k, qp.get(k));
        });
      }
      return u.toString();
    } catch (_) { return url; }
  };

  const openChat = (cfg) => {
    if (state.open) return;
    state.open = true;
    const { overlay, iframe } = state.els;
    iframe.src = appendParams(cfg.chatUrl, cfg);
    overlay.style.display = 'block';
    if (cfg.analytics.console) console.log('[ChatWidget] open');
  };

  const closeChat = () => {
    if (!state.open) return;
    state.open = false;
    const { overlay, iframe } = state.els;
    overlay.style.display = 'none';
    iframe.src = 'about:blank';
    if (state.cfg.analytics.console) console.log('[ChatWidget] close');
  };

  const exitIntent = (cb) => {
    const handler = (e) => { if (e.clientY < 0 || e.clientY < 10) { window.removeEventListener('mouseout', handler); cb(); } };
    window.addEventListener('mouseout', handler);
  };

  const shouldShow = (cfg) => {
    const w = window.innerWidth;
    const isMobile = w < 768;
    console.log('[ChatWidget] shouldShow check:', {
      width: w,
      isMobile,
      showOnMobile: cfg.rules.showOnMobile,
      showOnDesktop: cfg.rules.showOnDesktop,
      currentPath: window.location.pathname,
      includePaths: cfg.rules.includePaths,
      excludePaths: cfg.rules.excludePaths
    });
    
    if (isMobile && !cfg.rules.showOnMobile) {
      console.log('[ChatWidget] Blocked: mobile not allowed');
      return false;
    }
    if (!isMobile && !cfg.rules.showOnDesktop) {
      console.log('[ChatWidget] Blocked: desktop not allowed');
      return false;
    }
    if (!matchPath(cfg.rules.includePaths)) {
      console.log('[ChatWidget] Blocked: path not in includePaths');
      return false;
    }
    if (matchPath(cfg.rules.excludePaths)) {
      console.log('[ChatWidget] Blocked: path in excludePaths');
      return false;
    }
    console.log('[ChatWidget] shouldShow: ALLOWED');
    return true;
  };

  const schedule = (cfg) => {
    const { bubble, teaser } = state.els;

    // Bubble delay
    setTimeout(() => {
      bubble.style.display = 'flex';
    }, cfg.triggers.showBubbleAfterMs);

    // Teaser
    if (cfg.teaser.enabled) {
      setTimeout(() => {
        state.els.teaser.style.display = 'block';
        if (cfg.teaser.autocloseMs > 0) {
          setTimeout(() => { state.els.teaser.style.display = 'none'; }, cfg.teaser.autocloseMs);
        }
      }, cfg.teaser.delayMs);
    }

    // Auto-open (frequency-capped)
    if (cfg.triggers.openAfterMs > 0) {
      const last = Number(localStorage.getItem(state.lastAutoOpenKey) || 0);
      const now = Date.now();
      const gap = cfg.rules.frequencyCapHours * 3600 * 1000;
      if (now - last > gap) {
        setTimeout(() => { openChat(cfg); localStorage.setItem(state.lastAutoOpenKey, String(Date.now())); }, cfg.triggers.openAfterMs);
      }
    }

    // Scroll trigger
    if (cfg.triggers.triggerOnScrollPercent > 0) {
      const target = Math.min(95, Math.max(1, cfg.triggers.triggerOnScrollPercent));
      const onScroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= target) { openChat(cfg); window.removeEventListener('scroll', onScroll); }
      };
      window.addEventListener('scroll', onScroll);
    }

    // Exit intent
    if (cfg.triggers.triggerOnExitIntent) {
      exitIntent(() => openChat(cfg));
    }
  };

  const boot = async () => {
    console.log('[ChatWidget] Boot started');
    const { base, remoteUrl } = getGlobalCfg();
    console.log('[ChatWidget] Config loaded:', { base, remoteUrl });
    
    const remote = await fetchRemoteCfg(remoteUrl);
    console.log('[ChatWidget] Remote config:', remote);
    
    const cfg = deepMerge(base, remote || {});
    state.cfg = cfg;
    console.log('[ChatWidget] Final config:', cfg);

    if (!shouldShow(cfg)) {
      console.log('[ChatWidget] Widget should not show, aborting');
      return;
    }
    
    console.log('[ChatWidget] Building UI...');
    buildUI(cfg);

    // Hide initial until scheduled
    state.els.bubble.style.display = 'none';

    // Optional label text (beside bubble)
    if (cfg.bubble.label) {
      state.els.label.textContent = cfg.bubble.label;
      state.els.label.classList.remove('hide');
    }

    schedule(cfg);

    // Public API
    window.ChatWidget = Object.assign(window.ChatWidget || {}, {
      open: () => openChat(cfg),
      close: () => closeChat(),
      update: (over) => {
        const newCfg = deepMerge(cfg, over || {});
        state.cfg = newCfg;
      },
      version: NS
    });

    if (cfg.analytics.console) console.log('[ChatWidget] ready', cfg);
  };

  // Ensure boot runs
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('[ChatWidget] Document ready, booting...');
    boot();
  } else {
    console.log('[ChatWidget] Waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[ChatWidget] DOMContentLoaded, booting...');
      boot();
    });
  }
})();


