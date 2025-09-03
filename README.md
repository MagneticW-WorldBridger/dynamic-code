# 🤖 AI PRL Assist - Chat Widget System

**Retail's Customer Experience Platform - Production Ready Chat Widget**

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success)](https://dynamiccode-ochre.vercel.app)
[![Multi-Tenant](https://img.shields.io/badge/Architecture-Multi--Tenant-blue)](https://dynamiccode-ochre.vercel.app/control-panel-v2)
[![AI Powered](https://img.shields.io/badge/Instructions-AI%20Powered-purple)](https://dynamiccode-ochre.vercel.app)

## 🚀 Quick Start

### For AI PRL Assist (Default Setup):
```html
<!-- Paste this code once in your website -->
<script>
  window.ChatWidget = {
    siteId: "aiprlassist-default",
    configUrl: "https://dynamiccode-ochre.vercel.app/configs/{{siteId}}.json"
  };
</script>
<script async src="https://dynamiccode-ochre.vercel.app/chat-widget.js"></script>
```

### For New Clients:
1. **Create Config**: Use [Control Panel](https://dynamiccode-ochre.vercel.app/control-panel-v2)
2. **Generate Code**: Get platform-specific embed code
3. **Client Embeds**: One-time code placement
4. **Remote Control**: All changes via control panel

## 🎯 Features

### ✅ Production Ready
- **Multi-tenant architecture** - One system, unlimited clients
- **Fallback URLs** - Automatic failover if primary chat fails
- **E2E Testing** - 24 automated tests ensure reliability
- **Analytics** - UTM tracking, event logging, performance monitoring
- **Responsive Design** - Desktop windowed, mobile full-screen

### 🤖 AI-Powered Platform Support
- **GoHighLevel** - Footer tracking code (all plans)
- **Webflow** - Custom code section (paid plans)
- **WordPress** - Theme footer injection
- **Shopify** - Theme.liquid modification
- **Squarespace** - Code injection (business+)
- **Custom HTML** - Universal compatibility

### 🎨 Complete Customization
- **Bubble Styling** - Colors, size, position, icons
- **Triggers** - Time delays, scroll percentage, exit intent
- **Rules** - Page targeting, device targeting, frequency caps
- **Overlay** - Window mode vs full-screen, custom sizing

## 📊 System Architecture

### No Database Required
```
Static Files = Database
├── /configs/client-a.json ← Client A configuration
├── /configs/client-b.json ← Client B configuration
└── Git + Vercel = Auto Deploy
```

### Benefits:
- **$0 Server Costs** (Vercel free tier)
- **Global CDN** (Instant worldwide delivery)
- **Zero Maintenance** (No database to manage)
- **Version Control** (Git history for all changes)
- **Infinite Scaling** (Add unlimited clients)

## 🛠️ Management Tools

### [Control Panel](https://dynamiccode-ochre.vercel.app/control-panel-v2)
- **Platform Selection** - AI-powered embedding instructions
- **Visual Configuration** - Real-time preview
- **Code Generation** - Platform-specific snippets
- **Client Management** - Multi-tenant dashboard

### [Demo & Testing](https://dynamiccode-ochre.vercel.app/demo)
- **Live Preview** - Test with any background URL
- **UTM Testing** - Verify parameter passing
- **Device Testing** - Mobile/desktop behavior
- **Performance Monitoring** - Load time analysis

### [E2E Tests](https://dynamiccode-ochre.vercel.app/test-e2e)
- **24 Automated Tests** - Complete system verification
- **Widget Loading** - Script, initialization, shadow DOM
- **Configuration** - Multi-tenant, fallback URLs
- **UI/UX** - Responsive design, positioning
- **Analytics** - UTM capture, event tracking
- **Integration** - Chat opening, parameter passing
- **Performance** - Load time, memory usage

## 🔧 Client Onboarding Process

### 1. Create Client Configuration (2 minutes)
```bash
# Use Control Panel
https://dynamiccode-ochre.vercel.app/control-panel-v2

# Select platform → Configure widget → Generate code
```

### 2. Provide Embed Code (One-time)
```html
<script>
  window.ChatWidget = {
    siteId: "your-client-001",
    configUrl: "https://dynamiccode-ochre.vercel.app/configs/{{siteId}}.json"
  };
</script>
<script async src="https://dynamiccode-ochre.vercel.app/chat-widget.js"></script>
```

### 3. Remote Management (Forever)
- Client **never touches code again**
- All changes via control panel
- Updates apply **automatically**
- **Zero downtime** modifications

## 📈 Scaling Strategy

### Current Clients:
- **AI PRL Assist** (`aiprlassist-default`) - Derek's original
- **Webflow Demo** (`webflow-windowed-001`)
- **Woodstock Furniture** (`woodstock-main`)
- **Restaurant ABC** (`restaurant-abc`)

### Adding New Clients:
1. **Create JSON config** → `/configs/new-client-001.json`
2. **Generate embed code** → Control panel
3. **Client embeds once** → Never changes
4. **Scale infinitely** → No limits

## 🔍 AI-Powered Research System

### Daily Platform Updates
- **Automated Research** - Serper API + GPT-4
- **Platform Monitoring** - GoHighLevel, Webflow, WordPress, etc.
- **Instruction Updates** - Always current embedding methods
- **Confidence Scoring** - Reliability indicators

### Implementation:
```javascript
const researchSystem = new PlatformResearchSystem();
researchSystem.scheduleDailyUpdates(); // Auto-update instructions
```

## 📊 Analytics & Tracking

### Automatic Data Capture:
- **UTM Parameters** - Source, medium, campaign, term, content
- **Page Context** - URL, referrer, host domain
- **Chat Events** - Opens, interactions, conversions
- **Performance** - Load times, error rates

### Data Storage:
- **Client-side** - localStorage (privacy-first)
- **Exportable** - JSON format for analysis
- **Retention** - 100 events max per client

## 🎨 Brand Integration

### AI PRL Assist Colors:
- **Primary Orange**: `#E67E22`
- **Primary Blue**: `#3498DB`
- **Success Green**: `#27AE60`
- **Clean Whites**: `#FFFFFF`

### Professional Styling:
- **Inter Font** - Modern, readable typography
- **Gradient Backgrounds** - Premium visual appeal
- **Smooth Animations** - 60fps interactions
- **Mobile-First** - Responsive across all devices

## 🚀 Production Deployment

### Current URLs:
- **Production**: https://dynamiccode-ochre.vercel.app
- **Control Panel**: https://dynamiccode-ochre.vercel.app/control-panel-v2
- **Demo**: https://dynamiccode-ochre.vercel.app/demo
- **Tests**: https://dynamiccode-ochre.vercel.app/test-e2e

### Deployment Process:
```bash
git add .
git commit -m "Update client configuration"
npx vercel --prod
# ✅ Live in 30 seconds globally
```

## 📞 Support & Documentation

### Quick Links:
- **[Client Onboarding Guide](CLIENT-ONBOARDING.md)** - Complete setup process
- **[Architecture Overview](ARCHITECTURE.md)** - Technical deep-dive
- **[Platform Research System](platform-research-system.js)** - AI-powered updates

### Contact:
- **Production Issues**: Check E2E tests first
- **New Client Setup**: Use control panel
- **Custom Requirements**: Modify JSON configs

---

## 🎉 Ready for Scale

**This system is 100% production-ready and can handle unlimited clients.**

✅ **Multi-tenant architecture**  
✅ **AI-powered platform instructions**  
✅ **Automatic failover & error handling**  
✅ **Comprehensive testing suite**  
✅ **Zero-maintenance infrastructure**  
✅ **Professional branding & UX**  

**Start onboarding clients immediately!** 🚀
