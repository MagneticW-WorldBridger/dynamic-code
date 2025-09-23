# 🎯 Real-Time Teaser System - Complete Guide

## 🚀 System Overview

The real-time teaser system allows you to send personalized messages to active chat widget sessions in real-time. Messages appear instantly in the teaser bubble on the user's page.

## 📊 Dashboard Control

### Access Dashboard
```
https://dynamiccode-ochre.vercel.app/webhook-dashboard.html
```

### Manual Teaser Sending
1. **View Events**: See all live sessions and their data
2. **Click "📨 Send Custom Teaser"** on any event
3. **Compose Message**: Write your personalized message
4. **Send**: Message appears on user's page within 8 seconds

## 🧪 Testing End-to-End

### Step 1: Open Test Page
```
https://dynamiccode-ochre.vercel.app/test-woodstock-session.html?utm_source=facebook&utm_medium=cpc&utm_campaign=chairs_sale&customer_id=12345&customer_email=test@woodstock.com
```

### Step 2: Monitor Console
- Open browser console (F12)
- Look for polling logs every 8 seconds:
  ```
  [AI PRL Assist] 🔄 Polling for teaser messages...
  [AI PRL Assist] 📭 No new teaser messages
  ```

### Step 3: Get Session ID
- Copy the Session ID from the debug info on the test page
- Format: `sess_1758648278890_cy68t5ni7`

### Step 4: Send Manual Message (Terminal)
```bash
curl -X PUT "https://dynamiccode-ochre.vercel.app/api/teaser-messages" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: woodstock_rt_key_2024" \
  -H "X-Site-ID: woodstock_outlet" \
  -d '{
    "sessionId": "YOUR_SESSION_ID_HERE",
    "message": "🎉 Special offer just for you! 20% off chairs today!",
    "priority": "manual",
    "expiresIn": 300000
  }'
```

### Step 5: Watch Real-Time Update
- Within 8 seconds, console shows:
  ```
  [AI PRL Assist] 🎯 NEW TEASER MESSAGE RECEIVED: 🎉 Special offer just for you! 20% off chairs today!
  [AI PRL Assist] ✅ Teaser shown with message: 🎉 Special offer just for you! 20% off chairs today!
  ```
- Teaser bubble updates with new message
- Subtle scale animation draws attention

## 🤖 Automatic AI Triggers

### Smart Triggering Conditions
Messages are automatically sent when:
- **High Interest Score** (≥50 points)
- **Multiple Page Views** (≥3 pages)
- **Critical Pages** (`/checkout`, `/cart`)
- **Known Customer** (customer_id present)
- **Minimum 5-minute cooldown** between triggers

### Interaction Scoring
- High-value pages (`/chairs`, `/products`, `/checkout`, `/cart`): +30 points
- UTM campaigns: +20 points
- Facebook traffic: +15 points
- CPC traffic: +10 points
- Known customer ID: +25 points
- Customer email: +20 points
- 30+ seconds on page: +15 points
- 1+ minute on page: +25 points

## 📨 Message Examples

### Personalized Offers
```
🎉 Welcome back, customer #12345! Exclusive 30% off just for you!
```

### Browsing-Based
```
🪑 I see you're browsing chairs! Check out our ergonomic collection with 30% off!
```

### Urgency
```
🚨 Only 2 items left in your cart! Complete your order in the next 10 minutes for free shipping!
```

### Social Proof
```
📱 Thanks for coming from Facebook! Join 1000+ happy customers with our exclusive social media discount!
```

## 🔧 Technical Details

### Polling System
- **Frequency**: Every 8 seconds (configurable)
- **API Endpoint**: `/api/teaser-messages`
- **Method**: POST for polling, PUT for sending
- **Authentication**: API Key (`woodstock_rt_key_2024`)

### Database Tables
- **`teaser_messages`**: Stores pending messages
- **`teaser_polls`**: Tracks polling activity
- **`webhook_events_internal`**: Stores all events for dashboard

### Message Lifecycle
1. **Send**: Message stored in database with expiration
2. **Poll**: Widget polls every 8 seconds for new messages
3. **Receive**: Message retrieved and marked as consumed
4. **Display**: Teaser updates with animation
5. **Expire**: Messages auto-expire after 5-10 minutes

## 🎯 Use Cases

### E-commerce
- **Cart Abandonment**: "🛍️ Items in your cart! Don't miss our limited-time offers!"
- **Product Interest**: "👀 Still thinking about that chair? Here's 15% off to help decide!"
- **Checkout Assistance**: "💳 Need help completing your order? I'm here to assist!"

### Lead Generation
- **High Intent**: "📞 Ready to talk? Schedule a free consultation now!"
- **Retargeting**: "🎯 Welcome back! Pick up where you left off with our new arrivals!"

### Customer Service
- **VIP Treatment**: "⭐ As a valued customer, you get priority support and exclusive deals!"
- **Issue Resolution**: "🔧 Having trouble? Let me connect you with our expert team!"

## 🚨 Best Practices

### Message Guidelines
- **Keep it short** (under 100 characters)
- **Use emojis** for visual appeal
- **Be specific** to user's context
- **Include clear value** proposition
- **Create urgency** when appropriate

### Timing
- **Respect cooldowns** (5 minutes minimum)
- **Consider time zones** for business hours
- **Match user behavior** (don't interrupt active engagement)

### Personalization
- **Use customer data** when available
- **Reference browsing behavior** (pages visited, time spent)
- **Leverage UTM data** (traffic source, campaign)
- **Adapt to interaction score** (high score = more direct approach)

## 🔍 Monitoring & Analytics

### Dashboard Metrics
- **Total Events**: All webhook events received
- **AI Triggers**: Automatic message sends
- **Active Sessions**: Unique sessions in last hour
- **Average Score**: Mean interaction score

### Event Filtering
- **All Events**: Complete activity feed
- **AI Triggered**: Only automatic messages
- **High Score**: Sessions with 50+ interaction points

### Export Data
- **JSON Export**: Full event data for analysis
- **Session Tracking**: Follow user journeys
- **Conversion Analysis**: Measure teaser effectiveness

---

## 🎉 System Status: FULLY OPERATIONAL

✅ **Real-time polling**: Every 8 seconds  
✅ **Manual sending**: Dashboard + API  
✅ **Automatic triggers**: Smart AI logic  
✅ **Database storage**: Persistent messages  
✅ **Animation effects**: Attention-grabbing updates  
✅ **Debug logging**: Full visibility  
✅ **Error handling**: Graceful fallbacks  

**The system is ready for production use!** 🚀
