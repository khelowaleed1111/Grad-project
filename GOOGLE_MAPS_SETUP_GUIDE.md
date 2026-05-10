# 🗺️ Google Maps API Setup Guide

## Why You Need This

The Aqar platform uses Google Maps to:
- Display property locations on a map
- Show property markers with clustering
- Allow users to search by map area
- Display location picker when adding properties

**Current Status**: ❌ API key not configured (showing error)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Go to Google Cloud Console

Visit: **https://console.cloud.google.com/**

### Step 2: Create a Project

1. Click **"Select a project"** at the top
2. Click **"New Project"**
3. Enter project name: **"Aqar Platform"**
4. Click **"Create"**
5. Wait for project creation (takes ~30 seconds)

### Step 3: Enable Maps JavaScript API

1. In the left menu, go to **"APIs & Services"** → **"Library"**
2. Search for: **"Maps JavaScript API"**
3. Click on **"Maps JavaScript API"**
4. Click **"Enable"** button
5. Wait for API to be enabled

### Step 4: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** button at the top
3. Select **"API Key"**
4. Your API key will be created and displayed
5. **Copy the API key** (it looks like: `AIzaSyD...`)

### Step 5: (Optional but Recommended) Restrict API Key

For security, restrict your API key:

1. Click **"Edit API key"** (pencil icon)
2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **"Maps JavaScript API"**
3. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Add: `http://localhost:5174/*`
   - Add: `http://localhost:5173/*`
   - (Add your production domain later)
4. Click **"Save"**

### Step 6: Add API Key to Your Project

1. Open the file:
   ```
   c:\Users\Khaled\Desktop\Aqar project\aqar\client\.env
   ```

2. Replace this line:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```

3. With your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...your-actual-key...
   ```

4. Save the file

### Step 7: Restart Frontend Server

1. Stop the frontend server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   cd "c:\Users\Khaled\Desktop\Aqar project\aqar\client"
   npm run dev
   ```

3. Refresh your browser: http://localhost:5174

---

## ✅ Verification

After adding the API key, you should see:

1. **Homepage**: Map with property markers ✅
2. **Search Page**: Interactive map with property locations ✅
3. **Property Detail**: Location map showing property ✅
4. **Add Property**: Location picker to select coordinates ✅

**No more error messages!** 🎉

---

## 💰 Pricing (Don't Worry, It's Free!)

Google Maps offers **$200 free credit per month**, which includes:
- **28,000 map loads per month** (FREE)
- **100,000 map views per month** (FREE)

For a small to medium real estate platform, you'll likely stay within the free tier.

**Your usage estimate:**
- 1,000 visitors/month × 3 pages with maps = 3,000 map loads
- **Cost**: $0 (well within free tier)

---

## 🔒 Security Best Practices

### 1. Restrict API Key (Recommended)

**API Restrictions:**
- ✅ Restrict to "Maps JavaScript API" only

**Application Restrictions:**
- ✅ Add HTTP referrers:
  - `http://localhost:5174/*`
  - `http://localhost:5173/*`
  - `https://yourdomain.com/*` (when you deploy)

### 2. Monitor Usage

- Check usage in Google Cloud Console
- Set up billing alerts (optional)
- Review monthly usage reports

### 3. Never Commit API Key to Git

The `.env` file is already in `.gitignore`, so your API key won't be committed to version control.

---

## 🐛 Troubleshooting

### Error: "This page didn't load Google Maps correctly"

**Cause**: API key not set or invalid

**Solution**:
1. Check `.env` file has correct API key
2. Restart frontend server
3. Clear browser cache
4. Check API key is enabled in Google Cloud Console

### Error: "RefererNotAllowedMapError"

**Cause**: API key is restricted and your domain is not allowed

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your API key
3. Add `http://localhost:5174/*` to HTTP referrers
4. Save and wait 5 minutes for changes to propagate

### Error: "ApiNotActivatedMapError"

**Cause**: Maps JavaScript API is not enabled

**Solution**:
1. Go to Google Cloud Console → APIs & Services → Library
2. Search for "Maps JavaScript API"
3. Click "Enable"

### Maps not showing after adding key

**Solution**:
1. Make sure you saved the `.env` file
2. Restart the frontend server (Ctrl+C, then `npm run dev`)
3. Hard refresh browser (Ctrl+Shift+R or Ctrl+F5)
4. Check browser console for errors (F12)

---

## 📱 Alternative: Disable Maps Temporarily

If you want to test the website without maps:

1. I can modify the components to hide maps when API key is missing
2. Properties will still display in list/grid view
3. You can add the API key later

**Would you like me to do this?** (Not recommended, but available)

---

## 🎯 Quick Checklist

- [ ] Go to Google Cloud Console
- [ ] Create project "Aqar Platform"
- [ ] Enable "Maps JavaScript API"
- [ ] Create API key
- [ ] Copy API key
- [ ] Paste into `.env` file
- [ ] Restart frontend server
- [ ] Refresh browser
- [ ] ✅ Maps working!

---

## 📞 Need Help?

### Google Cloud Console
https://console.cloud.google.com/

### Google Maps Platform Documentation
https://developers.google.com/maps/documentation/javascript/get-api-key

### Your .env File Location
```
c:\Users\Khaled\Desktop\Aqar project\aqar\client\.env
```

---

## 🎉 After Setup

Once you add the API key, your Aqar platform will have:

✅ **Interactive maps** on all pages  
✅ **Property markers** with clustering  
✅ **Location search** by map area  
✅ **Location picker** for adding properties  
✅ **Professional look** with real maps  

**Total time**: ~5 minutes  
**Cost**: $0 (free tier)  
**Result**: Fully functional real estate platform! 🏠

---

**Created**: May 8, 2026  
**Status**: Waiting for API key  
**Next Step**: Get your free Google Maps API key!
