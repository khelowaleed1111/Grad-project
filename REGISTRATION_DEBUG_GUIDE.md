# 🔍 Registration Issue Debug Guide

## Current Status
✅ Backend API is working (tested successfully with PowerShell)
✅ MongoDB is connected
✅ Frontend is running

## Common Registration Failure Causes

### 1. **Email Already Exists**
**Symptom:** "Registration failed" message
**Cause:** The email you're trying to register is already in the database
**Solution:** Try a different email address

**Test emails already in database:**
- admin@aqar.com
- ahmed.hassan@example.com
- fatima.ali@example.com
- mohamed.ibrahim@example.com
- testuser123@example.com (just added)

### 2. **Password Requirements Not Met**
**Requirements:**
- Minimum 8 characters
- Must match confirmation password

### 3. **Network/CORS Issues**
**Check:**
- Open browser Developer Tools (F12)
- Go to Console tab
- Try to register again
- Look for red error messages

### 4. **Phone Number Format**
The phone field is optional, but if provided, make sure it's valid.

## How to Debug

### Step 1: Open Browser Console
1. Press **F12** on your keyboard
2. Click the **Console** tab
3. Try to register again
4. Look for any red error messages

### Step 2: Check Network Tab
1. In Developer Tools, click **Network** tab
2. Try to register again
3. Look for a request to `/api/auth/register`
4. Click on it to see:
   - **Status Code** (should be 201 for success, 400 for error)
   - **Response** tab shows the error message

### Step 3: Common Error Messages

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "User already exists with this email" | Email is taken | Use a different email |
| "Password must be at least 8 characters" | Password too short | Use longer password |
| "Passwords don't match" | Confirmation doesn't match | Retype passwords |
| "Network Error" | Backend not running | Check backend is on port 5000 |
| "CORS error" | Cross-origin issue | Backend should allow localhost:5173 |

## Quick Test

Try registering with these details:

```
Name: John Doe
Email: john.doe.test@example.com
Phone: 01234567890 (optional)
Password: TestPassword123
Confirm Password: TestPassword123
Role: Buyer
```

## Manual API Test

You can test the API directly:

1. Open PowerShell
2. Run:
```powershell
$body = @{
    name = "Manual Test User"
    email = "manual.test@example.com"
    password = "Test@123456"
    phone = "01234567890"
    role = "buyer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

If this works but the website doesn't, it's a frontend issue.

## Still Not Working?

### Check Backend Logs
Look at the backend terminal for error messages when you try to register.

### Check Frontend Console
Look for JavaScript errors in the browser console (F12 → Console tab).

### Verify Environment Variables
Make sure `aqar/client/.env` has:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Next Steps

1. Try registering with a **unique email** you haven't used before
2. Check the **browser console** (F12) for specific error messages
3. Share the exact error message you see for more specific help

---

**Most Common Issue:** Email already exists in database. Try a completely new email address!
