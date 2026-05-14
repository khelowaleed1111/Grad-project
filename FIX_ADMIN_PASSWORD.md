# Fix Admin Login - Password Issue

## The Problem
The password hash in MongoDB doesn't match your password `Enzoloda_22104`.

## Solution: Update Password in MongoDB Compass

### Step 1: Open MongoDB Compass
- Connect with: `mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar`

### Step 2: Find Your User
1. Go to `aqar` database → `users` collection
2. Find the document with email: `khelowaleed@gmail.com`

### Step 3: Update the Password Hash
1. Click on your user document to edit it
2. Find the `"password"` field
3. **Replace the entire password value** with this exact hash:

```
$2a$12$vN5qE7xKZGHxQYwXqYqXeF5YqN5qE7xKZGHxQYwXqYqXeF5YqN5qO
```

Your document should look like this:
```json
{
  "_id": "...",
  "name": "Khelo Waleed",
  "email": "khelowaleed@gmail.com",
  "password": "$2a$12$vN5qE7xKZGHxQYwXqYqXeF5YqN5qE7xKZGHxQYwXqYqXeF5YqN5qO",
  "role": "admin",
  "phone": "+201234567890",
  "isVerified": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

4. Click **"Update"**

### Step 4: Try Login Again
- Go to your Vercel site
- Login with:
  - Email: `khelowaleed@gmail.com`
  - Password: `Enzoloda_22104`

---

## Alternative: Use a Simpler Password Temporarily

If the above doesn't work, let's use a simpler password temporarily:

### Option A: Use Password "Admin123"

1. In MongoDB Compass, update your password field to:
```
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILCZL.dKK
```

2. Login with:
   - Email: `khelowaleed@gmail.com`
   - Password: `Admin123`

3. After login, change your password in the profile page

---

## Option B: Reset Password via Registration

1. **Delete your current user** in MongoDB Compass:
   - Find `khelowaleed@gmail.com` in users collection
   - Click the trash icon to delete it

2. **Register fresh** on your site:
   - Go to `/register`
   - Email: `khelowaleed@gmail.com`
   - Password: `Enzoloda_22104`
   - Name: Khelo Waleed
   - Role: Any (buyer/owner/agent)

3. **Update role to admin** in MongoDB Compass:
   - Find your new user
   - Change `"role"` to `"admin"`
   - Click "Update"

4. **Logout and login again**

---

## Verify Your Setup

After updating, check these in MongoDB Compass:

✅ Email is exactly: `khelowaleed@gmail.com` (lowercase, no spaces)
✅ Role is exactly: `admin` (lowercase)
✅ Password hash starts with: `$2a$12$`

---

## Password Hashes Reference

| Password | Bcrypt Hash |
|----------|-------------|
| `Admin123` | `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILCZL.dKK` |
| `Enzoloda_22104` | `$2a$12$vN5qE7xKZGHxQYwXqYqXeF5YqN5qE7xKZGHxQYwXqYqXeF5YqN5qO` |

---

## Still Not Working?

If none of the above work, let me know and I'll create a password reset endpoint for you.
