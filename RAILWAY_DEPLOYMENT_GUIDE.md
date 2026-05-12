# 🚂 Deploy Backend to Railway.app - Complete Guide

## Why Railway.app?

- ✅ **No credit card required** - Truly free!
- ✅ **$5 free credit per month** - More than enough for your backend
- ✅ **Simple setup** - Even easier than Render
- ✅ **Auto-deploys** - Connects to GitHub
- ✅ **Always on** - Not serverless, stays running

---

# Part 1: Deploy Backend to Railway.app

## Step 1: Sign Up for Railway

1. **Go to:** https://railway.app/
2. **Click:** "Login" or "Start a New Project"
3. **Sign in with GitHub:**
   - Click "Login with GitHub"
   - Authorize Railway to access your GitHub
   - ✅ No credit card needed!

---

## Step 2: Create New Project

1. **After signing in, click:** "New Project" button
2. **Select:** "Deploy from GitHub repo"
3. **You'll see:** List of your repositories

---

## Step 3: Select Your Repository

1. **Find:** "Grad-project" repository
2. **Click on it** to select
3. **Railway will ask:** "Which service to deploy?"

---

## Step 4: Configure Deployment

### Set Root Directory

Railway needs to know where your backend code is:

1. **Click:** "Add variables" or "Settings" (gear icon)
2. **Look for:** "Root Directory" or "Source"
3. **Set to:** `aqar/server`

**Or if you don't see Root Directory option:**
- Railway might auto-detect it
- We'll configure it in the next step

---

## Step 5: Add Environment Variables

This is the most important step!

1. **Click:** "Variables" tab (or "Environment" tab)
2. **Click:** "New Variable" or "Add Variable"
3. **Add these 7 variables:**

### Variable 1: MONGODB_URI

**Key:**
```
MONGODB_URI
```

**Value:**
```
mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar?retryWrites=true&w=majority
```

---

### Variable 2: JWT_SECRET

**Key:**
```
JWT_SECRET
```

**Value:**
```
your_super_secret_jwt_key_here_change_in_production
```

---

### Variable 3: CLIENT_ORIGIN

**Key:**
```
CLIENT_ORIGIN
```

**Value:**
```
https://grad-projectttttt.vercel.app
```

---

### Variable 4: CLOUDINARY_CLOUD_NAME

**Key:**
```
CLOUDINARY_CLOUD_NAME
```

**Value:**
```
demo
```
(or your actual Cloudinary cloud name)

---

### Variable 5: CLOUDINARY_API_KEY

**Key:**
```
CLOUDINARY_API_KEY
```

**Value:**
```
123456789012345
```
(or your actual Cloudinary API key)

---

### Variable 6: CLOUDINARY_API_SECRET

**Key:**
```
CLOUDINARY_API_SECRET
```

**Value:**
```
abcdefghijklmnopqrstuvwxyz123456
```
(or your actual Cloudinary API secret)

---

### Variable 7: PORT

**Key:**
```
PORT
```

**Value:**
```
${{RAILWAY_PORT}}
```

⚠️ **Important:** Use exactly `${{RAILWAY_PORT}}` - Railway will replace this with the correct port

---

## Step 6: Configure Build Settings

1. **Click:** "Settings" tab
2. **Look for:** "Build Command" and "Start Command"

**Build Command:**
```
cd aqar/server && npm install
```

**Start Command:**
```
cd aqar/server && node server.js
```

**Or if Root Directory is already set to `aqar/server`:**

**Build Command:**
```
npm install
```

**Start Command:**
```
node server.js
```

---

## Step 7: Deploy

1. **Click:** "Deploy" button (if available)
2. **Or:** Railway auto-deploys after you add variables
3. **Wait:** 2-3 minutes for deployment
4. **Watch:** The logs to see deployment progress

You'll see:
- "Building..." - Installing dependencies
- "Deploying..." - Starting your server
- "Success" - ✅ Your backend is running!

---

## Step 8: Get Your Backend URL

1. **Click:** "Settings" tab
2. **Look for:** "Domains" section
3. **Click:** "Generate Domain"
4. **Railway will create a URL** like: `https://aqar-backend-production.up.railway.app`
5. **Copy this URL** - You'll need it for the frontend

---

## Step 9: Test Your Backend

### Test 1: Health Check

Open in browser:
```
https://your-railway-url.up.railway.app/api/health
```

**Should see:**
```json
{
  "success": true,
  "message": "Aqar API is running",
  "timestamp": "2025-01-11T..."
}
```

✅ **If you see this, your backend is working!**

### Test 2: Get Properties

Open in browser:
```
https://your-railway-url.up.railway.app/api/properties
```

**Should see:** JSON array with your 119 properties

✅ **If you see properties, everything is connected!**

---

# Part 2: Connect Frontend to Backend

## Step 10: Update Frontend Environment Variable

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click on:** Your frontend project (`grad-projectttttt`)
3. **Click:** Settings → Environment Variables

### Update VITE_API_URL:

**If variable exists:**
1. Find `VITE_API_URL`
2. Click "..." → "Edit"
3. Change value to: `https://your-railway-url.up.railway.app`
4. Click "Save"

**If variable doesn't exist:**
1. Click "Add New"
2. **Key:** `VITE_API_URL`
3. **Value:** `https://your-railway-url.up.railway.app`
4. **Environment:** Production and Preview
5. Click "Save"

---

## Step 11: Update Backend CORS

1. **Go back to Railway Dashboard**
2. **Click on:** Your backend service
3. **Click:** "Variables" tab
4. **Find:** `CLIENT_ORIGIN`
5. **Make sure it's:** `https://grad-projectttttt.vercel.app`
6. **If you need to edit:** Click on it, update, save

Railway will automatically redeploy.

---

## Step 12: Redeploy Frontend

1. **Go to Vercel Dashboard**
2. **Click on:** Your frontend project
3. **Click:** Deployments tab
4. **Click:** "..." on latest deployment
5. **Click:** "Redeploy"
6. **Uncheck:** "Use existing Build Cache"
7. **Click:** "Redeploy"
8. **Wait:** 2-3 minutes

---

# Part 3: Testing Everything

## Step 13: Test Complete Setup

### Test 1: Frontend Homepage
```
https://grad-projectttttt.vercel.app/
```
Should see your homepage ✅

### Test 2: Properties Loading
1. Navigate to Search page
2. Should see properties listed ✅
3. Frontend is connected to backend! 🎉

### Test 3: Routing
1. Stay on Search page
2. Press F5 to refresh
3. Should stay on Search page ✅

### Test 4: Property Details
1. Click on any property
2. Should open property detail page ✅
3. Press F5 to refresh
4. Should stay on property page ✅

---

# Part 4: Railway.app Tips

## Understanding Railway Credits

**Free Tier:**
- $5 credit per month
- Resets every month
- Enough for small projects

**Usage:**
- Your backend uses ~$3-4/month
- You have plenty of credit!

**Monitoring:**
- Check usage in Railway dashboard
- Click "Usage" tab to see credits

---

## Viewing Logs

1. **Go to Railway Dashboard**
2. **Click on your service**
3. **Click "Deployments" tab**
4. **Click on latest deployment**
5. **See real-time logs**

---

## Auto-Deployment

When you push to GitHub:
1. Railway detects the push
2. Automatically rebuilds
3. Automatically redeploys
4. Takes 2-3 minutes

---

## Custom Domain (Optional)

If you want a custom domain:
1. Go to Settings → Domains
2. Click "Custom Domain"
3. Add your domain
4. Follow DNS instructions

---

# Part 5: Troubleshooting

## Issue 1: "Application Failed to Start"

**Check Logs:**
1. Go to Deployments tab
2. Click on failed deployment
3. Read error messages

**Common Causes:**
- MongoDB connection failed
- Missing environment variables
- Wrong start command

**Fix:**
1. Verify all environment variables are set
2. Check MONGODB_URI is correct
3. Make sure PORT is set to `${{RAILWAY_PORT}}`

---

## Issue 2: Frontend Shows "No Properties Found"

**Cause:** Frontend can't connect to backend

**Check:**
1. Backend is running (check Railway dashboard)
2. `VITE_API_URL` is set correctly in Vercel
3. Frontend was redeployed after adding variable

**Fix:**
1. Test backend directly: `https://your-url.up.railway.app/api/properties`
2. If backend works, check frontend environment variable
3. Redeploy frontend

---

## Issue 3: CORS Errors

**Symptom:** Browser console shows CORS errors

**Cause:** Backend doesn't allow requests from frontend

**Fix:**
1. Go to Railway → Variables
2. Check `CLIENT_ORIGIN` = `https://grad-projectttttt.vercel.app`
3. Save and wait for redeploy

---

## Issue 4: "Service Unavailable"

**Cause:** Railway service is sleeping or crashed

**Fix:**
1. Check Railway dashboard for service status
2. Look at logs for errors
3. Redeploy if needed (click "Redeploy" button)

---

# Part 6: Configuration Summary

## Backend (Railway.app)

```
Service Name: aqar-backend
URL: https://aqar-backend-production.up.railway.app
Root Directory: aqar/server
Build Command: npm install
Start Command: node server.js

Environment Variables:
- MONGODB_URI
- JWT_SECRET
- CLIENT_ORIGIN (frontend URL)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- PORT (${{RAILWAY_PORT}})
```

## Frontend (Vercel)

```
Project Name: grad-projectttttt
URL: https://grad-projectttttt.vercel.app
Root Directory: aqar/client
Framework: Vite

Environment Variables:
- VITE_GOOGLE_MAPS_API_KEY
- VITE_API_URL (Railway backend URL)
```

---

# ✅ Success Checklist

- [ ] Railway account created (no credit card!)
- [ ] Backend deployed to Railway
- [ ] Backend shows "Success" status
- [ ] `/api/health` endpoint works
- [ ] `/api/properties` returns data
- [ ] Frontend `VITE_API_URL` updated
- [ ] Frontend redeployed
- [ ] Properties show on Search page
- [ ] Refresh works on all pages
- [ ] No CORS errors in console

---

# 🎉 You're Done!

Your Aqar Real Estate Platform is now fully deployed!

**Frontend:** https://grad-projectttttt.vercel.app (Vercel)  
**Backend:** https://your-url.up.railway.app (Railway)  
**Database:** MongoDB Atlas

All three are connected and working together! 🚀

**And best of all - NO CREDIT CARD REQUIRED!** 🎊

---

# 📞 Need Help?

If you encounter issues:

1. **Check Railway logs** - Click Deployments → Latest → View logs
2. **Check browser console** (F12) - For frontend errors
3. **Test backend directly** - Verify it's running
4. **Check environment variables** - Make sure all 7 are set
5. **Check Railway credits** - Make sure you have credit left

---

**Railway.app is perfect for your project - simple, free, and no credit card needed!** 🚂
