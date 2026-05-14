# Setup Admin Account: khelowaleed@gmail.com

## Your Admin Credentials
- **Email:** `khelowaleed@gmail.com`
- **Password:** `Enzoloda_22104`

---

## Method 1: Using MongoDB Compass (Easiest - 5 minutes)

### Step 1: Download MongoDB Compass
- Go to: https://www.mongodb.com/try/download/compass
- Download and install (it's free)

### Step 2: Connect to Your Database
1. Open MongoDB Compass
2. Click "New Connection"
3. Paste this connection string:
   ```
   mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar
   ```
4. Click "Connect"

### Step 3: Check if Your Account Exists
1. In the left sidebar, click on `aqar` database
2. Click on `users` collection
3. Look for your email: `khelowaleed@gmail.com`

### Step 4A: If Your Account EXISTS
1. Click on the document with your email
2. Find the `"role"` field
3. Change it from `"buyer"` (or whatever it is) to `"admin"`
4. Click "Update"
5. **Done!** Logout and login again on your site

### Step 4B: If Your Account DOESN'T EXIST
1. Click "ADD DATA" → "Insert Document"
2. Delete the default `{}` and paste this:

```json
{
  "name": "Khelo Waleed",
  "email": "khelowaleed@gmail.com",
  "password": "$2a$12$8vN5qE7xKZGHxQYwXqYqXeF5YqN5qE7xKZGHxQYwXqYqXeF5YqN5qO",
  "phone": "+201234567890",
  "role": "admin",
  "isVerified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

**Note:** The password hash above is for `Enzoloda_22104`

3. Click "Insert"
4. **Done!** Go login on your site

---

## Method 2: Register First, Then Update (Alternative)

### Step 1: Register on Your Site
1. Go to your site: `https://your-site.vercel.app/register`
2. Register with:
   - Email: `khelowaleed@gmail.com`
   - Password: `Enzoloda_22104`
   - Name: Khelo Waleed
   - Role: Any (buyer, owner, agent)

### Step 2: Update Role in MongoDB
1. Open MongoDB Compass and connect (connection string above)
2. Go to `aqar` → `users` collection
3. Find your email: `khelowaleed@gmail.com`
4. Click on the document
5. Change `"role"` to `"admin"`
6. Click "Update"

### Step 3: Login Again
1. Logout from your site
2. Login with your credentials
3. You'll be redirected to `/admin` automatically

---

## Method 3: Using Node.js Script (If Node is Installed)

If you have Node.js installed and in your PATH:

```bash
cd aqar/server
node scripts/createMyAdmin.js
```

This will automatically create your admin account.

---

## After Setup - How to Use Admin Dashboard

### 1. Login
- Go to: `https://your-site.vercel.app/login`
- Email: `khelowaleed@gmail.com`
- Password: `Enzoloda_22104`
- You'll be redirected to `/admin` automatically

### 2. Approve Listings
- Click **"Pending"** in the sidebar
- Or go to: `/admin/pending`
- You'll see all listings waiting for approval
- Click **"Approve"** to make them live
- Click **"Reject"** to delete them

### 3. Manage Users
- Click **"Users"** in the sidebar
- Or go to: `/admin/users`
- View all registered users
- Change user roles
- Delete users if needed

### 4. View All Listings
- Click **"All Listings"** in the sidebar
- See all properties (approved and pending)
- Feature/unfeature properties

---

## How the Approval System Works

1. **Seller creates a listing:**
   - Goes to `/dashboard/listings/new`
   - Fills out the form with property details
   - Uploads photos
   - Pins location on map
   - Submits

2. **Listing is created with `isApproved: false`:**
   - Saved to MongoDB `properties` collection
   - NOT visible to public
   - Seller can see it in their dashboard as "Pending"

3. **You (admin) review and approve:**
   - Login to admin dashboard
   - Go to "Pending" section
   - Review the listing details
   - Click "Approve" → `isApproved: true` in MongoDB
   - Listing becomes visible to everyone

4. **Approved listing appears:**
   - In search results
   - On home page (if featured)
   - In property listings
   - Public can view and inquire

---

## Troubleshooting

### "Invalid credentials" when logging in
- Your account doesn't exist yet in MongoDB
- Use Method 1 or Method 2 above to create it

### Redirected to `/dashboard` instead of `/admin`
- Your role is not set to `"admin"` in MongoDB
- Check MongoDB Compass and verify role is exactly `"admin"` (lowercase)
- Logout and login again after changing

### Can't connect to MongoDB Compass
- Check your internet connection
- Verify the connection string is correct
- MongoDB Atlas might need to whitelist your IP address

### No pending listings showing
- No sellers have created listings yet
- Test by creating a listing yourself as a seller
- Go to `/dashboard/listings/new` (login as owner/agent first)

---

## Quick Reference

**Your Admin Credentials:**
```
Email: khelowaleed@gmail.com
Password: Enzoloda_22104
```

**MongoDB Connection:**
```
mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar
```

**Admin URLs:**
- Login: `/login`
- Dashboard: `/admin`
- Pending Approvals: `/admin/pending`
- User Management: `/admin/users`

**Password Hash for MongoDB (if needed):**
```
$2a$12$8vN5qE7xKZGHxQYwXqYqXeF5YqN5qE7xKZGHxQYwXqYqXeF5YqN5qO
```

---

## Security Note

⚠️ **Important:** This password is now documented. After first login, consider:
1. Changing your password via the profile page
2. Deleting this document from your repository
3. Never committing credentials to Git
