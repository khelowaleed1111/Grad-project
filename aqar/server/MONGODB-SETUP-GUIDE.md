# MongoDB Setup Guide for Aqar Platform

This guide will help you set up MongoDB for the Aqar real estate platform. You have two options: **MongoDB Atlas (Cloud)** or **Local MongoDB Installation**.

## Option 1: MongoDB Atlas (Cloud) - Recommended

MongoDB Atlas is a free cloud-hosted MongoDB service. This is the easiest and recommended option.

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account using:
   - Email and password, OR
   - Google account, OR
   - GitHub account

### Step 2: Create a Free Cluster

1. After signing in, click **"Build a Database"**
2. Select **"M0 FREE"** tier (provides 512MB storage - sufficient for development)
3. Choose a cloud provider and region:
   - **Provider**: AWS, Google Cloud, or Azure (any works)
   - **Region**: Choose closest to Egypt (e.g., Frankfurt, Mumbai, or Bahrain)
4. **Cluster Name**: Leave default or name it `aqar-cluster`
5. Click **"Create"** (takes 1-3 minutes to provision)

### Step 3: Create Database User

1. You'll see a **"Security Quickstart"** screen
2. Under **"How would you like to authenticate your connection?"**:
   - Choose **"Username and Password"**
   - **Username**: `aqar_admin` (or any name you prefer)
   - **Password**: Click **"Autogenerate Secure Password"** or create your own
   - **IMPORTANT**: Copy and save the password securely!
3. Click **"Create User"**

### Step 4: Configure Network Access

1. Under **"Where would you like to connect from?"**:
   - Choose **"My Local Environment"**
   - Click **"Add My Current IP Address"**
   - For development, you can also click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
     - ⚠️ **Note**: For production, restrict to specific IPs only
2. Click **"Finish and Close"**

### Step 5: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select:
   - **Driver**: Node.js
   - **Version**: 5.5 or later
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://aqar_admin:<password>@aqar-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with your actual password (from Step 3)
6. **Add database name** after `.net/`:
   ```
   mongodb+srv://aqar_admin:YOUR_PASSWORD@aqar-cluster.xxxxx.mongodb.net/aqar?retryWrites=true&w=majority
   ```

### Step 6: Update .env File

1. Open `c:\Users\Khaled\Desktop\Aqar project\aqar\server\.env`
2. Replace the `MONGO_URI` line with your connection string:
   ```env
   MONGO_URI=mongodb+srv://aqar_admin:YOUR_PASSWORD@aqar-cluster.xxxxx.mongodb.net/aqar?retryWrites=true&w=majority
   ```

### Step 7: Test Connection

1. Open terminal in the server directory:
   ```bash
   cd "c:\Users\Khaled\Desktop\Aqar project\aqar\server"
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. You should see:
   ```
   🚀 Server running on port 5000
   📍 API: http://localhost:5000/api
   🏥 Health: http://localhost:5000/api/health
   ✅ MongoDB Connected: aqar-cluster.xxxxx.mongodb.net
   ```

4. If you see **"MongoDB Connected"**, you're all set! ✅

---

## Option 2: Local MongoDB Installation

If you prefer to run MongoDB locally on your machine:

### Step 1: Download MongoDB Community Server

1. Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Select:
   - **Version**: Latest (e.g., 7.0.x)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **"Download"**

### Step 2: Install MongoDB

1. Run the downloaded `.msi` installer
2. Choose **"Complete"** installation
3. **Install MongoDB as a Service**:
   - Check ✅ **"Install MongoDB as a Service"**
   - Service Name: `MongoDB`
   - Data Directory: `C:\Program Files\MongoDB\Server\7.0\data\`
   - Log Directory: `C:\Program Files\MongoDB\Server\7.0\log\`
4. **Install MongoDB Compass** (optional GUI tool):
   - Check ✅ **"Install MongoDB Compass"** (recommended for beginners)
5. Click **"Install"** and wait for completion

### Step 3: Verify MongoDB is Running

1. Open **Services** (press `Win + R`, type `services.msc`, press Enter)
2. Find **"MongoDB"** in the list
3. Verify **Status** is **"Running"**
4. If not running, right-click → **"Start"**

### Step 4: Update .env File

1. Open `c:\Users\Khaled\Desktop\Aqar project\aqar\server\.env`
2. Replace the `MONGO_URI` line:
   ```env
   MONGO_URI=mongodb://localhost:27017/aqar
   ```

### Step 5: Test Connection

1. Open terminal in the server directory:
   ```bash
   cd "c:\Users\Khaled\Desktop\Aqar project\aqar\server"
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. You should see:
   ```
   🚀 Server running on port 5000
   📍 API: http://localhost:5000/api
   🏥 Health: http://localhost:5000/api/health
   ✅ MongoDB Connected: localhost
   ```

---

## Cloudinary Setup (For Image Uploads)

Cloudinary is used to store and serve property images via CDN.

### Step 1: Create Cloudinary Account

1. Go to [Cloudinary Sign Up](https://cloudinary.com/users/register/free)
2. Sign up for a free account (provides 25GB storage and 25GB bandwidth/month)

### Step 2: Get API Credentials

1. After signing in, go to **Dashboard**
2. You'll see your credentials:
   - **Cloud Name**: e.g., `dxxxxx`
   - **API Key**: e.g., `123456789012345`
   - **API Secret**: e.g., `abcdefghijklmnopqrstuvwxyz`
3. Copy these values

### Step 3: Update .env File

1. Open `c:\Users\Khaled\Desktop\Aqar project\aqar\server\.env`
2. Replace the Cloudinary lines:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

---

## Complete .env Configuration

After setting up MongoDB and Cloudinary, your `.env` file should look like this:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://aqar_admin:YOUR_PASSWORD@aqar-cluster.xxxxx.mongodb.net/aqar?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_abc123xyz789
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# CORS Configuration
CLIENT_ORIGIN=http://localhost:5173
```

### Important Notes:

1. **JWT_SECRET**: Change this to a long, random string for security
   - Example: `aqar_platform_secret_key_2024_production_xyz123abc456`
   - You can generate one using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

2. **Never commit .env to Git**: The `.gitignore` file already excludes it

---

## Troubleshooting

### Issue: "MongooseServerSelectionError: connect ECONNREFUSED"

**Cause**: MongoDB is not running or connection string is incorrect

**Solutions**:
- **Atlas**: Verify connection string, password, and network access (IP whitelist)
- **Local**: Check if MongoDB service is running in Services
- **Both**: Ensure no firewall blocking port 27017 (local) or 27017-27019 (Atlas)

### Issue: "Authentication failed"

**Cause**: Incorrect username or password in connection string

**Solutions**:
- Verify username and password in MongoDB Atlas → Database Access
- Ensure password doesn't contain special characters (or URL-encode them)
- Example: If password is `P@ss!`, encode as `P%40ss%21`

### Issue: "Network timeout"

**Cause**: IP address not whitelisted in Atlas

**Solutions**:
- Go to MongoDB Atlas → Network Access
- Add your current IP or use `0.0.0.0/0` for development

### Issue: "Cloudinary upload failed"

**Cause**: Invalid Cloudinary credentials

**Solutions**:
- Verify Cloud Name, API Key, and API Secret in Cloudinary Dashboard
- Ensure no extra spaces in `.env` file
- Restart server after updating `.env`

---

## Verify Everything Works

### Test 1: Health Check

```bash
curl http://localhost:5000/api/health
```

**Expected**:
```json
{
  "success": true,
  "message": "Aqar API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test 2: Database Connection

Check server console output for:
```
✅ MongoDB Connected: <your-connection-host>
```

### Test 3: Create Test User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Expected**: User created successfully with JWT token

---

## Next Steps

Once MongoDB and Cloudinary are configured:

1. ✅ Start the server: `npm run dev`
2. ✅ Run manual API tests: `node manual-api-tests.js`
3. ✅ Review test results in `test-report.json`
4. ✅ Continue with frontend development

---

## Quick Reference

### MongoDB Atlas Dashboard
- URL: https://cloud.mongodb.com/
- Manage: Clusters, Users, Network Access, Monitoring

### Cloudinary Dashboard
- URL: https://cloudinary.com/console
- Manage: Media Library, Upload Presets, Transformations

### Useful Commands

```bash
# Start server in development mode
npm run dev

# Start server in production mode
npm start

# Run tests
npm test

# Run manual API tests
node manual-api-tests.js

# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Security Best Practices

1. **Never share your .env file** or commit it to Git
2. **Use strong passwords** for MongoDB users
3. **Restrict IP access** in production (don't use 0.0.0.0/0)
4. **Rotate JWT_SECRET** periodically
5. **Use environment-specific .env files** (.env.development, .env.production)
6. **Enable MongoDB authentication** even for local instances
7. **Use HTTPS** in production for API and frontend

---

## Support

If you encounter issues:

1. Check server console logs for error messages
2. Verify all credentials in `.env` are correct
3. Ensure MongoDB and server are running
4. Review this guide's troubleshooting section
5. Check MongoDB Atlas logs (Atlas → Clusters → Metrics)

---

**You're now ready to run the Aqar platform backend! 🚀**
