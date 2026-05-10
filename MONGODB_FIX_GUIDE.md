# 🔧 MongoDB Connection Fix Guide

## Problem
Your backend cannot connect to MongoDB Atlas because your IP address is not whitelisted.

## Quick Fix (5 minutes)

### Step 1: Go to MongoDB Atlas
1. Open: https://cloud.mongodb.com
2. Login with your credentials

### Step 2: Whitelist Your IP Address
1. Click on your cluster (Cluster0)
2. Click **"Network Access"** in the left sidebar
3. Click **"Add IP Address"** button
4. Choose one option:

   **Option A - Allow Current IP (Recommended for development):**
   - Click **"Add Current IP Address"**
   - Click **"Confirm"**

   **Option B - Allow All IPs (Easy but less secure):**
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` to whitelist
   - Click **"Confirm"**

### Step 3: Wait 1-2 Minutes
MongoDB Atlas needs time to update the whitelist.

### Step 4: Restart Backend
The backend will automatically reconnect once your IP is whitelisted.

## Verify Connection

After whitelisting, check the backend terminal. You should see:
```
✅ MongoDB Connected: ac-qefeveb-shard-00-00.zmyr1t8.mongodb.net
📊 Database: aqar
```

## Alternative: Use Local MongoDB

If you prefer to use local MongoDB instead:

1. Install MongoDB Community Edition:
   - Download: https://www.mongodb.com/try/download/community
   - Install with default settings

2. Update `aqar/server/.env`:
   ```env
   MONGO_URI=mongodb://localhost:27017/aqar
   ```

3. Import data:
   ```bash
   cd aqar/server
   node scripts/importBrokerData.js
   ```

## Still Having Issues?

### Check if MongoDB Cluster is Paused
1. Go to MongoDB Atlas dashboard
2. If cluster shows "Paused", click **"Resume"**
3. Wait for cluster to start (2-3 minutes)

### Verify Credentials
Make sure your `.env` file has the correct:
- Username: `khelowaleed_db_user`
- Password: `R7YQFHNjiS799iDQ`
- Database: `aqar`

### Check Firewall
Some corporate/school networks block MongoDB Atlas. Try:
- Using a different network
- Using mobile hotspot
- Using VPN

---

**Current Status:** Backend crashed due to MongoDB connection failure. Once you whitelist your IP, the backend will automatically reconnect.
