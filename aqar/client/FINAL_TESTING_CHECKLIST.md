# Final Testing Checklist - Aqar Real Estate Platform

## Testing Status: ✅ READY FOR USER ACCEPTANCE TESTING

This checklist provides a comprehensive guide for testing all features of the Aqar Real Estate Platform frontend.

---

## Prerequisites

### Backend Server
- ✅ Backend running on `http://localhost:5000`
- ✅ MongoDB connected
- ✅ Cloudinary configured

### Frontend Server
- ✅ Frontend running on `http://localhost:5174`
- ✅ Environment variables configured
- ✅ All dependencies installed

---

## 1. Authentication & Authorization Tests

### 1.1 User Registration
- [ ] Navigate to `/register`
- [ ] Fill in registration form (name, email, password, phone, role)
- [ ] Submit form
- [ ] Verify success toast notification
- [ ] Verify redirect to dashboard
- [ ] Verify JWT token stored in localStorage

### 1.2 User Login
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Submit form
- [ ] Verify success toast notification
- [ ] Verify redirect to dashboard
- [ ] Verify user data in AuthContext

### 1.3 Invalid Login
- [ ] Navigate to `/login`
- [ ] Enter invalid credentials
- [ ] Submit form
- [ ] Verify error toast notification
- [ ] Verify no redirect

### 1.4 Protected Routes
- [ ] Logout (if logged in)
- [ ] Try to access `/dashboard`
- [ ] Verify redirect to `/login`
- [ ] Login
- [ ] Verify redirect back to `/dashboard`

### 1.5 Role-Based Access
- [ ] Login as non-admin user
- [ ] Try to access `/admin`
- [ ] Verify redirect to `/unauthorized`
- [ ] Logout and login as admin
- [ ] Access `/admin`
- [ ] Verify successful access

### 1.6 Logout
- [ ] Click logout button
- [ ] Verify success toast notification
- [ ] Verify redirect to home page
- [ ] Verify token removed from localStorage

---

## 2. Property Search & Filtering Tests

### 2.1 Basic Search
- [ ] Navigate to `/search`
- [ ] Verify properties are displayed
- [ ] Verify map is displayed
- [ ] Verify property count is shown

### 2.2 Keyword Search
- [ ] Enter keyword in search bar (e.g., "apartment")
- [ ] Wait 300ms (debounce)
- [ ] Verify filtered results
- [ ] Verify URL updated with `?keyword=apartment`

### 2.3 Status Filter
- [ ] Click "Buy" button
- [ ] Verify only "sale" properties shown
- [ ] Click "Rent" button
- [ ] Verify only "rent" properties shown
- [ ] Click "All" button
- [ ] Verify all properties shown

### 2.4 Type Filter
- [ ] Open filters sidebar
- [ ] Select "Residential" type
- [ ] Verify only residential properties shown
- [ ] Select "Commercial" type
- [ ] Verify only commercial properties shown

### 2.5 Price Range Filter
- [ ] Open filters sidebar
- [ ] Set min price (e.g., 500000)
- [ ] Set max price (e.g., 2000000)
- [ ] Verify only properties in range shown

### 2.6 City Filter
- [ ] Open filters sidebar
- [ ] Select city (e.g., "Cairo")
- [ ] Verify only properties in Cairo shown

### 2.7 Rooms Filter
- [ ] Open filters sidebar
- [ ] Select number of rooms (e.g., 3)
- [ ] Verify only properties with 3 rooms shown

### 2.8 Sort Options
- [ ] Select "Price: Low → High"
- [ ] Verify properties sorted by price ascending
- [ ] Select "Price: High → Low"
- [ ] Verify properties sorted by price descending
- [ ] Select "Newest First"
- [ ] Verify properties sorted by date

### 2.9 Map Toggle
- [ ] Click "Map" button
- [ ] Verify map is hidden
- [ ] Click "Map" button again
- [ ] Verify map is shown

### 2.10 Clear Filters
- [ ] Apply multiple filters
- [ ] Click "Clear Filters" button
- [ ] Verify all filters reset
- [ ] Verify all properties shown

### 2.11 Pagination
- [ ] Scroll to bottom
- [ ] Click "Next" button
- [ ] Verify page 2 properties shown
- [ ] Verify URL updated with `?page=2`
- [ ] Click "Prev" button
- [ ] Verify page 1 properties shown

### 2.12 Empty Results
- [ ] Apply filters that return no results
- [ ] Verify "No properties found" message
- [ ] Verify "Clear Filters" button shown

---

## 3. Map Integration Tests

### 3.1 Map Display
- [ ] Navigate to `/search`
- [ ] Verify Google Map loads
- [ ] Verify property markers displayed

### 3.2 Marker Click
- [ ] Click on a property marker
- [ ] Verify InfoWindow popup appears
- [ ] Verify property summary shown (title, price, image)
- [ ] Click "View Details" in InfoWindow
- [ ] Verify opens property detail page in new tab

### 3.3 Map Bounds Filtering
- [ ] Pan the map to a different area
- [ ] Wait for map idle event
- [ ] Verify properties update based on visible bounds
- [ ] Verify URL updated with `?bounds=...`

### 3.4 Map Zoom
- [ ] Zoom in on map
- [ ] Verify markers update
- [ ] Zoom out on map
- [ ] Verify markers update

---

## 4. Property Detail Tests

### 4.1 View Property Detail
- [ ] Click on a property card
- [ ] Verify redirect to `/properties/:id`
- [ ] Verify property details displayed:
  - [ ] Image gallery (Swiper)
  - [ ] Title
  - [ ] Description
  - [ ] Price
  - [ ] Status badge (For Sale / For Rent)
  - [ ] Type badge
  - [ ] Amenities (beds, baths, area)
  - [ ] Location (address, city)
  - [ ] Map with marker
  - [ ] Owner information (name, phone, avatar)

### 4.2 Image Gallery
- [ ] Click on property image
- [ ] Verify Swiper gallery opens
- [ ] Swipe left/right
- [ ] Verify navigation works
- [ ] Click pagination dots
- [ ] Verify image changes

### 4.3 Send Inquiry (Authenticated)
- [ ] Login as buyer
- [ ] Navigate to property detail
- [ ] Verify inquiry form displayed
- [ ] Enter message
- [ ] Submit form
- [ ] Verify success toast notification

### 4.4 Send Inquiry (Unauthenticated)
- [ ] Logout
- [ ] Navigate to property detail
- [ ] Verify inquiry form NOT displayed
- [ ] Verify "Login to inquire" message shown

### 4.5 Invalid Property ID
- [ ] Navigate to `/properties/invalid-id`
- [ ] Verify 404 error page or error message

---

## 5. User Dashboard Tests

### 5.1 Dashboard Overview
- [ ] Login as owner/agent
- [ ] Navigate to `/dashboard`
- [ ] Verify statistics cards:
  - [ ] My Listings count
  - [ ] Pending Approval count
  - [ ] Total Views count
- [ ] Verify recent listings displayed

### 5.2 My Listings Tab
- [ ] Click "My Listings" tab
- [ ] Verify list of user's properties
- [ ] Verify each property shows:
  - [ ] Image
  - [ ] Title
  - [ ] Location
  - [ ] Price
  - [ ] Approval status badge
  - [ ] View, Edit, Delete buttons

### 5.3 View Property from Dashboard
- [ ] Click "View" icon on a listing
- [ ] Verify opens property detail page

### 5.4 Edit Property from Dashboard
- [ ] Click "Edit" icon on a listing
- [ ] Verify redirect to `/dashboard/listings/edit/:id`
- [ ] Verify form pre-filled with property data

### 5.5 Delete Property from Dashboard
- [ ] Click "Delete" icon on a listing
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel"
- [ ] Verify property NOT deleted
- [ ] Click "Delete" icon again
- [ ] Click "OK" in confirmation dialog
- [ ] Verify success toast notification
- [ ] Verify property removed from list

### 5.6 Profile Tab
- [ ] Click "Profile" tab
- [ ] Verify user information displayed
- [ ] Update name
- [ ] Update phone
- [ ] Click "Save Changes"
- [ ] Verify success toast notification
- [ ] Verify profile updated

### 5.7 Empty Dashboard
- [ ] Login as new owner/agent with no listings
- [ ] Navigate to `/dashboard`
- [ ] Verify "No listings yet" message
- [ ] Verify "Create Listing" button shown

---

## 6. Property Management Tests

### 6.1 Create Property - Step 1 (Basic Info)
- [ ] Login as owner/agent
- [ ] Navigate to `/dashboard/listings/new`
- [ ] Verify multi-step wizard displayed
- [ ] Fill in title (min 5 characters)
- [ ] Fill in description (min 20 characters)
- [ ] Select status (Sale / Rent)
- [ ] Select type (Residential / Commercial / Land)
- [ ] Select category (optional)
- [ ] Click "Continue"
- [ ] Verify validation errors if fields invalid
- [ ] Verify progress to step 2 if valid

### 6.2 Create Property - Step 2 (Details)
- [ ] Fill in price (positive number)
- [ ] Fill in rooms (optional)
- [ ] Fill in bathrooms (optional)
- [ ] Fill in area (optional)
- [ ] Add amenities (e.g., "Swimming Pool", "Parking")
- [ ] Upload images (multiple)
- [ ] Verify image previews shown
- [ ] Click "Continue"
- [ ] Verify validation errors if fields invalid
- [ ] Verify progress to step 3 if valid

### 6.3 Create Property - Step 3 (Location)
- [ ] Select city from dropdown
- [ ] Fill in district (optional)
- [ ] Fill in street address
- [ ] Click "Continue"
- [ ] Verify validation errors if fields invalid
- [ ] Verify progress to step 4 if valid

### 6.4 Create Property - Step 4 (Review & Submit)
- [ ] Verify property summary displayed
- [ ] Verify all entered data shown
- [ ] Click "Submit Listing"
- [ ] Verify success toast notification
- [ ] Verify redirect to `/dashboard`
- [ ] Verify new property in "My Listings" with "Pending" status

### 6.5 Create Property - Navigation
- [ ] Start creating property
- [ ] Click "Previous" button
- [ ] Verify goes back to previous step
- [ ] Verify form data preserved
- [ ] Navigate forward again
- [ ] Verify form data still preserved

### 6.6 Edit Property
- [ ] Navigate to `/dashboard`
- [ ] Click "Edit" on a listing
- [ ] Verify form pre-filled with existing data
- [ ] Verify existing images displayed
- [ ] Update title
- [ ] Update price
- [ ] Remove an existing image
- [ ] Upload a new image
- [ ] Navigate through steps
- [ ] Click "Save Changes"
- [ ] Verify success toast notification
- [ ] Verify redirect to `/dashboard`
- [ ] Verify property updated

---

## 7. Admin Dashboard Tests

### 7.1 Admin Dashboard Overview
- [ ] Login as admin
- [ ] Navigate to `/admin`
- [ ] Verify statistics cards:
  - [ ] Total Users
  - [ ] Properties
  - [ ] Pending Approvals
  - [ ] Inquiries
- [ ] Verify user breakdown by role
- [ ] Verify quick action alert if pending approvals > 0

### 7.2 All Listings Tab
- [ ] Click "All Listings" in sidebar
- [ ] Verify table of all properties
- [ ] Verify each row shows:
  - [ ] Property image and title
  - [ ] Owner name
  - [ ] Price
  - [ ] Approval status
  - [ ] Featured status
  - [ ] Actions (View, Toggle Featured, Delete)

### 7.3 Toggle Featured
- [ ] Click "Star" icon on a listing
- [ ] Verify success toast notification
- [ ] Verify "Featured" badge appears/disappears

### 7.4 Delete Listing (Admin)
- [ ] Click "Delete" icon on a listing
- [ ] Verify confirmation dialog
- [ ] Click "OK"
- [ ] Verify success toast notification
- [ ] Verify listing removed from table

---

## 8. Pending Approvals Tests

### 8.1 View Pending Approvals
- [ ] Login as admin
- [ ] Navigate to `/admin/pending`
- [ ] Verify list of pending properties
- [ ] Verify each property shows:
  - [ ] Image
  - [ ] Title, location, price
  - [ ] Description
  - [ ] Amenities
  - [ ] Submitter name and date
  - [ ] View, Approve, Reject buttons

### 8.2 Approve Property
- [ ] Click "Approve" button
- [ ] Verify success toast notification
- [ ] Verify property removed from pending list
- [ ] Navigate to `/search`
- [ ] Verify property now appears in search results

### 8.3 Reject Property
- [ ] Navigate to `/admin/pending`
- [ ] Click "Reject" button
- [ ] Verify confirmation dialog
- [ ] Click "OK"
- [ ] Verify success toast notification
- [ ] Verify property removed from pending list
- [ ] Verify property deleted from database

### 8.4 View Property from Pending
- [ ] Click "View Details" button
- [ ] Verify opens property detail page in new tab

### 8.5 Empty Pending Approvals
- [ ] Approve/reject all pending properties
- [ ] Navigate to `/admin/pending`
- [ ] Verify "All caught up!" message

---

## 9. User Management Tests

### 9.1 View All Users
- [ ] Login as admin
- [ ] Navigate to `/admin/users`
- [ ] Verify table of all users
- [ ] Verify each row shows:
  - [ ] User avatar (initial)
  - [ ] Name
  - [ ] Email
  - [ ] Phone
  - [ ] Role dropdown
  - [ ] Joined date
  - [ ] Delete button

### 9.2 Search Users
- [ ] Enter name in search box
- [ ] Verify filtered results
- [ ] Enter email in search box
- [ ] Verify filtered results
- [ ] Clear search
- [ ] Verify all users shown

### 9.3 Filter Users by Role
- [ ] Click "buyer" filter button
- [ ] Verify only buyers shown
- [ ] Click "owner" filter button
- [ ] Verify only owners shown
- [ ] Click "agent" filter button
- [ ] Verify only agents shown
- [ ] Click "admin" filter button
- [ ] Verify only admins shown
- [ ] Click "All" filter button
- [ ] Verify all users shown

### 9.4 Change User Role
- [ ] Select a user
- [ ] Change role in dropdown (e.g., buyer → owner)
- [ ] Verify confirmation dialog
- [ ] Click "OK"
- [ ] Verify success toast notification
- [ ] Verify role updated in table

### 9.5 Delete User
- [ ] Click "Delete" button on a user
- [ ] Verify confirmation dialog
- [ ] Click "OK"
- [ ] Verify success toast notification
- [ ] Verify user removed from table

### 9.6 Empty Search Results
- [ ] Search for non-existent user
- [ ] Verify "No users found" message

---

## 10. Responsive Design Tests

### 10.1 Mobile (320px - 640px)
- [ ] Resize browser to mobile width
- [ ] Verify hamburger menu appears
- [ ] Click hamburger menu
- [ ] Verify mobile menu opens
- [ ] Verify all navigation links visible
- [ ] Navigate to `/search`
- [ ] Verify filters collapsible
- [ ] Verify property grid single column
- [ ] Verify map toggle works
- [ ] Navigate to `/dashboard`
- [ ] Verify tabs instead of sidebar
- [ ] Navigate to `/admin/users`
- [ ] Verify card view instead of table

### 10.2 Tablet (640px - 1024px)
- [ ] Resize browser to tablet width
- [ ] Verify navigation bar visible
- [ ] Navigate to `/search`
- [ ] Verify property grid 2 columns
- [ ] Verify filters sidebar visible
- [ ] Navigate to `/dashboard`
- [ ] Verify sidebar visible

### 10.3 Desktop (1024px+)
- [ ] Resize browser to desktop width
- [ ] Verify full navigation bar
- [ ] Navigate to `/search`
- [ ] Verify property grid 3 columns
- [ ] Verify filters sidebar visible
- [ ] Navigate to `/admin/users`
- [ ] Verify table view

---

## 11. Error Handling Tests

### 11.1 Network Error
- [ ] Stop backend server
- [ ] Try to login
- [ ] Verify "Network error" toast notification
- [ ] Start backend server

### 11.2 401 Unauthorized
- [ ] Login
- [ ] Manually delete JWT token from localStorage
- [ ] Try to access `/dashboard`
- [ ] Verify redirect to `/login`
- [ ] Verify "Session expired" toast notification

### 11.3 403 Forbidden
- [ ] Login as non-admin
- [ ] Try to access `/admin`
- [ ] Verify redirect to `/unauthorized`
- [ ] Verify "Access Denied" page

### 11.4 404 Not Found
- [ ] Navigate to `/invalid-route`
- [ ] Verify 404 page displayed
- [ ] Verify "Go Home" button works

### 11.5 Validation Errors
- [ ] Try to register with invalid email
- [ ] Verify field-specific error message
- [ ] Try to create property with empty title
- [ ] Verify field-specific error message

---

## 12. Performance Tests

### 12.1 React Query Caching
- [ ] Navigate to `/search`
- [ ] Wait for properties to load
- [ ] Navigate to `/`
- [ ] Navigate back to `/search`
- [ ] Verify properties load instantly (from cache)

### 12.2 Image Loading
- [ ] Navigate to `/search`
- [ ] Scroll down
- [ ] Verify images load lazily (not all at once)

### 12.3 Debounced Search
- [ ] Navigate to `/search`
- [ ] Type quickly in search box
- [ ] Verify API call only made after 300ms pause

---

## 13. End-to-End User Flows

### 13.1 Complete Buyer Flow
1. [ ] Register as buyer
2. [ ] Login
3. [ ] Search for properties
4. [ ] Apply filters (city, price range, rooms)
5. [ ] View property on map
6. [ ] Click marker to view property detail
7. [ ] Send inquiry to owner
8. [ ] Update profile
9. [ ] Logout

### 13.2 Complete Owner Flow
1. [ ] Register as owner
2. [ ] Login
3. [ ] Navigate to dashboard
4. [ ] Create new property listing
5. [ ] Upload images
6. [ ] Submit listing
7. [ ] Verify "Pending Approval" status
8. [ ] Edit listing
9. [ ] View listing on search page (after admin approval)
10. [ ] Delete listing
11. [ ] Logout

### 13.3 Complete Admin Flow
1. [ ] Login as admin
2. [ ] View dashboard statistics
3. [ ] Navigate to pending approvals
4. [ ] Review pending listing
5. [ ] Approve listing
6. [ ] Navigate to user management
7. [ ] Search for user
8. [ ] Change user role
9. [ ] Navigate to all listings
10. [ ] Toggle featured status
11. [ ] Logout

---

## Testing Summary

### Critical Tests (Must Pass)
- [ ] User registration and login
- [ ] Protected routes redirect to login
- [ ] Admin routes protected by role
- [ ] Property search with filters
- [ ] Create property listing
- [ ] Edit property listing
- [ ] Delete property listing
- [ ] Admin approve/reject listings
- [ ] Admin change user roles
- [ ] Responsive design on mobile/tablet/desktop

### Important Tests (Should Pass)
- [ ] Map integration with markers
- [ ] Image upload and display
- [ ] Error handling and notifications
- [ ] Pagination
- [ ] Sorting
- [ ] Empty states
- [ ] Loading states

### Nice-to-Have Tests (Optional)
- [ ] Performance (caching, lazy loading)
- [ ] Accessibility (keyboard navigation, ARIA labels)
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

---

## Test Results

**Date**: _______________
**Tester**: _______________
**Browser**: _______________
**Screen Size**: _______________

**Critical Tests Passed**: _____ / _____
**Important Tests Passed**: _____ / _____
**Nice-to-Have Tests Passed**: _____ / _____

**Overall Status**: ⬜ PASS | ⬜ FAIL

**Notes**:
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

**Generated**: 2025-01-XX
**Project**: Aqar Real Estate Platform
**Version**: 1.0.0
