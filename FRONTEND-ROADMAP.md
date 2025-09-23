# 🚀 FRONTEND ROADMAP - WIDGET CONTROL PANEL
## 📋 BREADCRUMB DATA & ITERATION PLAN

### 🎯 **OBJETIVO FINAL:**
Un frontend CHINGÓN que controle TODOS los campos del widget via API calls, con preview instantáneo y templates predefinidos.

---

## 📊 **TODOS LOS CAMPOS QUE NECESITAMOS (COMPLETO):**

### 💬 **BUBBLE FIELDS:**
- [x] `bubble.bg` - Color de fondo
- [x] `bubble.color` - Color del texto  
- [x] `bubble.size` - Tamaño (número)
- [x] `bubble.iconUrl` - URL del logo/icono
- [x] `bubble.label` - Texto del label
- [x] `bubble.position` - Posición ("bl", "br", "tl", "tr")
- [x] `bubble.pulse` - Pulso animado (true/false)
- [x] `bubble.outline` - Color del borde
- [x] `bubble.outlineWidth` - Grosor del borde
- [x] `bubble.outlineOffset` - Offset del borde
- [x] `bubble.zIndex` - Z-index (número)

### 🟢 **ONLINE INDICATOR FIELDS:**
- [x] `onlineIndicator.enabled` - Activar/desactivar (true/false)
- [x] `onlineIndicator.color` - Color del círculo
- [x] `onlineIndicator.size` - Tamaño (número)
- [x] `onlineIndicator.pulse` - Pulso animado (true/false)
- [x] `onlineIndicator.border` - Borde del círculo
- [x] `onlineIndicator.boxShadow` - Sombra
- [x] `onlineIndicator.offsetX` - Offset horizontal
- [x] `onlineIndicator.offsetY` - Offset vertical
- [x] `onlineIndicator.position` - Posición relativa

### 💭 **TEASER FIELDS:**
- [x] `teaser.enabled` - Activar/desactivar (true/false)
- [x] `teaser.text` - Texto del teaser
- [x] `teaser.bg` - Color de fondo
- [x] `teaser.color` - Color del texto
- [x] `teaser.delayMs` - Delay para aparecer (número)
- [x] `teaser.autocloseMs` - Auto-cerrar tiempo (número)
- [x] `teaser.maxWidth` - Ancho máximo
- [x] `teaser.minWidth` - Ancho mínimo
- [x] `teaser.fontSize` - Tamaño de fuente
- [x] `teaser.fontFamily` - Familia de fuente
- [x] `teaser.fontWeight` - Peso de fuente
- [x] `teaser.border` - Borde
- [x] `teaser.boxShadow` - Sombra
- [x] `teaser.borderRadius` - Radio del borde

### ⚙️ **TRIGGERS & BEHAVIOR:**
- [x] `triggers.showBubbleAfterMs` - Delay del bubble (número)
- [x] `triggers.openAfterMs` - Auto-abrir chat (número)
- [x] `triggers.triggerOnScrollPercent` - Trigger por scroll (número)
- [x] `triggers.triggerOnExitIntent` - Exit intent (true/false)
- [x] `noOverlay` - Sin overlay (true/false)

### 📱 **DEVICE & RULES:**
- [x] `rules.showOnMobile` - Mostrar en móvil (true/false)
- [x] `rules.showOnDesktop` - Mostrar en desktop (true/false)
- [x] `rules.minWidth` - Ancho mínimo de pantalla (número)
- [x] `rules.maxWidth` - Ancho máximo de pantalla (número)
- [x] `rules.includePaths` - Páginas incluidas (array)
- [x] `rules.excludePaths` - Páginas excluidas (array)
- [x] `rules.appendUTM` - Pasar UTMs (true/false)
- [x] `rules.frequencyCapHours` - Frecuencia en horas (número)

### 🎨 **OVERLAY & WINDOW:**
- [x] `overlay.bg` - Fondo del overlay
- [x] `overlay.closeOnEsc` - Cerrar con ESC (true/false)
- [x] `overlay.windowMode` - Modo ventana (true/false)
- [x] `overlay.windowWidth` - Ancho de ventana
- [x] `overlay.windowHeight` - Alto de ventana

### 🔗 **URLS & WEBHOOKS:**
- [x] `chatUrl` - URL del chat
- [x] `fallbackUrl` - URL de respaldo
- [x] `webhookUrl` - URL del webhook
- [x] `webhookEvents` - Eventos webhook (array)

### 🎨 **CUSTOM STYLES:**
- [x] `customStyles.bubbleImageWidth` - Ancho imagen bubble
- [x] `customStyles.bubbleImageHeight` - Alto imagen bubble
- [x] `customStyles.bubbleImageTransform` - Transformación imagen
- [x] `customStyles.bubbleImageBorderRadius` - Border radius imagen

### 📊 **ANALYTICS:**
- [x] `analytics.console` - Logs en consola (true/false)
- [x] `analytics.trackOpens` - Trackear aperturas (true/false)

---

## 🏗️ **PLAN DE ITERACIÓN:**

### **🚀 FASE 1: MINI FRONTEND (BÁSICO)**
- [x] **1.1** - Crear `frontend-v1.html` con estructura básica ✅
- [x] **1.2** - Lista de clientes existentes (GET `/api/configs`) ✅
- [x] **1.3** - Selector de cliente ✅
- [x] **1.4** - 3 campos básicos: ✅
  - Color del bubble (`bubble.bg`) ✅
  - Texto del label (`bubble.label`) ✅
  - Posición (`bubble.position`) ✅
- [x] **1.5** - Botón SAVE que llame PUT `/api/config/[siteId]` ✅
- [x] **1.6** - Preview iframe que se actualice automáticamente ✅
- [x] **1.7** - TESTING: Verificar que los 3 campos se guarden correctamente ✅

### **🎨 FASE 2: EXPANDIR UI COMPONENTS**
- [ ] **2.1** - ColorPicker component
- [ ] **2.2** - Slider component (para tamaños)
- [ ] **2.3** - Toggle component (true/false)
- [ ] **2.4** - TextInput component
- [ ] **2.5** - Agregar 10 campos más del bubble
- [ ] **2.6** - TESTING: Verificar todos los campos del bubble

### **🟢 FASE 3: ONLINE INDICATOR**
- [ ] **3.1** - Sección UI para online indicator
- [ ] **3.2** - Todos los campos del online indicator
- [ ] **3.3** - TESTING: Verificar online indicator completo

### **💭 FASE 4: TEASER**
- [ ] **4.1** - Sección UI para teaser
- [ ] **4.2** - Todos los campos del teaser
- [ ] **4.3** - TESTING: Verificar teaser completo

### **⚙️ FASE 5: TRIGGERS & BEHAVIOR**
- [ ] **5.1** - Sección para triggers
- [ ] **5.2** - Sección para rules
- [ ] **5.3** - TESTING: Verificar comportamiento

### **🔗 FASE 6: URLS & WEBHOOKS**
- [ ] **6.1** - Campos para URLs
- [ ] **6.2** - Webhook configuration
- [ ] **6.3** - TESTING: Verificar webhooks

### **📚 FASE 7: TEMPLATES**
- [ ] **7.1** - Sistema de templates predefinidos
- [ ] **7.2** - Botones para aplicar templates
- [ ] **7.3** - TESTING: Verificar templates

### **🎨 FASE 8: POLISH**
- [ ] **8.1** - UI bonita y responsive
- [ ] **8.2** - Validaciones y error handling
- [ ] **8.3** - Crear/eliminar clientes
- [ ] **8.4** - TESTING FINAL: Todo funciona perfecto

---

## 📝 **NOTAS DE ITERACIÓN:**

### **APIs EXISTENTES QUE USAREMOS:**
- `GET /api/configs` - Lista todos los clientes
- `GET /api/config/[siteId]` - Obtiene config de un cliente
- `PUT /api/config/[siteId]` - Actualiza config de un cliente
- `POST /api/config/[siteId]` - Crea nuevo cliente
- `DELETE /api/config/[siteId]` - Elimina cliente

### **ARCHIVOS CLAVE:**
- `chat-widget-nuclear.js` - Widget principal (NO TOCAR)
- `frontend-v1.html` - Nuestro nuevo frontend
- `api/config/[siteId].js` - API endpoint principal

### **TESTING STRATEGY:**
- Cada fase debe tener su propio test
- Preview iframe para ver cambios en tiempo real
- Verificar que los datos se guarden en la DB correctamente
- URL de test: `https://dynamiccode-ochre.vercel.app/test-frontend.html?siteId=CLIENT`

---

## 🎯 **ESTADO ACTUAL:**
**✅ FASE 1 COMPLETADA** - Frontend básico funciona perfectamente con `aiprl-no-overlay`

## 🐛 **PROBLEMAS IDENTIFICADOS:**
- Los otros 3 templates (`ecommerce-fashion`, `tech-startup-dark`, `luxury-hotel-spa`) tienen glitches
- Necesitan ser revisados y arreglados individualmente
- `aiprl-no-overlay` funciona perfecto ✅

## 🎯 **PRÓXIMOS PASOS:**
1. **Arreglar templates con glitches** (más tarde hoy)
2. **Continuar con FASE 2** - Expandir campos del frontend

---

*📅 Última actualización: $(date)*
*🧠 Este archivo se actualiza con cada iteración para no perder el contexto*
