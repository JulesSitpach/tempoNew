# 🔧 Troubleshooting Guide: "Message Channel Closed" Error

## Quick Fixes (Try in Order):

### 1. Browser Extension Conflict (90% of cases)
```bash
# Test in incognito/private window
# Disable extensions one by one
# Common culprits: ad blockers, password managers, developer tools extensions
```

### 2. Clear Browser Cache
```bash
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete  
# Edge: Ctrl+Shift+Delete
```

### 3. Restart Development Server
```bash
npm run dev
# Or force restart:
# Ctrl+C to stop, then npm run dev
```

### 4. Check Environment Variables
```bash
# Verify .env.local has correct values:
VITE_SUPABASE_URL=https://mrwitpgbcaxgnirqtavt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Network/Firewall Issues
```bash
# Check if Supabase is accessible:
curl https://mrwitpgbcaxgnirqtavt.supabase.co/rest/v1/
```

## Advanced Debugging:

### Check Browser Console for These Messages:
- ✅ `🚀 Starting Tariff Management Suite...`
- ✅ `✅ Global error handling initialized`  
- ⚠️ `🔍 Browser extension APIs detected: [...]`
- 🚨 `🚨 Unhandled promise rejection: ...`

### Extension Conflict Detection:
The app now automatically detects these extension APIs:
- `chrome.runtime`
- `chrome.extension` 
- `browser.runtime`
- `browser.extension`

### Test in Different Environments:
1. **Incognito Window** - No extensions
2. **Different Browser** - Chrome vs Firefox vs Edge
3. **Different Network** - Mobile hotspot vs WiFi
4. **Different Device** - Another computer/phone

## Still Having Issues?

### Disable React StrictMode (temporary):
In `src/main.tsx`, change:
```tsx
// FROM:
<React.StrictMode>
  <App />
</React.StrictMode>

// TO:
<App />
```

### Enable Verbose Logging:
Add to `.env.local`:
```bash
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

### Check Supabase Status:
Visit: https://status.supabase.com/

## Prevention:
1. Keep browser extensions minimal during development
2. Use incognito window for testing
3. Regularly clear browser cache
4. Monitor console for early warning signs

The error is now properly handled and shouldn't crash your application!

---

## ✅ Federal Register API Status & Integration

### **API Documentation Verified:** 
- **URL**: https://www.federalregister.gov/developers/documentation/api/v1
- **Status**: ✅ **Fully Operational** (No API key required)
- **Response Time**: ~1750ms (within normal range)

### **Recent Live API Test Results:**
```json
{
  "count": 592,
  "description": "Documents published on or after 06/10/2025",
  "total_pages": 50,
  "results": [
    {
      "title": "Implementation of Duties on Steel Pursuant to Proclamation 10896",
      "type": "Notice",
      "publication_date": "2025-06-16",
      "agencies": ["Bureau of Industry and Security"],
      "abstract": "Steel Presidential Proclamation - imposed specified rates of duty on imports of steel..."
    }
  ]
}
```

### **Key Features Available:**
1. **🔍 Document Search** - Full-text search across all Federal Register documents since 1994
2. **📅 Date Filtering** - Filter by publication date ranges
3. **🏛️ Agency Filtering** - Filter by specific government agencies
4. **📋 Document Types** - Rules, Proposed Rules, Notices, Presidential Documents
5. **🎯 Topic Filtering** - Search by CFR indexing terms
6. **📄 Full Content Access** - HTML and PDF versions available

### **Enhanced SMB Tariff Integration:**

#### **Steel Import Monitoring (Live Example):**
The API is currently tracking steel tariff changes including:
- Proclamation 10896 implementation updates
- Additional steel derivative products
- Revised Harmonized Tariff Schedule (HTSUS) modifications

#### **Smart Filtering for SMBs:**
```typescript
// Automatically monitor trade-relevant agencies:
const tradeAgencies = [
  'commerce-department',           // Steel/aluminum duties
  'customs-and-border-protection', // Import procedures
  'trade-representative',          // Trade negotiations
  'treasury-department'           // Economic sanctions
];

// Document types that affect tariffs:
const relevantTypes = ['rule', 'proposed-rule', 'notice'];
```

#### **Real-Time Alerts System:**
Your system now monitors for:
- ✅ New tariff rate changes
- ✅ HTS code modifications
- ✅ Steel/aluminum proclamation updates
- ✅ Trade agreement announcements
- ✅ Customs procedure changes

### **Testing Your Integration:**
