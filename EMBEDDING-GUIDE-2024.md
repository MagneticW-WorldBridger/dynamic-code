# 🚀 CHAT WIDGET EMBEDDING GUIDE 2024
## **Basado en Context7 Research + Best Practices**

---

## **🎯 NUEVO APPROACH (INTERCOM/RASA STYLE)**

### **✅ CÓDIGO PARA CLIENTES:**
```html
<!-- AI PRL Assist Chat Widget -->
<script>
  window.ChatWidgetSettings = {
    siteId: "client-001",
    serverUrl: "https://app.aiprlassist.com/webchat/",
    color: "#E67E22",
    position: "bottom-right",
    size: 68,
    showDelay: 3000,
    utmCapture: true,
    analytics: true
  };
</script>
<script async src="https://dynamiccode-ochre.vercel.app/widget-improved.js"></script>
```

---

## **🔧 GOHIGHLEVEL ESPECÍFICO:**

### **Método 1: Footer Tracking Code**
```html
<!-- Paste in: Sites → Settings → Tracking Code → Footer -->
<script>
  window.ChatWidgetSettings = {
    siteId: "ghl-client-001",
    color: "#E67E22",
    showDelay: 2000
  };
</script>
<script async defer src="https://dynamiccode-ochre.vercel.app/widget-improved.js"></script>
```

### **Método 2: Page Custom Code**
```html
<!-- Paste in: Page → Settings → Custom Code → Footer -->
<script>
  window.ChatWidgetSettings = {siteId: "ghl-client-002"};
</script>
<script async src="https://dynamiccode-ochre.vercel.app/widget-improved.js"></script>
```

---

## **🌐 OTROS PLATFORMS:**

### **Webflow:**
```html
<!-- Project Settings → Custom Code → Footer Code -->
<script>
  window.ChatWidgetSettings = {siteId: "webflow-client-001"};
</script>
<script async src="https://dynamiccode-ochre.vercel.app/widget-improved.js"></script>
```

### **WordPress:**
```html
<!-- Appearance → Theme Editor → footer.php (before </body>) -->
<script>
  window.ChatWidgetSettings = {siteId: "wp-client-001"};
</script>
<script async src="https://dynamiccode-ochre.vercel.app/widget-improved.js"></script>
```

### **Shopify:**
```html
<!-- Online Store → Themes → Edit Code → theme.liquid (before </body>) -->
<script>
  window.ChatWidgetSettings = {siteId: "shopify-client-001"};
</script>
<script async src="https://dynamiccode-ochre.vercel.app/widget-improved.js"></script>
```

---

## **⚙️ CONFIGURACIÓN AVANZADA:**

### **Todas las opciones disponibles:**
```javascript
window.ChatWidgetSettings = {
  // BÁSICO
  siteId: "client-001",                    // Required
  serverUrl: "https://app.aiprlassist.com/webchat/",
  
  // APARIENCIA
  color: "#E67E22",                        // Bubble color
  position: "bottom-right",                // bottom-left, bottom-right
  size: 68,                                // Bubble size in pixels
  icon: "https://example.com/icon.png",    // Custom icon URL
  
  // COMPORTAMIENTO
  autoOpen: false,                         // Auto-open chat
  showDelay: 3000,                         // Show delay in ms
  utmCapture: true,                        // Capture UTM parameters
  analytics: true,                         // Console logging
  
  // VENTANA
  windowMode: "windowed",                  // windowed, fullscreen
  windowWidth: 420,                        // Window width
  windowHeight: 650,                       // Window height
  
  // AVANZADO
  fallbackUrl: "https://backup.com/chat"   // Fallback URL if main fails
};
```

---

## **🎯 VENTAJAS DEL NUEVO APPROACH:**

### **✅ MEJORAS TÉCNICAS:**
- **Shadow DOM** - Aislamiento completo de CSS
- **Async loading** - No bloquea página
- **GHL compatible** - Funciona en todos los builders
- **UTM capture** - Automático y completo
- **Error handling** - Fallback URLs
- **Mobile responsive** - Windowed/fullscreen

### **✅ MEJORAS UX:**
- **Configuración simple** - Solo `siteId` requerido
- **Hot-swappable** - Cambios sin re-deploy
- **Multi-platform** - Funciona en todo
- **Performance** - Carga rápida y ligera

---

## **📊 UTM PARAMETERS CAPTURADOS:**

**Automáticamente captura:**
- `utm_source`, `utm_medium`, `utm_campaign`
- `utm_term`, `utm_content`, `utm_id`
- `gclid` (Google Ads), `fbclid` (Facebook)
- `msclkid` (Microsoft Ads)
- Page context: `host`, `page`, `referrer`

**Enviados al chat como:**
```
https://app.aiprlassist.com/webchat/?p=1047143&id=xaLiCGQ3VYp6mQF2k&embed=1&host=client.com&utm_source=facebook&utm_campaign=promo2024
```

---

## **🔧 CONTROL PANEL UPDATE NEEDED:**

**El control panel debe generar:**
```html
<script>
  window.ChatWidgetSettings = {
    siteId: "${siteId}",
    color: "${bubbleColor}",
    position: "${position}",
    size: ${size},
    showDelay: ${showDelay},
    utmCapture: ${utmCapture},
    analytics: ${analytics}
  };
</script>
<script async src="https://dynamiccode-ochre.vercel.app/widget-improved.js"></script>
```

**En lugar del código actual que no funciona bien.**

---

## **🚀 DEPLOYMENT:**

1. **Deploy `widget-improved.js`** to Vercel
2. **Update control panel** to generate new snippet
3. **Test on GoHighLevel** immediately
4. **Migrate existing clients** gradually

**¡ESTE APPROACH ESTÁ BASADO EN RESEARCH REAL DE CONTEXT7 Y BEST PRACTICES 2024!** 🎯
