(() => {
  if (window.__smartBubbleLoaded) return;
  window.__smartBubbleLoaded = true;

  // Smart Bubble Message Engine
  window.SmartBubble = {
    
    // Collect EVERYTHING possible from the page and URL
    collectAllContext: () => {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      
      // UTM Parameters (Marketing)
      const utm = {
        source: params.get('utm_source'),
        medium: params.get('utm_medium'), 
        campaign: params.get('utm_campaign'),
        term: params.get('utm_term'),
        content: params.get('utm_content'),
        id: params.get('utm_id')
      };
      
      // Google Ads Parameters
      const googleAds = {
        gclid: params.get('gclid'),
        gclsrc: params.get('gclsrc'),
        dclid: params.get('dclid'),
        wbraid: params.get('wbraid'),
        gbraid: params.get('gbraid')
      };
      
      // Facebook Parameters
      const facebook = {
        fbclid: params.get('fbclid'),
        fb_action_ids: params.get('fb_action_ids'),
        fb_action_types: params.get('fb_action_types'),
        fb_source: params.get('fb_source')
      };
      
      // Microsoft Ads Parameters
      const microsoft = {
        msclkid: params.get('msclkid')
      };
      
      // Email Marketing Parameters
      const email = {
        mc_cid: params.get('mc_cid'),        // Mailchimp
        mc_eid: params.get('mc_eid'),        // Mailchimp
        _ke: params.get('_ke'),              // Klaviyo
        vero_id: params.get('vero_id'),      // Vero
        hs_kw: params.get('hs_kw'),          // HubSpot
        hs_cam: params.get('hs_cam')         // HubSpot
      };
      
      // Social Media Parameters
      const social = {
        ref: params.get('ref'),
        referrer: params.get('referrer'),
        source: params.get('source'),
        twclid: params.get('twclid'),        // Twitter
        li_fat_id: params.get('li_fat_id'),  // LinkedIn
        igshid: params.get('igshid')         // Instagram
      };
      
      // E-commerce Parameters
      const ecommerce = {
        product_id: params.get('product_id'),
        category: params.get('category'),
        sku: params.get('sku'),
        variant: params.get('variant'),
        color: params.get('color'),
        size: params.get('size'),
        price: params.get('price'),
        discount: params.get('discount'),
        coupon: params.get('coupon')
      };
      
      // Page Context Analysis
      const page = {
        url: window.location.href,
        path: window.location.pathname,
        hash: window.location.hash,
        host: window.location.hostname,
        protocol: window.location.protocol,
        title: document.title,
        referrer: document.referrer
      };
      
      // Content Analysis (Smart Detection)
      const content = {
        hasProductInfo: !!document.querySelector('[data-product], .product, #product'),
        hasCheckout: !!document.querySelector('.checkout, #checkout, [data-checkout]'),
        hasContact: !!document.querySelector('.contact, #contact, [data-contact]'),
        hasAbout: !!document.querySelector('.about, #about, [data-about]'),
        hasPricing: !!document.querySelector('.pricing, #pricing, [data-pricing]'),
        hasSignup: !!document.querySelector('.signup, #signup, [data-signup]'),
        hasLogin: !!document.querySelector('.login, #login, [data-login]'),
        
        // Smart content detection
        productKeywords: this.extractKeywords(['product', 'item', 'buy', 'shop', 'store']),
        serviceKeywords: this.extractKeywords(['service', 'consultation', 'help', 'support']),
        pricingKeywords: this.extractKeywords(['price', 'cost', 'plan', 'subscription', 'fee'])
      };
      
      // Session Context
      const session = {
        timestamp: new Date().toISOString(),
        timeOnSite: this.getTimeOnSite(),
        pageViews: this.getPageViews(),
        isReturning: this.isReturningVisitor(),
        deviceType: this.getDeviceType(),
        screenSize: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      return {
        utm,
        googleAds,
        facebook,
        microsoft,
        email,
        social,
        ecommerce,
        page,
        content,
        session,
        allParams: Object.fromEntries(params.entries())
      };
    },
    
    // Generate dynamic bubble message based on context
    generateSmartMessage: (context) => {
      const { utm, page, content, ecommerce, session } = context;
      
      // UTM-based messages
      if (utm.source === 'facebook' && utm.campaign?.includes('promo')) {
        return "🎉 Saw our Facebook promo? I'm here to help you save!";
      }
      
      if (utm.source === 'google' && utm.term) {
        return `💡 Searching for "${utm.term}"? I can help you find exactly what you need!`;
      }
      
      if (utm.source === 'email') {
        return "📧 Thanks for clicking our email! Got questions about what you saw?";
      }
      
      if (utm.medium === 'cpc') {
        return "🎯 I see you clicked our ad! Let me help you find what you're looking for.";
      }
      
      // Page-based messages
      if (page.path.includes('/product')) {
        return "👀 Interested in this product? I can answer any questions!";
      }
      
      if (page.path.includes('/pricing')) {
        return "💰 Questions about pricing? I'm here to help you choose the right plan!";
      }
      
      if (page.path.includes('/contact')) {
        return "📞 Need to get in touch? I can help you right now!";
      }
      
      // E-commerce context
      if (ecommerce.product_id) {
        return `🛍️ Interested in this item? I can help with details, sizing, or checkout!`;
      }
      
      if (ecommerce.category) {
        return `🏷️ Browsing ${ecommerce.category}? I can recommend the perfect option for you!`;
      }
      
      // Content-based messages
      if (content.hasCheckout) {
        return "🛒 Need help with your order? I'm here to assist with checkout!";
      }
      
      if (content.hasPricing) {
        return "💡 Questions about our plans? I can help you pick the perfect fit!";
      }
      
      // Session-based messages
      if (session.isReturning) {
        return "👋 Welcome back! How can I help you today?";
      }
      
      if (session.timeOnSite > 60000) { // 1 minute
        return "🤔 Been browsing for a while? I'm here if you need any guidance!";
      }
      
      // Default fallback
      return "👋 Hi there! I'm here to help with any questions you have!";
    },
    
    // Helper functions
    extractKeywords: (keywords) => {
      const text = document.body.textContent.toLowerCase();
      return keywords.filter(keyword => text.includes(keyword));
    },
    
    getTimeOnSite: () => {
      const startTime = sessionStorage.getItem('siteStartTime');
      if (!startTime) {
        sessionStorage.setItem('siteStartTime', Date.now());
        return 0;
      }
      return Date.now() - parseInt(startTime);
    },
    
    getPageViews: () => {
      const views = sessionStorage.getItem('pageViews') || '0';
      const newViews = parseInt(views) + 1;
      sessionStorage.setItem('pageViews', newViews);
      return newViews;
    },
    
    isReturningVisitor: () => {
      const visited = localStorage.getItem('hasVisited');
      if (!visited) {
        localStorage.setItem('hasVisited', 'true');
        return false;
      }
      return true;
    },
    
    getDeviceType: () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    }
  };
})();
