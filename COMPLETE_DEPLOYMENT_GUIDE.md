# 🚀 Complete Aqar Project Deployment Guide

## Overview

Your Aqar project has:
- **Frontend:** React + Vite (in `aqar/client`)
- **Backend:** Node.js + Express (in `aqar/server`)
- **Database:** MongoDB Atlas (already set up)

We'll deploy both frontend and backend to Vercel as **separate projects**.

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ GitHub account with your code pushed
- ✅ Vercel account (free tier is fine)
- ✅ MongoDB Atlas connection string
- ✅ Cloudinary credentials
- ✅ Google Maps API key

---

# Part 1: Deploy Backend First

## Step 1: Prepare Backend for Deployment

### 1.1: Verify Backend Configuration

Your backend should already have `aqar/server/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

✅ This file already exists - no changes needed!

### 1.2: Check Environment Variables Needed

Your backend needs these environment variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## Step 2: Create Backend Vercel Project

### 2.1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Click **"Add New..."** button (top right)
3. Select **"Project"**

### 2.2: Import Repository

1. Find your GitHub repository: **"Grad-project"**
2. Click **"Import"**

### 2.3: Configure Backend Project

**Important Settings:**

**Project Name:**
```
aqar-backend
```
(or any name you prefer for the backend)

**Root Directory:**
```
aqar/server
```
⚠️ **CRITICAL:** Must be exactly `aqar/server`

**Framework Preset:**
```
Other
```

**Build Command:**
```
(leave empty)
```

**Output Directory:**
```
(leave empty)
```

**Install Command:**
```
npm install
```

**Node.js Version:**
```
18.x
```
(default is fine)

### 2.4: Add Environment Variables

Click **"Environment Variables"** section and add:

**Variable 1:**
- Name: `MONGODB_URI`
- Value: `mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar`
- Environment: Production, Preview, Development (check all)

**Variable 2:**
- Name: `JWT_SECRET`
- Value: `your-super-secret-jwt-key-change-this-in-production`
- Environment: Production, Preview, Development (check all)

**Variable 3:**
- Name: `CLIENT_ORIGIN`
- Value: `https://grad-projectttttt.vercel.app`
- Environment: Production, Preview, Development (check all)
- ⚠️ **Note:** We'll update this after frontend is deployed if URL changes

**Variable 4:**
- Name: `CLOUDINARY_CLOUD_NAME`
- Value: (your Cloudinary cloud name)
- Environment: Production, Preview, Development (check all)

**Variable 5:**
- Name: `CLOUDINARY_API_KEY`
- Value: (your Cloudinary API key)
- Environment: Production, Preview, Development (check all)

**Variable 6:**
- Name: `CLOUDINARY_API_SECRET`
- Value: (your Cloudinary API secret)
- Environment: Production, Preview, Development (check all)

### 2.5: Deploy Backend

1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment
3. Watch for "Deployment completed" message
4. You'll get a URL like: `https://aqar-backend.vercel.app`

### 2.6: Test Backend

1. Copy your backend URL
2. Open in browser: `https://aqar-backend.vercel.app/api/health`
3. Should see: `{"success":true,"message":"Aqar API is running",...}`
4. ✅ If you see this, backend is working!

---

# Part 2: Deploy Frontend

## Step 3: Prepare Frontend for Deployment

### 3.1: Update Frontend Environment Variables Locally

First, let's make sure the frontend knows about the backend URL.

Check `aqar/client/.env` file should have:

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyCZetOFwh4raElzLlfuHxG0AUGHGV8sb5M
VITE_API_URL=http://localhost:5000
```

⚠️ **Don't change this file** - we'll set the production URL in Vercel dashboard.

### 3.2: Verify Frontend Vercel Configuration

Check `aqar/client/vercel.json` exists with:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

✅ This file already exists!

### 3.3: Verify _redirects File

Check `aqar/client/public/_redirects` exists with:

```
/*    /index.html   200
```

✅ This file already exists!

---

## Step 4: Update or Create Frontend Vercel Project

### Option A: If You Want to Keep Existing Frontend Project

#### 4.1: Go to Existing Project Settings

1. Go to: https://vercel.com/dashboard
2. Click on your existing project: **"grad-projectttttt"**
3. Click **"Settings"** tab

#### 4.2: Update Root Directory

1. Find **"Root Directory"** section
2. Click **"Edit"**
3. Set to: `aqar/client`
4. Click **"Save"**

#### 4.3: Update Framework Preset

1. Find **"Framework Preset"**
2. Click **"Edit"**
3. Select: **"Vite"**
4. Click **"Save"**

#### 4.4: Verify Build Settings

Make sure these are set:
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

#### 4.5: Add/Update Environment Variables

1. Click **"Environment Variables"** in left sidebar
2. Add or update:

**Variable 1:**
- Name: `VITE_GOOGLE_MAPS_API_KEY`
- Value: `AIzaSyCZetOFwh4raElzLlfuHxG0AUGHGV8sb5M`
- Environment: Production, Preview, Development (check all)

**Variable 2:**
- Name: `VITE_API_URL`
- Value: `https://aqar-backend.vercel.app` (use your actual backend URL from Step 2.5)
- Environment: Production, Preview, Development (check all)

#### 4.6: Redeploy Frontend

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. **Uncheck** "Use existing Build Cache"
5. Click **"Redeploy"**
6. Wait 2-3 minutes

### Option B: If You Want to Create Fresh Frontend Project

#### 4.1: Create New Project

1. Go to: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository: **"Grad-project"**
4. Click **"Import"**

#### 4.2: Configure Frontend Project

**Project Name:**
```
aqar-frontend
```

**Root Directory:**
```
aqar/client
```

**Framework Preset:**
```
Vite
```

**Build Command:**
```
npm run build
```
(auto-detected)

**Output Directory:**
```
dist
```
(auto-detected)

**Install Command:**
```
npm install
```
(auto-detected)

#### 4.3: Add Environment Variables

**Variable 1:**
- Name: `VITE_GOOGLE_MAPS_API_KEY`
- Value: `AIzaSyCZetOFwh4raElzLlfuHxG0AUGHGV8sb5M`

**Variable 2:**
- Name: `VITE_API_URL`
- Value: `https://aqar-backend.vercel.app` (your backend URL)

#### 4.4: Deploy

Click **"Deploy"** and wait 2-3 minutes.

---

## Step 5: Update Backend CORS Settings

### 5.1: Update Backend CLIENT_ORIGIN

Now that frontend is deployed, update the backend to allow requests from it:

1. Go to backend project: **"aqar-backend"**
2. Click **"Settings"** → **"Environment Variables"**
3. Find `CLIENT_ORIGIN`
4. Click **"Edit"**
5. Change value to your frontend URL: `https://grad-projectttttt.vercel.app` (or your new frontend URL)
6. Click **"Save"**

### 5.2: Redeploy Backend

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

# Part 3: Testing Everything

## Step 6: Test Complete Deployment

### 6.1: Test Backend

1. Open: `https://aqar-backend.vercel.app/api/health`
2. Should see: `{"success":true,"message":"Aqar API is running"}`
3. ✅ Backend working!

### 6.2: Test Frontend Homepage

1. Open: `https://grad-projectttttt.vercel.app/`
2. Should see your homepage
3. ✅ Homepage working!

### 6.3: Test Properties Loading

1. Navigate to **Search** page
2. Should see properties listed
3. ✅ Frontend connected to backend!

### 6.4: Test Routing (THE CRITICAL TEST)

1. Navigate to **Search** page
2. Press **F5** to refresh
3. **Should stay on Search page** (not 404!)
4. ✅ Routing working!

Try refreshing on:
- `/search` - Should work
- `/about` - Should work
- `/contact` - Should work
- `/properties` - Should work

### 6.5: Test Property Details

1. Click on any property
2. Should open property detail page
3. Press **F5** to refresh
4. Should stay on property detail page
5. ✅ Dynamic routes working!

---

# Part 4: Troubleshooting

## Issue 1: Frontend Shows "No Properties Found"

**Cause:** Frontend can't connect to backend

**Check:**
1. Backend is deployed and running
2. `VITE_API_URL` environment variable is set correctly in frontend
3. `CLIENT_ORIGIN` is set correctly in backend
4. Both projects are deployed

**Fix:**
1. Verify backend URL: `https://aqar-backend.vercel.app/api/health`
2. Check browser console (F12) for CORS errors
3. Update environment variables if needed
4. Redeploy both projects

## Issue 2: 404 on Page Refresh

**Cause:** Routing configuration not applied

**Check:**
1. `vercel.json` exists in `aqar/client/`
2. `_redirects` exists in `aqar/client/public/`
3. Root Directory is set to `aqar/client`
4. Framework Preset is set to `Vite`

**Fix:**
1. Verify files exist (they should)
2. Check Root Directory setting
3. Try changing Framework Preset to "Other"
4. Redeploy with cache disabled

## Issue 3: Build Fails

**Cause:** Dependencies or configuration issue

**Check Build Logs:**
1. Go to Deployments tab
2. Click on failed deployment
3. Read error messages

**Common Fixes:**
- Missing environment variables
- Wrong Root Directory
- Node version mismatch

## Issue 4: CORS Errors

**Symptom:** Browser console shows CORS errors

**Fix:**
1. Update `CLIENT_ORIGIN` in backend environment variables
2. Make sure it matches your frontend URL exactly
3. Redeploy backend

---

# Part 5: Final Configuration Summary

## Backend Project Settings

```
Project Name: aqar-backend
Root Directory: aqar/server
Framework: Other
Build Command: (empty)
Output Directory: (empty)
Install Command: npm install

Environment Variables:
- MONGODB_URI
- JWT_SECRET
- CLIENT_ORIGIN (frontend URL)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
```

## Frontend Project Settings

```
Project Name: grad-projectttttt (or aqar-frontend)
Root Directory: aqar/client
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Environment Variables:
- VITE_GOOGLE_MAPS_API_KEY
- VITE_API_URL (backend URL)
```

---

# Part 6: Quick Reference

## URLs After Deployment

**Backend:**
- URL: `https://aqar-backend.vercel.app`
- Health Check: `https://aqar-backend.vercel.app/api/health`
- API Base: `https://aqar-backend.vercel.app/api`

**Frontend:**
- URL: `https://grad-projectttttt.vercel.app`
- Homepage: `https://grad-projectttttt.vercel.app/`
- Search: `https://grad-projectttttt.vercel.app/search`

## Important Files

**Backend:**
- `aqar/server/vercel.json` - Vercel configuration
- `aqar/server/.env` - Local environment variables (not deployed)
- `aqar/server/server.js` - Main server file

**Frontend:**
- `aqar/client/vercel.json` - Routing configuration
- `aqar/client/public/_redirects` - Backup routing
- `aqar/client/.env` - Local environment variables (not deployed)

---

# Part 7: Maintenance

## Updating Code

When you push changes to GitHub:
1. Vercel automatically detects the push
2. Rebuilds and redeploys affected project
3. Wait 2-3 minutes for deployment
4. Test the changes

## Viewing Logs

**Backend Logs:**
1. Go to backend project
2. Click on deployment
3. Click "Functions" tab
4. View real-time logs

**Frontend Logs:**
1. Go to frontend project
2. Click on deployment
3. View build logs

## Rolling Back

If something breaks:
1. Go to Deployments tab
2. Find a working deployment
3. Click "..." → "Promote to Production"
4. Previous version is now live

---

# ✅ Success Checklist

After following this guide, verify:

- [ ] Backend deployed and accessible
- [ ] Backend health check returns success
- [ ] Frontend deployed and accessible
- [ ] Frontend homepage loads
- [ ] Properties show on Search page
- [ ] Can click on property to view details
- [ ] Refreshing on any page works (no 404)
- [ ] Can navigate using browser back/forward
- [ ] Google Maps loads correctly
- [ ] Can register/login (if testing auth)

---

# 🎉 You're Done!

Your Aqar Real Estate Platform is now fully deployed and working!

**Frontend:** https://grad-projectttttt.vercel.app  
**Backend:** https://aqar-backend.vercel.app  
**Database:** MongoDB Atlas (already configured)

Both are connected and working together in the cloud! 🚀

---

# 📞 Need Help?

If you encounter issues:

1. **Check build logs** - Most issues show up here
2. **Check browser console** (F12) - For frontend errors
3. **Test backend health endpoint** - Verify backend is running
4. **Verify environment variables** - Make sure all are set
5. **Try redeploying with cache disabled** - Clears any cached issues

---

**Good luck with your deployment!** 🎊
