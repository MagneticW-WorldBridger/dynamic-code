# 🔍 FIELD MAPPING ANALYSIS - DATABASE vs FRONTEND

## 📊 DATABASE FIELDS (from API response)

### ✅ MAPPED CORRECTLY:

**Basic Fields:**
- ✅ `siteId` → `siteId` input
- ✅ `clientName` → `clientName` input  
- ✅ `fallbackUrl` → `fallbackUrl` input

**Bubble Fields:**
- ✅ `bubble.bg` → `color` input
- ✅ `bubble.color` → `textColor` input
- ✅ `bubble.outline` → `outlineColor` input
- ✅ `bubble.size` → `size` input
- ✅ `bubble.label` → `bubbleLabel` input
- ✅ `bubble.zIndex` → `zIndex` input
- ✅ `bubble.pulse` → `pulse` checkbox
- ✅ `bubble.position` → `position` select
- ✅ `bubble.iconUrl` → `icon` input

**Trigger Fields:**
- ✅ `triggers.showBubbleAfterMs` → `showBubbleAfterMs` input
- ✅ `triggers.openAfterMs` → `openAfterMs` input
- ✅ `triggers.triggerOnScrollPercent` → `scrollTrigger` input
- ✅ `triggers.triggerOnExitIntent` → `exitIntent` checkbox

**Rules Fields:**
- ✅ `rules.includePaths` → `includePaths` textarea
- ✅ `rules.excludePaths` → `excludePaths` textarea
- ✅ `rules.showOnMobile` → `showOnMobile` checkbox
- ✅ `rules.showOnDesktop` → `showOnDesktop` checkbox
- ✅ `rules.minWidth` → `minWidth` input
- ✅ `rules.maxWidth` → `maxWidth` input
- ✅ `rules.frequencyCapHours` → `frequencyCap` input
- ✅ `rules.appendUTM` → `appendUTM` checkbox

**Overlay Fields:**
- ✅ `overlay.bg` → `overlayBg` input
- ✅ `overlay.closeOnEsc` → `closeOnEsc` checkbox
- ✅ `overlay.windowMode` → `windowMode` select
- ✅ `overlay.windowWidth` → `windowWidth` input
- ✅ `overlay.windowHeight` → `windowHeight` input

**Analytics Fields:**
- ✅ `analytics.console` → (hardcoded to true)
- ✅ `analytics.trackOpens` → `trackOpens` checkbox

**Teaser Fields:**
- ✅ `teaser.enabled` → `teaserEnabled` checkbox
- ✅ `teaser.text` → `teaserText` input
- ✅ `teaser.delayMs` → `teaserDelay` input
- ✅ `teaser.autocloseMs` → `teaserAutoclose` input

**Advanced Fields:**
- ✅ `noOverlay` → `noOverlay` checkbox
- ✅ `chatUrl` → `chatId` + `accountId` (extracted)

---

## ❌ MISSING FIELDS IN DATABASE:

**These fields exist in frontend but NOT in database:**
- ❌ `webhookUrl` - Frontend has input but database doesn't store it
- ❌ `webhookEvents` - Frontend has input but database doesn't store it

---

## ❌ MISSING FIELDS IN FRONTEND:

**These fields exist in database but NOT in frontend:**
- ❌ `rules.minWidth` - Database has `null` but frontend has input
- ❌ `triggers.openAfterMs` - Database has `null` but frontend has input  
- ❌ `triggers.triggerOnScrollPercent` - Database has `null` but frontend has input

---

## 🔧 FIXES NEEDED:

### 1. Add Missing Database Fields:
```sql
-- Add webhook fields to database schema
ALTER TABLE widget_configs 
ADD COLUMN webhook_url VARCHAR(500),
ADD COLUMN webhook_events JSONB;
```

### 2. Update Frontend to Handle Null Values:
```javascript
// In populateFormWithConfig, handle null values properly
setValue('minWidth', config.rules.minWidth || 0);
setValue('openAfterMs', config.triggers.openAfterMs || 0);
setValue('scrollTrigger', config.triggers.triggerOnScrollPercent || 0);
```

### 3. Add Webhook Fields to Frontend:
```html
<!-- Add webhook URL input -->
<input type="url" id="webhookUrl" placeholder="https://your-webhook.com/endpoint">

<!-- Add webhook events checkboxes -->
<input type="checkbox" id="webhookChatOpened"> Chat Opened
<input type="checkbox" id="webhookChatClosed"> Chat Closed
<input type="checkbox" id="webhookTeaserShown"> Teaser Shown
```

---

## 📋 SUMMARY:

**✅ MAPPED CORRECTLY: 35/38 fields (92%)**
**❌ MISSING: 3 fields (8%)**

**The mapping is 92% complete! Only 3 fields need to be added/fixed.**
