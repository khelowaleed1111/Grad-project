# Admin Dashboard Access Guide

## How to Access the Admin Dashboard

### Option 1: Create Admin User via Script (Recommended)

1. **Navigate to server directory:**
   ```bash
   cd aqar/server
   ```

2. **Run the admin creation script:**
   ```bash
   node scripts/createAdmin.js
   ```

3. **Use the credentials shown:**
   - **Email:** `admin@aqar.com`
   - **Password:** `Admin@123`

4. **Login:**
   - Go to: `https://your-vercel-url.vercel.app/login`
   - Or locally: `http://localhost:5173/login`
   - Enter the admin credentials

5. **Access Admin Dashboard:**
   - After login, you'll be automatically redirected to `/admin`
   - Or manually navigate to: `https://your-vercel-url.vercel.app/admin`

---

### Option 2: Manually Update Existing User to Admin

If you already have a user account and want to make it admin:

1. **Connect to MongoDB:**
   - Use MongoDB Compass, Studio 3T, or mongo shell
   - Connection string from your `.env` file

2. **Find your user:**
   ```javascript
   db.users.findOne({ email: "your-email@example.com" })
   ```

3. **Update role to admin:**
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

4. **Logout and login again** to refresh your session

---

### Option 3: Register with Admin Role (Development Only)

**⚠️ Only works if backend validation allows it**

When registering, you can try setting role to `admin` in the registration form, but this is typically blocked in production for security.

---

## Admin Dashboard Features

Once logged in as admin, you can access:

### 1. **Admin Dashboard** (`/admin`)
   - Overview statistics
   - Total users, properties, inquiries
   - Recent activity
   - Quick actions

### 2. **Pending Approvals** (`/admin/pending`)
   - View all pending property listings
   - **Approve** listings to make them live
   - **Reject** listings to remove them
   - See property details, images, location

### 3. **User Management** (`/admin/users`)
   - View all registered users
   - Change user roles (buyer, owner, agent, admin)
   - Delete users
   - Filter by role
   - Search users

### 4. **All Listings** (in main dashboard)
   - View all properties (approved and pending)
   - Filter by status, type
   - Feature/unfeature properties

---

## Approving Listings - Step by Step

1. **Login as admin** using credentials above

2. **Navigate to Pending Approvals:**
   - Click "Pending" in the admin sidebar
   - Or go to: `/admin/pending`

3. **Review the listing:**
   - Check property details (title, price, location)
   - View uploaded images
   - Verify information is accurate

4. **Approve or Reject:**
   - Click **"Approve"** button → Listing goes live immediately
   - Click **"Reject"** button → Listing is permanently deleted

5. **Approved listings appear:**
   - In public search results
   - On the home page (if featured)
   - In property listings

---

## Security Notes

- **Change the default admin password** after first login
- Admin role has full access to:
  - Approve/reject all listings
  - Manage all users
  - Delete any content
- Only trusted users should have admin access
- Admin credentials should never be committed to Git

---

## Troubleshooting

### "Access Denied" or redirected to `/unauthorized`
- Your user role is not `admin`
- Logout and login again after role change
- Check MongoDB to verify role is set correctly

### Can't see pending listings
- No listings have been submitted yet
- Sellers need to create listings first
- Check `/dashboard/listings/new` as a seller

### Admin dashboard not loading
- Verify you're logged in
- Check browser console for errors
- Ensure backend is running and connected to MongoDB

---

## Quick Reference

| Action | URL |
|--------|-----|
| Login | `/login` |
| Admin Dashboard | `/admin` |
| Pending Approvals | `/admin/pending` |
| User Management | `/admin/users` |
| Create Admin Script | `node scripts/createAdmin.js` |

**Default Admin Credentials:**
- Email: `admin@aqar.com`
- Password: `Admin@123`

**⚠️ Remember to change the password after first login!**
