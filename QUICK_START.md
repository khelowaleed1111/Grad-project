# 🚀 Quick Start Guide - Aqar Platform

## Easiest Way to Start (Recommended)

### Option 1: Use the Startup Script
1. Right-click on **START_PROJECT.ps1**
2. Select **"Run with PowerShell"**
3. Wait for both servers to start
4. Browser will open automatically

That's it! ✅

---

## Manual Start (If Script Doesn't Work)

### Step 1: Start Backend
1. Open **PowerShell** or **Command Prompt**
2. Run these commands:
```powershell
cd "c:\Users\Khaled\Desktop\Aqar project\aqar\server"
npm run dev
```
3. Wait until you see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```
4. **Keep this window open!**

### Step 2: Start Frontend
1. Open **another** PowerShell/Command Prompt window
2. Run these commands:
```powershell
cd "c:\Users\Khaled\Desktop\Aqar project\aqar\client"
npm run dev
```
3. Wait until you see:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```
4. **Keep this window open too!**

### Step 3: Open Browser
Open your browser and go to: **http://localhost:5173**

---

## Troubleshooting

### "Failed to fetch" Error

This means the frontend can't connect to the backend. Try these fixes:

#### Fix 1: Check Backend is Running
1. Open: http://localhost:5000/api/health
2. You should see: `{"success":true,"message":"Aqar API is running"}`
3. If you see an error, restart the backend

#### Fix 2: Hard Refresh Browser
Press **Ctrl + Shift + R** on the website

#### Fix 3: Clear Browser Cache
1. Press **Ctrl + Shift + Delete**
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page

#### Fix 4: Restart Everything
1. Close both PowerShell windows (backend and frontend)
2. Run the **START_PROJECT.ps1** script again

#### Fix 5: Check Firewall
Windows Firewall might be blocking the connection:
1. Search for "Windows Defender Firewall"
2. Click "Allow an app through firewall"
3. Make sure Node.js is allowed

---

## How to Stop the Servers

### If using START_PROJECT.ps1:
1. Find the two PowerShell windows that opened
2. Press **Ctrl + C** in each window
3. Type **Y** and press Enter

### If started manually:
1. Go to each PowerShell window
2. Press **Ctrl + C**
3. Type **Y** and press Enter

---

## URLs to Remember

| Service | URL | Purpose |
|---------|-----|---------|
| **Website** | http://localhost:5173 | Main website |
| **Search Page** | http://localhost:5173/search | Browse properties |
| **API Health** | http://localhost:5000/api/health | Check if backend is running |
| **API Properties** | http://localhost:5000/api/properties | Get all properties (JSON) |

---

## Test Accounts

```
Admin:
Email: admin@aqar.com
Password: Admin@123456

Property Owner:
Email: ahmed.hassan@example.com
Password: Password@123

Agent:
Email: fatima.ali@example.com
Password: Password@123

Buyer:
Email: mohamed.ibrahim@example.com
Password: Password@123
```

---

## Common Issues

### Issue: "Port 5000 is already in use"
**Solution:** Another program is using port 5000
1. Close any other Node.js applications
2. Or restart your computer

### Issue: "Port 5173 is already in use"
**Solution:** Frontend is already running
1. Close the existing frontend window
2. Or use the URL that's already open

### Issue: Properties don't appear
**Solution:** 
1. Check browser console (F12 → Console)
2. Look for errors
3. Try hard refresh (Ctrl + Shift + R)
4. See **PROPERTIES_NOT_SHOWING_FIX.md** for detailed steps

### Issue: "MongoDB connection failed"
**Solution:**
1. Check your internet connection
2. Make sure your IP is whitelisted in MongoDB Atlas
3. See **MONGODB_FIX_GUIDE.md** for detailed steps

---

## Need More Help?

Check these guides:
- **PROPERTIES_NOT_SHOWING_FIX.md** - Properties not displaying
- **MONGODB_FIX_GUIDE.md** - Database connection issues
- **REGISTRATION_DEBUG_GUIDE.md** - Registration problems
- **GITHUB_SETUP_GUIDE.md** - Upload to GitHub
- **SYSTEM_STATUS_REPORT.md** - Full system status

---

## Quick Health Check

Run this in PowerShell to check if everything is working:

```powershell
# Check backend
curl "http://localhost:5000/api/health" -UseBasicParsing

# Check properties
curl "http://localhost:5000/api/properties?page=1&limit=1" -UseBasicParsing
```

If both commands return JSON data, everything is working! ✅

---

**Remember:** Both backend and frontend must be running for the website to work!
