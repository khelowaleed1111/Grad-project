# 🚀 Deploy Backend to Render.com - Complete Guide

## Why Render.com?

- ✅ **Simple** - No serverless configuration needed
- ✅ **Free tier** - Perfect for your project
- ✅ **Works immediately** - Traditional Node.js deployment
- ✅ **Auto-deploys** - Connects to GitHub like Vercel
- ✅ **Always on** - Not serverless, stays running

---

# Part 1: Deploy Backend to Render.com

## Step 1: Sign Up for Render

1. **Go to:** https://render.com/
2. **Click:** "Get Started" or "Sign Up"
3. **Sign up with GitHub:**
   - Click "Sign up with GitHub"
   - Authorize Render to access your GitHub
   - This makes deployment super easy!

---

## Step 2: Create New Web Service

1. **After signing in, click:** "New +" button (top right)
2. **Select:** "Web Service"
3. **You'll see:** "Create a new Web Service"

---

## Step 3: Connect Your Repository

1. **Find your repository:** Look for "Grad-project" or search for it
2. **Click:** "Connect" button next to your repository

**If you don't see your repository:**
- Click "Configure account" 
- Make sure Render has access to your repositories
- Come back and refresh

---

## Step 4: Configure Web Service

Now you'll see a configuration form. Fill it out exactly like this:

### Basic Settings:

**Name:**
```
aqar-backend
```
(or any name you prefer - this will be part of your URL)

**Region:**
```
Frankfurt (EU Central)
```
(or closest to you - doesn't matter much)

**Branch:**
```
main
```
(your main branch)

**Root Directory:**
```
aqar/server
```
⚠️ **CRITICAL:** This tells Render where your backend code is

**Runtime:**
```
Node
```
(should be auto-detected)

---

### Build & Deploy Settings:

**Build Command:**
```
npm install
```

**Start Command:**
```
node server.js
```

**Instance Type:**
```
Free
```
(select the free tier)

---

## Step 5: Add Environment Variables

Scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** and add these 6 variables:

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
(your frontend URL)

---

### Variable 4: CLOUDINARY_CLOUD_NAME

**Key:**
```
CLOUDINARY_CLOUD_NAME
```

**Value:**
```
(your Cloudinary cloud name or "demo" for now)
```

---

### Variable 5: CLOUDINARY_API_KEY

**Key:**
```
CLOUDINARY_API_KEY
```

**Value:**
```
(your Cloudinary API key or "123456789012345" for now)
```

---

### Variable 6: CLOUDINARY_API_SECRET

**Key:**
```
CLOUDINARY_API_SECRET
```

**Value:**
```
(your Cloudinary API secret or "abcdefghijklmnopqrstuvwxyz123456" for now)
```

---

### Variable 7: PORT (Optional but Recommended)

**Key:**
```
PORT
```

**Value:**
```
10000
```
(Render uses port 10000 by default)

---

## Step 6: Create Web Service

1. **Review all settings** - Make sure everything is correct
2. **Click:** "Create Web Service" button at the bottom
3. **Wait for deployment** (3-5 minutes)

You'll see:
- "Building..." - Installing dependencies
- "Deploying..." - Starting your server
- "Live" - ✅ Your backend is running!

---

## Step 7: Get Your Backend URL

Once deployment is complete:

1. **Look at the top** of the page
2. **You'll see your URL:** `https://aqar-backend.onrender.com` (or similar)
3. **Copy this URL** - You'll need it for the frontend

---

## Step 8: Test Your Backend

### Test 1: Health Check

Open in browser:
```
https://aqar-backend.onrender.com/api/health
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
https://aqar-backend.onrender.com/api/properties
```

**Should see:** JSON array with your 119 properties

✅ **If you see properties, everything is connected!**

---

# Part 2: Connect Frontend to Backend

Now we need to tell your frontend to use the new backend URL.

## Step 9: Update Frontend Environment Variable

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click on:** Your frontend project (`grad-projectttttt`)
3. **Click:** Settings → Environment Variables
4. **Find:** `VITE_API_URL` variable

### If Variable Exists:

1. **Click:** "..." menu → "Edit"
2. **Change value to:** `https://aqar-backend.onrender.com` (your Render URL)
3. **Click:** "Save"

### If Variable Doesn't Exist:

1. **Click:** "Add New"
2. **Key:** `VITE_API_URL`
3. **Value:** `https://aqar-backend.onrender.com` (your Render URL)
4. **Environment:** Production and Preview (check both)
5. **Click:** "Save"

---

## Step 10: Update Backend CORS

Your backend needs to allow requests from your frontend.

1. **Go back to Render Dashboard**
2. **Click on:** Your backend service (`aqar-backend`)
3. **Click:** "Environment" in left sidebar
4. **Find:** `CLIENT_ORIGIN` variable
5. **Click:** "Edit"
6. **Make sure value is:** `https://grad-projectttttt.vercel.app` (your frontend URL)
7. **Click:** "Save Changes"

**Render will automatically redeploy** with the new setting.

---

## Step 11: Redeploy Frontend

Now redeploy your frontend to use the new backend URL:

1. **Go to Vercel Dashboard**
2. **Click on:** Your frontend project
3. **Click:** Deployments tab
4. **Click:** "..." on latest deployment
5. **Click:** "Redeploy"
6. **Uncheck:** "Use existing Build Cache"
7. **Click:** "Redeploy"
8. **Wait** 2-3 minutes

---

# Part 3: Testing Everything

## Step 12: Test Complete Setup

Once both deployments are complete:

### Test 1: Frontend Homepage

1. **Open:** `https://grad-projectttttt.vercel.app/`
2. **Should see:** Your homepage ✅

### Test 2: Properties Loading

1. **Navigate to:** Search page
2. **Should see:** Properties listed ✅
3. **If you see properties:** Frontend is connected to backend! 🎉

### Test 3: Routing (Refresh Test)

1. **Stay on Search page**
2. **Press F5** to refresh
3. **Should stay on Search page** (not 404) ✅

### Test 4: Property Details

1. **Click on any property**
2. **Should open:** Property detail page ✅
3. **Press F5** to refresh
4. **Should stay on property page** ✅

---

# Part 4: Troubleshooting

## Issue 1: Frontend Shows "No Properties Found"

**Cause:** Frontend can't connect to backend

**Check:**
1. Backend is running on Render (shows "Live" status)
2. `VITE_API_URL` is set correctly in Vercel
3. Frontend was redeployed after adding the variable

**Fix:**
1. Test backend directly: `https://aqar-backend.onrender.com/api/properties`
2. If backend works, check frontend environment variable
3. Make sure you redeployed frontend

---

## Issue 2: CORS Errors in Browser Console

**Symptom:** Browser console shows CORS errors

**Cause:** Backend doesn't allow requests from frontend

**Fix:**
1. Go to Render → Your backend → Environment
2. Check `CLIENT_ORIGIN` = `https://grad-projectttttt.vercel.app`
3. Save and wait for redeploy

---

## Issue 3: Backend Shows "Application Failed to Respond"

**Cause:** Backend crashed or MongoDB connection failed

**Check Logs:**
1. Go to Render Dashboard
2. Click on your backend service
3. Click "Logs" tab
4. Look for error messages

**Common Issues:**
- MongoDB connection string wrong
- Missing environment variables
- Port configuration issue

---

## Issue 4: Render Free Tier Sleeps After Inactivity

**What happens:**
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Subsequent requests are fast

**Solutions:**
1. **Accept it** - It's free! First load is slow, then fast
2. **Upgrade to paid** - $7/month for always-on service
3. **Use a ping service** - Keep it awake (not recommended for free tier)

---

# Part 5: Configuration Summary

## Backend (Render.com)

```
Service Name: aqar-backend
URL: https://aqar-backend.onrender.com
Root Directory: aqar/server
Build Command: npm install
Start Command: node server.js
Instance Type: Free

Environment Variables:
- MONGODB_URI
- JWT_SECRET
- CLIENT_ORIGIN (frontend URL)
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- PORT (10000)
```

## Frontend (Vercel)

```
Project Name: grad-projectttttt
URL: https://grad-projectttttt.vercel.app
Root Directory: aqar/client
Framework: Vite

Environment Variables:
- VITE_GOOGLE_MAPS_API_KEY
- VITE_API_URL (backend URL)
```

---

# Part 6: Maintenance

## Viewing Logs

**Backend Logs (Render):**
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. See real-time logs

**Frontend Logs (Vercel):**
1. Go to Vercel Dashboard
2. Click on deployment
3. View build logs

## Updating Code

When you push to GitHub:
1. **Render** auto-detects and redeploys backend
2. **Vercel** auto-detects and redeploys frontend
3. Wait 3-5 minutes for both
4. Test the changes

## Rolling Back

**Render:**
1. Go to Deployments tab
2. Find working deployment
3. Click "..." → "Redeploy"

**Vercel:**
1. Go to Deployments tab
2. Find working deployment
3. Click "..." → "Promote to Production"

---

# ✅ Success Checklist

After following this guide:

- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Backend shows "Live" status
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
**Backend:** https://aqar-backend.onrender.com (Render)  
**Database:** MongoDB Atlas

All three are connected and working together! 🚀

---

# 📞 Need Help?

If you encounter issues:

1. **Check Render logs** - Most backend issues show here
2. **Check browser console** (F12) - For frontend errors
3. **Test backend directly** - Verify it's running
4. **Check environment variables** - Make sure all are set
5. **Wait for deployments** - Both services need time to deploy

---

**Good luck with your deployment!** 🎊
