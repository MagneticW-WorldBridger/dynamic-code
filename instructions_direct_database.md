You're absolutely right! We haven't tested the URLs yet. Let me check what URLs are currently configured and then create a comprehensive document for your coworker.


[2 tools called]

Perfect! Now let me create a comprehensive document for your coworker:

---

# 🎨 **CHAT WIDGET CONFIGURATION COMMANDS**
## **Complete PSQL Command Reference for AI PRL Assist Widget**

### **🔗 DATABASE CONNECTION**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

## **📋 CURRENT CONFIGURATIONS**

### **Available Site IDs:**
- `gavigans` - Gavigans Restaurant
- `luxury-hotel-spa` - Luxury Hotel & Spa  
- `aiprl-no-overlay` - AI PRL Assist
- `tech-startup-dark` - Tech Startup Dark
- `ecommerce-fashion` - E-commerce Fashion

### **Current URLs (UNTESTED - NEED VERIFICATION):**
- **Gavigans**: `https://app.aiprlassist.com/webchat/?p=1047143&id=GavigansRestaurant001`
- **Luxury Hotel**: `https://app.aiprlassist.com/webchat/?p=1047143&id=LuxuryHotelSpa001`
- **AI PRL**: `https://app.aiprlassist.com/webchat/?p=1047143&id=O1T4KXJ9xZ`
- **Tech Startup**: `https://app.aiprlassist.com/webchat/?p=1047143&id=TechStartupDark001`
- **Fashion**: `https://app.aiprlassist.com/webchat/?p=1047143&id=FashionStore001`

---

## **🔧 BASIC COMMANDS**

### **View All Configurations:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT site_id, client_name FROM widget_configs;"
```

### **View Specific Configuration:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT config FROM widget_configs WHERE site_id = 'SITE_ID_HERE';"
```

### **View URLs Only:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT site_id, config->>'chatUrl' as chat_url, config->>'fallbackUrl' as fallback_url FROM widget_configs WHERE site_id = 'SITE_ID_HERE';"
```

---

## **�� BUBBLE CUSTOMIZATION**

### **Change Bubble Background Color:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,bg}', '\"#COLOR_CODE\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Bubble Size:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,size}', 'SIZE_PIXELS') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Bubble Outline Color:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,outline}', '\"#COLOR_CODE\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Bubble Outline Width:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,outlineWidth}', '\"WIDTH_PX\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Bubble Position:**
```bash
# Bottom Right
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,position}', '\"br\"') WHERE site_id = 'SITE_ID_HERE';"

# Bottom Left  
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,position}', '\"bl\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Enable/Disable Bubble Pulse:**
```bash
# Enable pulse
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,pulse}', 'true') WHERE site_id = 'SITE_ID_HERE';"

# Disable pulse
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,pulse}', 'false') WHERE site_id = 'SITE_ID_HERE';"
```

---

## **�� TEASER CUSTOMIZATION**

### **Change Teaser Text:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,text}', '\"YOUR_MESSAGE_HERE\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Text Color:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,color}', '\"#COLOR_CODE\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Background Color:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,bg}', '\"#COLOR_CODE\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Font:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,fontFamily}', '\"FONT_NAME\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Font Size:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,fontSize}', '\"SIZE_PX\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Font Weight:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,fontWeight}', '\"WEIGHT\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Border:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,border}', '\"WIDTH_PX solid #COLOR_CODE\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Border Radius:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,borderRadius}', '\"RADIUS_PX\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Box Shadow:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,boxShadow}', '\"SHADOW_VALUE\"') WHERE site_id = 'SITE_ID_HERE';"
```

---

## **⏰ TIMING CONTROLS**

### **Change Teaser Delay (when to show):**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,delayMs}', 'MILLISECONDS') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Teaser Auto-Close Time:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,autocloseMs}', 'MILLISECONDS') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Bubble Show Delay:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{triggers,showBubbleAfterMs}', 'MILLISECONDS') WHERE site_id = 'SITE_ID_HERE';"
```

---

## **��️ IMAGE CUSTOMIZATION**

### **Change Bubble Image URL:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{bubble,iconUrl}', '\"IMAGE_URL\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Image Size (Width):**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{customStyles,bubbleImageWidth}', '\"PERCENTAGE%\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Image Size (Height):**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{customStyles,bubbleImageHeight}', '\"PERCENTAGE%\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Image Transform:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{customStyles,bubbleImageTransform}', '\"TRANSFORM_VALUE\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Image Border Radius:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{customStyles,bubbleImageBorderRadius}', '\"RADIUS_VALUE\"') WHERE site_id = 'SITE_ID_HERE';"
```

---

## **🟢 ONLINE INDICATOR**

### **Enable/Disable Online Indicator:**
```bash
# Enable
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{onlineIndicator,enabled}', 'true') WHERE site_id = 'SITE_ID_HERE';"

# Disable
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{onlineIndicator,enabled}', 'false') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Online Indicator Color:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{onlineIndicator,color}', '\"#COLOR_CODE\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Online Indicator Size:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{onlineIndicator,size}', 'SIZE_PIXELS') WHERE site_id = 'SITE_ID_HERE';"
```

---

## **🔗 URL MANAGEMENT**

### **Change Chat URL:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{chatUrl}', '\"NEW_CHAT_URL\"') WHERE site_id = 'SITE_ID_HERE';"
```

### **Change Fallback URL:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{fallbackUrl}', '\"NEW_FALLBACK_URL\"') WHERE site_id = 'SITE_ID_HERE';"
```

---

## **🎯 ENABLE/DISABLE FEATURES**

### **Enable/Disable Teaser:**
```bash
# Enable
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,enabled}', 'true') WHERE site_id = 'SITE_ID_HERE';"

# Disable
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{teaser,enabled}', 'false') WHERE site_id = 'SITE_ID_HERE';"
```

### **Enable/Disable Overlay Mode:**
```bash
# Enable overlay (chat opens in popup)
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{noOverlay}', 'false') WHERE site_id = 'SITE_ID_HERE';"

# Disable overlay (chat opens in new tab)
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = jsonb_set(config, '{noOverlay}', 'true') WHERE site_id = 'SITE_ID_HERE';"
```

---

## **📋 COPY & CREATE CONFIGURATIONS**

### **Copy Configuration from One to Another:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "UPDATE widget_configs SET config = (SELECT config FROM widget_configs WHERE site_id = 'SOURCE_SITE_ID') WHERE site_id = 'TARGET_SITE_ID';"
```

### **Create New Configuration:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "INSERT INTO widget_configs (site_id, client_name, config) VALUES ('NEW_SITE_ID', 'Client Name', 'FULL_JSON_CONFIG_HERE');"
```

### **Delete Configuration:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "DELETE FROM widget_configs WHERE site_id = 'SITE_ID_HERE';"
```

---

## **�� TESTING COMMANDS**

### **Quick Test - View Key Settings:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT site_id, config->'bubble'->>'bg' as bubble_color, config->'teaser'->>'text' as teaser_text, config->'teaser'->>'color' as teaser_color, config->>'chatUrl' as chat_url FROM widget_configs WHERE site_id = 'SITE_ID_HERE';"
```

### **Test All URLs:**
```bash
psql "postgresql://neondb_owner:npg_PNWywpeB74sE@ep-wandering-glade-adt7y7se-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT site_id, config->>'chatUrl' as chat_url, config->>'fallbackUrl' as fallback_url FROM widget_configs;"
```

---

## **⚠️ IMPORTANT NOTES**

1. **Replace `SITE_ID_HERE`** with actual site ID (gavigans, luxury-hotel-spa, etc.)
2. **Replace `COLOR_CODE`** with hex colors (e.g., #ff0000, #00ff00)
3. **Replace `SIZE_PIXELS`** with numbers (e.g., 70, 100)
4. **Replace `PERCENTAGE%`** with percentages (e.g., 100%, 85%)
5. **URLs are UNTESTED** - verify chat URLs work before deploying
6. **Always test changes** on a development site first
7. **Use quotes around text values** in JSON updates

---

## **�� COMMON COLOR CODES**

- **Red**: #ff0000, #dc3545, #e74c3c
- **Blue**: #007bff, #3498db, #0066cc  
- **Green**: #28a745, #2ecc71, #00ff00
- **Yellow**: #ffc107, #f1c40f, #ffd700
- **Purple**: #6f42c1, #9b59b6, #8e44ad
- **Orange**: #fd7e14, #e67e22, #f39c12
- **Black**: #000000, #212529, #343a40
- **White**: #ffffff, #f8f9fa, #e9ecef
- **Gray**: #6c757d, #95a5a6, #bdc3c7

---

## **📱 TEST CODE FOR WEBSITES**

```html
<!-- Replace SITE_ID with actual site ID -->
<script>
  window.ChatWidget = window.ChatWidget || {};
  window.ChatWidget.siteId = "SITE_ID";
  window.ChatWidget.apiBase = "https://dynamiccode-ochre.vercel.app";
  window.ChatWidget.analytics = { console: true };
</script>

<script
  async
  src="https://dynamiccode-ochre.vercel.app/chat-widget-nuclear.js"
  onload="try{ if(window.ChatWidget && window.ChatWidget.setup){ window.ChatWidget.setup({ siteId: window.ChatWidget.siteId, apiBase: window.ChatWidget.apiBase, analytics: true }); } }catch(e){ console.error('[AI PRL Assist] setup() failed:', e); }"
  onerror="console.error('[AI PRL Assist] Loader failed to load from Vercel');"
></script>
```

---

**�� CRITICAL: The chat URLs need to be tested! They may not work and need to be updated with valid AI PRL Assist chat URLs.**