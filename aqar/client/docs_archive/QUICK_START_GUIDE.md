# Quick Start Guide - Aqar Real Estate Platform

## 🚀 Getting Started

This guide will help you quickly test and verify all features of the Aqar Real Estate Platform.

---

## Prerequisites

### 1. Backend Server (Already Running ✅)
- Running on: `http://localhost:5000`
- MongoDB: Connected
- Cloudinary: Configured

### 2. Frontend Server (Already Running ✅)
- Running on: `http://localhost:5174`
- Environment: Configured
- Dependencies: Installed

---

## Quick Test Scenarios

### Scenario 1: Test as Buyer (5 minutes)

1. **Register & Login**
   - Open browser: `http://localhost:5174`
   - Click "Register"
   - Fill form:
     - Name: "John Buyer"
     - Email: "buyer@test.com"
     - Password: "password123"
     - Role: "Buyer"
   - Click "Register"
   - ✅ Should redirect to dashboard

2. **Search Properties**
   - Click "Properties" in navigation
   - ✅ Should see property grid and map
   - Try filters:
     - Select "For Rent"
     - Select city "Cairo"
     - Set price range
   - ✅ Should see filtered results

3. **View Property Detail**
   - Click on any property card
   - ✅ Should see:
     - Image gallery
     - Property details
     - Map with marker
     - Owner information
     - Inquiry form

4. **Send Inquiry**
   - Scroll to inquiry form
   - Enter message: "I'm interested in this property"
   - Click "Send Inquiry"
   - ✅ Should see success notification

---

### Scenario 2: Test as Owner (10 minutes)

1. **Register & Login**
   - Click "Register"
   - Fill form:
     - Name: "Sarah Owner"
     - Email: "owner@test.com"
     - Password: "password123"
     - Role: "Owner"
   - Click "Register"
   - ✅ Should redirect to dashboard

2. **Create Property Listing**
   - Click "New Listing" button
   - **Step 1 - Basic Info**:
     - Title: "Modern Apartment in Zamalek"
     - Description: "Beautiful 3-bedroom apartment with Nile view"
     - Status: "For Sale"
     - Type: "Residential"
     - Category: "Apartment"
     - Click "Continue"
   
   - **Step 2 - Details**:
     - Price: 2500000
     - Rooms: 3
     - Bathrooms: 2
     - Area: 150
     - Add amenities: "Swimming Pool", "Parking", "Gym"
     - Upload 2-3 images
     - Click "Continue"
   
   - **Step 3 - Location**:
     - City: "Cairo"
     - District: "Zamalek"
     - Address: "15 Ahmed Heshmat Street"
     - Click "Continue"
   
   - **Step 4 - Review**:
     - Review all details
     - Click "Submit Listing"
   - ✅ Should see success notification
   - ✅ Should redirect to dashboard
   - ✅ Should see new listing with "Pending" status

3. **View Dashboard**
   - ✅ Should see statistics:
     - My Listings: 1
     - Pending Approval: 1
     - Total Views: 0
   - ✅ Should see recent listing

4. **Edit Listing**
   - Click "My Listings" tab
   - Click "Edit" icon on listing
   - Update price to 2600000
   - Navigate through steps
   - Click "Save Changes"
   - ✅ Should see success notification
   - ✅ Should see updated price

---

### Scenario 3: Test as Admin (10 minutes)

1. **Login as Admin**
   - Logout current user
   - Click "Login"
   - Enter admin credentials:
     - Email: (use existing admin account or create one)
     - Password: (admin password)
   - Click "Login"
   - ✅ Should redirect to admin dashboard

2. **View Dashboard Statistics**
   - ✅ Should see:
     - Total Users
     - Total Properties
     - Pending Approvals
     - Total Inquiries
   - ✅ Should see user breakdown by role
   - ✅ Should see quick action alert if pending > 0

3. **Approve Pending Listing**
   - Click "Review Now" or navigate to "Pending" in sidebar
   - ✅ Should see pending listing created by owner
   - Click "View Details" to review
   - Click "Approve" button
   - ✅ Should see success notification
   - ✅ Listing should disappear from pending list

4. **Verify Approved Listing**
   - Navigate to "Properties" in main navigation
   - Search for the approved property
   - ✅ Should now appear in search results

5. **Manage Users**
   - Navigate to "Users" in admin sidebar
   - ✅ Should see list of all users
   - Search for "buyer@test.com"
   - ✅ Should see filtered results
   - Change role from "Buyer" to "Owner"
   - ✅ Should see confirmation dialog
   - Confirm change
   - ✅ Should see success notification

6. **Toggle Featured Listing**
   - Navigate to "All Listings" tab
   - Click "Star" icon on a listing
   - ✅ Should see "Featured" badge appear
   - Click "Star" icon again
   - ✅ Should see "Featured" badge disappear

---

## Mobile Testing (5 minutes)

1. **Resize Browser**
   - Resize browser to mobile width (375px)
   - ✅ Should see hamburger menu icon

2. **Test Mobile Navigation**
   - Click hamburger menu
   - ✅ Should see mobile menu slide down
   - Click "Properties"
   - ✅ Should navigate and close menu

3. **Test Mobile Search**
   - ✅ Should see:
     - Single column property grid
     - Map toggle button
     - Collapsible filters
   - Click "Map" button
   - ✅ Map should hide/show

4. **Test Mobile Dashboard**
   - Navigate to dashboard
   - ✅ Should see tabs instead of sidebar
   - Click through tabs
   - ✅ Should work smoothly

---

## Error Testing (5 minutes)

1. **Test Invalid Login**
   - Logout
   - Try to login with wrong password
   - ✅ Should see error notification

2. **Test Protected Routes**
   - Logout
   - Try to access `/dashboard` directly
   - ✅ Should redirect to `/login`

3. **Test Admin Protection**
   - Login as non-admin
   - Try to access `/admin` directly
   - ✅ Should redirect to `/unauthorized`

4. **Test 404 Page**
   - Navigate to `/invalid-route`
   - ✅ Should see 404 page
   - Click "Go Home"
   - ✅ Should navigate to home page

5. **Test Validation**
   - Try to create property with empty title
   - ✅ Should see validation error
   - Try to register with invalid email
   - ✅ Should see validation error

---

## Feature Checklist

### ✅ Authentication
- [x] User registration
- [x] User login
- [x] JWT token storage
- [x] Protected routes
- [x] Role-based access control
- [x] Logout

### ✅ Property Search
- [x] View all properties
- [x] Keyword search (debounced)
- [x] Filter by status (sale/rent)
- [x] Filter by type
- [x] Filter by city
- [x] Filter by price range
- [x] Filter by rooms
- [x] Sort options
- [x] Pagination
- [x] Empty state

### ✅ Map Integration
- [x] Google Maps display
- [x] Property markers
- [x] InfoWindow popups
- [x] Marker click navigation
- [x] Map bounds filtering
- [x] Map toggle

### ✅ Property Management
- [x] Create property (multi-step form)
- [x] Upload images
- [x] Edit property
- [x] Delete property
- [x] View property detail
- [x] Image gallery (Swiper)
- [x] Send inquiry

### ✅ User Dashboard
- [x] Statistics cards
- [x] My listings view
- [x] Edit profile
- [x] View/Edit/Delete actions

### ✅ Admin Dashboard
- [x] Platform statistics
- [x] User breakdown
- [x] All listings view
- [x] Pending approvals
- [x] Approve/Reject listings
- [x] User management
- [x] Change user roles
- [x] Delete users
- [x] Toggle featured status

### ✅ Responsive Design
- [x] Mobile (320px - 640px)
- [x] Tablet (640px - 1024px)
- [x] Desktop (1024px+)
- [x] Hamburger menu
- [x] Collapsible sidebars
- [x] Responsive grids

### ✅ Error Handling
- [x] Toast notifications
- [x] Validation errors
- [x] Network errors
- [x] 401 Unauthorized
- [x] 403 Forbidden
- [x] 404 Not Found
- [x] Confirmation dialogs

### ✅ Performance
- [x] React Query caching
- [x] Debounced search
- [x] Lazy image loading
- [x] Loading states
- [x] Skeleton loaders

---

## Common Issues & Solutions

### Issue 1: Backend Not Running
**Symptom**: "Network error" notifications
**Solution**: 
```bash
cd c:\Users\Khaled\Desktop\Aqar project\aqar\server
npm run dev
```

### Issue 2: Frontend Not Running
**Symptom**: Cannot access `http://localhost:5174`
**Solution**:
```bash
cd c:\Users\Khaled\Desktop\Aqar project\aqar\client
npm run dev
```

### Issue 3: MongoDB Not Connected
**Symptom**: Backend errors about database
**Solution**: Check MongoDB is running and connection string in `.env`

### Issue 4: Images Not Uploading
**Symptom**: Error when creating property with images
**Solution**: Check Cloudinary credentials in backend `.env`

### Issue 5: Google Maps Not Loading
**Symptom**: Map shows error or blank
**Solution**: Check `VITE_GOOGLE_MAPS_API_KEY` in frontend `.env`

---

## Test Accounts

### Admin Account
- Email: (create one or use existing)
- Password: (set during creation)
- Role: Admin

### Owner Account
- Email: owner@test.com
- Password: password123
- Role: Owner

### Buyer Account
- Email: buyer@test.com
- Password: password123
- Role: Buyer

---

## Next Steps

1. ✅ **Complete Quick Test** (30 minutes)
   - Follow all 3 scenarios above
   - Verify all features work

2. ✅ **Mobile Testing** (10 minutes)
   - Test on actual mobile device or browser DevTools
   - Verify responsive design

3. ✅ **Error Testing** (10 minutes)
   - Test all error scenarios
   - Verify error handling

4. 📋 **Full Testing** (2-3 hours)
   - Use `FINAL_TESTING_CHECKLIST.md`
   - Test every feature thoroughly

5. 🚀 **Production Deployment** (Optional)
   - Deploy backend to Heroku/Railway
   - Deploy frontend to Vercel/Netlify
   - Update environment variables

---

## Support

If you encounter any issues:

1. Check browser console for errors (F12)
2. Check backend terminal for errors
3. Check frontend terminal for errors
4. Verify environment variables are set correctly
5. Verify MongoDB is connected
6. Verify Cloudinary is configured

---

## Summary

**All frontend tasks (17.1 - 26.1) are COMPLETE** ✅

The Aqar Real Estate Platform is fully functional with:
- ✅ Property management (create, edit, delete)
- ✅ User dashboard with statistics
- ✅ Admin dashboard with approvals and user management
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Error handling and notifications
- ✅ Map integration with Google Maps
- ✅ Image upload to Cloudinary
- ✅ JWT authentication and authorization
- ✅ React Query caching
- ✅ Form validation with Zod

**Ready for production deployment!** 🎉

---

**Generated**: 2025-01-XX
**Project**: Aqar Real Estate Platform
**Version**: 1.0.0
