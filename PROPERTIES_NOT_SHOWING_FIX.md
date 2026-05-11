# 🔧 Properties Not Showing - Debugging Guide

## Quick Checks

### 1. Check if Backend is Running
Open: http://localhost:5000/api/properties?page=1&limit=5

**Expected:** You should see JSON with properties data
**If you see an error:** Backend is not running - restart it

### 2. Check Browser Console
1. Open the website: http://localhost:5173/search
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for:
   - Red errors
   - "Search Page Debug:" log message
   - Network errors

### 3. Check Network Tab
1. In Developer Tools, click **Network** tab
2. Refresh the page
3. Look for request to `/api/properties`
4. Click on it and check:
   - **Status:** Should be 200
   - **Response:** Should show properties data

## Common Issues & Fixes

### Issue 1: CORS Error
**Symptom:** Console shows "CORS policy" error
**Fix:** Backend `.env` should have:
```
CLIENT_ORIGIN=http://localhost:5173
```
Restart backend after changing.

### Issue 2: API URL Wrong
**Symptom:** Network tab shows 404 or connection refused
**Fix:** Check `aqar/client/.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Restart frontend after changing.

### Issue 3: Backend Not Running
**Symptom:** "Unable to connect" or "Network Error"
**Fix:**
```bash
cd aqar/server
npm run dev
```

### Issue 4: Frontend Not Updated
**Symptom:** Old code still running
**Fix:** Hard refresh browser: **Ctrl + Shift + R**

### Issue 5: Data Structure Mismatch
**Symptom:** Properties array is empty but API returns data
**Fix:** Check console log "Search Page Debug" - if `dataDataIsArray` is false but data exists, the API response structure changed.

## Step-by-Step Debugging

### Step 1: Verify Backend
```powershell
curl "http://localhost:5000/api/properties?page=1&limit=3" -UseBasicParsing | ConvertFrom-Json | Select-Object success, count, total
```
**Expected output:**
```
success count total
------- ----- -----
   True     3    92
```

### Step 2: Check Frontend Console
1. Open http://localhost:5173/search
2. Press F12
3. Look for "Search Page Debug:" in console
4. Check the values:
   - `hasData`: should be `true`
   - `dataDataIsArray`: should be `true`
   - `propertiesLength`: should be > 0
   - `total`: should be 92

### Step 3: Check Network Request
1. In DevTools, go to Network tab
2. Refresh page
3. Find the request to `properties?page=1&limit=12`
4. Click on it
5. Check **Response** tab - should show JSON with properties

## Manual Fix

If properties still don't show, try this manual fix:

### Option A: Clear Browser Cache
1. Press **Ctrl + Shift + Delete**
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page

### Option B: Restart Everything
```powershell
# Stop all servers (Ctrl+C in terminals)

# Start backend
cd aqar/server
npm run dev

# Start frontend (new terminal)
cd aqar/client
npm run dev
```

### Option C: Check the Code
Open `aqar/client/src/pages/Search.jsx` and find this line (around line 97):
```javascript
const properties = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
```

Make sure it looks exactly like that.

## Still Not Working?

### Get Detailed Debug Info

1. Open browser console (F12)
2. Type this and press Enter:
```javascript
fetch('http://localhost:5000/api/properties?page=1&limit=3')
  .then(r => r.json())
  .then(d => console.log('API Response:', d))
```

3. Copy the output and check:
   - Is `success` true?
   - Is `data` an array?
   - Does `data[0]` have a `title`?

### Check React Query Cache

In console, type:
```javascript
localStorage.clear()
```
Then refresh the page.

## Expected Behavior

When everything works:
1. Page loads
2. "Showing X of 92 properties" appears
3. Property cards display with images, titles, prices
4. Map shows property markers

## Contact Info

If none of these fixes work:
1. Take a screenshot of the browser console (F12 → Console tab)
2. Take a screenshot of the Network tab showing the API request
3. Share both screenshots for further debugging

---

**Most Common Fix:** Hard refresh the browser with **Ctrl + Shift + R**
