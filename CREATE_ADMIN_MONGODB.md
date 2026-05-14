# Create Admin User - MongoDB Direct Method

Since Node.js isn't in your PATH, here are alternative methods to create an admin user:

---

## Method 1: Using MongoDB Compass (Easiest)

1. **Open MongoDB Compass**

2. **Connect to your database:**
   ```
   mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar
   ```

3. **Navigate to the `aqar` database → `users` collection**

4. **Click "ADD DATA" → "Insert Document"**

5. **Paste this JSON** (replace the password hash with a bcrypt hash):

```json
{
  "name": "Admin User",
  "email": "admin@aqar.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILCZL.dKK",
  "phone": "+201234567890",
  "role": "admin",
  "isVerified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

**Note:** The password hash above is for `Admin@123`

6. **Click "Insert"**

7. **Login with:**
   - Email: `admin@aqar.com`
   - Password: `Admin@123`

---

## Method 2: Register Normally, Then Update Role

1. **Go to your site and register a new account:**
   - Use any email (e.g., `youremail@example.com`)
   - Choose any role (buyer, owner, agent)
   - Complete registration

2. **Open MongoDB Compass and connect**

3. **Find your user in the `users` collection:**
   ```javascript
   { "email": "youremail@example.com" }
   ```

4. **Click on the document and edit it:**
   - Change `"role": "buyer"` to `"role": "admin"`
   - Click "Update"

5. **Logout and login again** with your account

6. **You now have admin access!**

---

## Method 3: Using MongoDB Shell (if installed)

1. **Open terminal/command prompt**

2. **Connect to MongoDB:**
   ```bash
   mongosh "mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar"
   ```

3. **Run this command:**
   ```javascript
   db.users.insertOne({
     name: "Admin User",
     email: "admin@aqar.com",
     password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILCZL.dKK",
     phone: "+201234567890",
     role: "admin",
     isVerified: true,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

4. **Login with:**
   - Email: `admin@aqar.com`
   - Password: `Admin@123`

---

## Method 4: Update Existing User to Admin (Simplest)

If you already have an account:

1. **Open MongoDB Compass**
2. **Connect to your database**
3. **Go to `aqar` → `users` collection**
4. **Find your user by email**
5. **Edit the document:**
   - Change `"role"` from `"buyer"` (or whatever it is) to `"admin"`
6. **Save/Update**
7. **Logout and login again**

---

## Verify Admin Access

After creating/updating the admin user:

1. **Login at:** `https://your-site.vercel.app/login`
2. **You should be redirected to:** `/admin` (not `/dashboard`)
3. **You'll see:**
   - Admin Dashboard with statistics
   - Sidebar with: Overview, All Listings, Pending, Users
4. **Click "Pending"** to approve listings

---

## Troubleshooting

### "Invalid credentials" error
- The user doesn't exist in the database yet
- Try Method 2 (register first, then update role)

### Redirected to `/dashboard` instead of `/admin`
- Your role is not set to `"admin"`
- Check MongoDB and verify the role field is exactly `"admin"` (lowercase)
- Logout and login again after changing role

### Can't connect to MongoDB
- Check your internet connection
- Verify the connection string is correct
- Make sure MongoDB Atlas allows connections from your IP

---

## Quick Reference

**Pre-hashed Password for `Admin@123`:**
```
$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILCZL.dKK
```

**MongoDB Connection String:**
```
mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar
```

**Admin Credentials (after creation):**
- Email: `admin@aqar.com`
- Password: `Admin@123`

**Admin Dashboard URL:**
```
https://your-site.vercel.app/admin
```
