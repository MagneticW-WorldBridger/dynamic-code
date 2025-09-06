# 🗄️ DATABASE SCHEMA DOCUMENTATION

## 📋 TABLE: `widget_configs`

### Structure:
```sql
CREATE TABLE widget_configs (
    id SERIAL PRIMARY KEY,
    site_id VARCHAR(100) NOT NULL UNIQUE,
    client_name VARCHAR(200),
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes:
- `PRIMARY KEY` on `id`
- `UNIQUE CONSTRAINT` on `site_id`
- `btree` index on `site_id`
- `btree` index on `updated_at`

---

## 🎯 CONFIG JSONB SCHEMA

### Required Fields:
```json
{
  "chatUrl": "string (required)",
  "bubble": {
    "bg": "string (hex color)",
    "size": "number (pixels)",
    "color": "string (hex color)",
    "label": "string",
    "position": "string (br|bl)",
    "iconUrl": "string (URL)",
    "pulse": "boolean",
    "zIndex": "number"
  },
  "triggers": {
    "showBubbleAfterMs": "number",
    "openAfterMs": "number",
    "triggerOnScrollPercent": "number",
    "triggerOnExitIntent": "boolean"
  },
  "rules": {
    "includePaths": "array of strings",
    "excludePaths": "array of strings",
    "showOnMobile": "boolean",
    "showOnDesktop": "boolean",
    "minWidth": "number",
    "maxWidth": "number",
    "frequencyCapHours": "number",
    "appendUTM": "boolean"
  },
  "overlay": {
    "bg": "string (rgba color)",
    "closeOnEsc": "boolean",
    "windowMode": "boolean",
    "windowWidth": "string (px)",
    "windowHeight": "string (px)"
  },
  "analytics": {
    "console": "boolean",
    "trackOpens": "boolean"
  },
  "teaser": {
    "enabled": "boolean",
    "text": "string",
    "delayMs": "number",
    "autocloseMs": "number"
  },
  "noOverlay": "boolean",
  "fallbackUrl": "string (URL)",
  "webhookUrl": "string (URL)",
  "webhookEvents": "array of strings"
}
```

---

## 🧪 TEST CONFIGURATIONS

### 1. Default Configuration:
- **site_id**: `aiprlassist-default`
- **client_name**: `AI PRL Assist (Default)`
- **Color**: Orange (#E67E22)
- **Features**: Full overlay, teaser enabled

### 2. Orange Client:
- **site_id**: `cliente-orange-001`
- **client_name**: `Cliente Orange - Naranja`
- **Color**: Orange (#ff4013)
- **Features**: No overlay, teaser enabled

### 3. Green Client:
- **site_id**: `cliente-green-001`
- **client_name**: `Cliente Green - Verde`
- **Color**: Green (#28a745)
- **Features**: Full overlay, no teaser

---

## 🔧 API ENDPOINTS

### Load Configuration:
```
GET /api/load-config?siteId={site_id}
```

### Save Configuration:
```
POST /api/save-config-real
Body: {
  "siteId": "string",
  "clientName": "string",
  "config": { /* full config object */ }
}
```

### List All Configurations:
```
GET /api/configs
```

---

## 🚨 VALIDATION RULES

### Required Fields:
- `chatUrl` - Must be valid URL
- `bubble.bg` - Must be valid hex color
- `bubble.size` - Must be number > 0
- `triggers.showBubbleAfterMs` - Must be number >= 0
- `rules.includePaths` - Must be array
- `rules.excludePaths` - Must be array

### Optional Fields:
- `teaser` - Can be omitted
- `webhookUrl` - Can be omitted
- `fallbackUrl` - Can be omitted

---

## 📊 CURRENT STATUS

- **Total Records**: 0 (CLEANED)
- **Ready for**: Fresh test configurations
- **Schema**: Validated and documented
- **Indexes**: Optimized for performance
