# 👨‍💻 FRONTEND DEVELOPER INSTRUCTIONS

## 🎯 YOUR MISSION

**Build the control panel UI that saves widget configurations to the database.**

---

## 📁 FILES YOU CAN MODIFY

### ✅ ALLOWED TO EDIT:
- **`control-panel-simple.html`** - Main control panel (YOUR WORK)
- **`test-smart-messages.html`** - Test page for smart messages

### ❌ DO NOT TOUCH:
- **`api/`** folder - Backend APIs (WORKING)
- **`chat-widget-db.js`** - Widget engine (WORKING)  
- **`smart-bubble-engine.js`** - Smart message engine (WORKING)
- **`.env`** - Database credentials (WORKING)
- **`vercel.json`** - Deployment config (WORKING)
- **`package.json`** - Dependencies (WORKING)

---

## 🗄️ DATABASE APIS (ALREADY WORKING)

### Load Configuration:
```javascript
GET /api/load-config?siteId=aiprlassist-default

Response:
{
  "success": true,
  "siteId": "aiprlassist-default", 
  "clientName": "AI PRL Assist (Default)",
  "config": { /* full widget config */ }
}
```

### Save Configuration:
```javascript
POST /api/save-config-real
Body: {
  "siteId": "client-001",
  "clientName": "Client Name", 
  "config": { /* widget config object */ }
}

Response:
{
  "success": true,
  "saved": true,
  "id": 123,
  "updatedAt": "2025-09-04T02:07:51.780Z"
}
```

### Get AI Context (for your AI agent):
```javascript
GET /api/ai-agent-context?sessionId=sess_123

Response:
{
  "aiContext": {
    "summary": {
      "customerCameFrom": "facebook",
      "campaignContext": "promo2024"
    },
    "suggestedApproach": {
      "greeting": "Hi! I saw you came from Facebook...",
      "tone": "friendly"
    }
  }
}
```

---

## 🎛️ CONTROL PANEL REQUIREMENTS

### Current Status:
**`control-panel-simple.html`** - Partially working, needs completion

### What Works:
- ✅ Loads config from database on page load
- ✅ Saves changes to database 
- ✅ Generates deployment code

### What You Need to Add:

#### 1. **Client Management Section:**
```html
<!-- Add dropdown to select different clients -->
<select id="clientSelector">
  <option value="aiprlassist-default">AI PRL Assist (Default)</option>
  <option value="client-001">Client 001</option>
</select>
<button onclick="loadClient()">Load Client</button>
```

#### 2. **UTM Settings Section:**
```html
<!-- Add UTM parameter controls -->
<label>
  <input type="checkbox" id="captureUTMSource" checked> Capture utm_source
</label>
<label>
  <input type="checkbox" id="captureUTMCampaign" checked> Capture utm_campaign  
</label>
<!-- etc. for all UTM params -->
```

#### 3. **Smart Message Preview:**
```html
<!-- Add preview of generated smart messages -->
<div id="smartMessagePreview">
  Generated message will appear here...
</div>
<button onclick="testSmartMessage()">Test Smart Message</button>
```

#### 4. **Save Status Feedback:**
```html
<!-- Better save feedback -->
<div id="saveStatus" class="hidden">
  <div class="success">✅ Saved to database!</div>
  <div class="timestamp">Last saved: <span id="lastSaved"></span></div>
</div>
```

---

## 🔧 JAVASCRIPT FUNCTIONS TO IMPLEMENT

### Load Client Configuration:
```javascript
async function loadClient() {
  const siteId = document.getElementById('clientSelector').value;
  const response = await fetch(`/api/load-config?siteId=${siteId}`);
  const data = await response.json();
  
  if (data.success) {
    populateForm(data.config);
    showSuccess(`Loaded: ${data.clientName}`);
  }
}
```

### Save Configuration:
```javascript
async function saveConfiguration() {
  const config = buildConfigFromForm();
  const response = await fetch('/api/save-config-real', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      siteId: getCurrentSiteId(),
      config: config
    })
  });
  
  const result = await response.json();
  if (result.success) {
    showSuccess('Configuration saved!');
    updateTimestamp(result.updatedAt);
  }
}
```

---

## 🎨 UI/UX REQUIREMENTS

### Design Guidelines:
- **Clean, professional** appearance
- **Real-time preview** of changes
- **Clear save/load** feedback
- **Error handling** with user-friendly messages
- **Mobile responsive** design

### Key Features:
- **Auto-load** default config on page open
- **Live preview** widget in bottom-right corner  
- **One-click save** to database
- **Copy deployment code** button
- **Client switching** dropdown

---

## 🧪 TESTING YOUR WORK

### Test Sequence:
1. **Open control panel** - Should auto-load default config
2. **Change bubble color** to red
3. **Click "Save to Database"** - Should show success message  
4. **Refresh page** - Should load red color from database
5. **Copy deployment code** - Should work in client sites

### Test URLs:
- **Control Panel:** https://dynamiccode-ochre.vercel.app/control-panel-simple.html
- **Smart Messages Test:** https://dynamiccode-ochre.vercel.app/test-smart-messages.html

---

## 🚫 WHAT YOU DON'T HANDLE

**NOT your responsibility:**
- Database connection (DONE)
- API endpoints (DONE)  
- Widget engine (DONE)
- Smart message logic (DONE)
- Deployment (DONE)

**YOUR FOCUS:**
- Control panel UI/UX
- Form handling
- API integration on frontend
- User experience

---

## 🎯 SUCCESS CRITERIA

**Your control panel should:**
1. ✅ Load real config from database
2. ✅ Save changes to database  
3. ✅ Show clear feedback to user
4. ✅ Generate correct deployment code
5. ✅ Handle multiple clients
6. ✅ Preview changes in real-time

**When done, the business owner can configure any client's widget without touching code.**

---

## 🚀 DEPLOYMENT

**When ready:**
```bash
git add .
git commit -m "Frontend: Complete control panel UI"
git push origin frontend-dev
```

**I'll merge to production when approved.**

---

**FOCUS ON `control-panel-simple.html` - MAKE IT PERFECT!** 🎯
