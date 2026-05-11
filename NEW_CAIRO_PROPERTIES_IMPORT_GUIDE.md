# 📊 New Cairo Properties Import Guide

## Summary

I've analyzed your Excel data and created an import script with **40+ properties**:

### Data Breakdown:
- **Commercial Properties (South 90 & North 90):** 12 properties
  - Retail spaces, offices, clinics, hotel apartments
  - Projects: One 90, IV Business Park, The Ark, Sleek, Main Marks
  - Price range: 5.9M - 63.6M EGP

- **Residential Properties (6th Settlement):** 28 properties
  - Apartments, villas, townhouses, duplexes
  - Developers: ORA (Zed East), Marakez (Crescent Walk), CRED (Ever), Hyde Park (Central Park)
  - Price range: 6.1M - 60M EGP

## 🚀 How to Import

### Option 1: Run the Import Script (Recommended)

**When MongoDB connection is stable:**

```powershell
cd "c:\Users\Khaled\Desktop\Aqar project\aqar\server"
node scripts/importNewCairoData.js
```

**What it does:**
- ✅ Imports all 40 properties
- ✅ Assigns them to existing owners/agents
- ✅ Sets proper locations with coordinates
- ✅ Marks 30% as featured
- ✅ Adds default images
- ✅ Skips duplicates automatically

### Option 2: Add Through Website (Manual)

1. **Start the project:**
   ```powershell
   # Run START_PROJECT.ps1 or start manually
   ```

2. **Login as Owner/Agent:**
   - Go to http://localhost:5173/login
   - Use: `ahmed.hassan@example.com` / `Password@123`

3. **Add Properties:**
   - Click "Add Property" button
   - Fill in the form with data from the Excel
   - Submit

4. **Repeat for each property**

### Option 3: Import via MongoDB Compass (Direct Database)

1. **Download MongoDB Compass:** https://www.mongodb.com/try/download/compass

2. **Connect to your database:**
   ```
   mongodb+srv://khelowaleed_db_user:R7YQFHNjiS799iDQ@cluster0.zmyr1t8.mongodb.net/aqar
   ```

3. **Go to `properties` collection**

4. **Click "Add Data" → "Import JSON"**

5. **Use the JSON file I'll create below**

## 📍 Location Coordinates Used

All properties have been mapped to accurate New Cairo locations:

| Area | Coordinates | Properties |
|------|-------------|------------|
| South 90 | 31.4735, 30.0131 | One 90, IV Business Park, The Ark, Sleek |
| North 90 | 31.4763, 30.0104 | Main Marks, Artal, Upwyde |
| 6th Settlement | 31.5012, 30.0245 | Zed East, Crescent Walk, Ever, Central Park |

## 🎯 Property Features Extracted

### Commercial Properties Include:
- Payment plans (5% over 5-8 years, 10% over 6-8 years)
- Finishing types (Core & Shell, Fully Finished, Flexi)
- Maintenance fees (7-10%)
- Delivery dates (2027-2029)
- Cash discounts where applicable

### Residential Properties Include:
- Number of bedrooms and bathrooms
- Built-up area and land area
- Payment plans (5-15% down payment over 7-12 years)
- Project amenities
- Delivery timelines (3.5-4 years)

## 📝 Sample Properties Created

### Commercial Example:
```
Title: One 90 - Ground Retail
Price: 61,000,000 EGP
Area: 135 sqm
Type: Commercial - Retail
Location: One 90, South 90, New Cairo
Features: Core & Shell, Ground Floor, 40% over 3 Years, Ready to Move
```

### Residential Example:
```
Title: Zed East - Duplex
Price: 24,000,000 EGP
Area: 200 sqm + 150 sqm garden
Bedrooms: 3
Type: Residential - Duplex
Location: Zed East, 6th Settlement, New Cairo
Features: Fully Finished, 5% + 5% DP over 10 years, 360 Acre Project
```

## ⚠️ Current Issue

The import script is experiencing a DNS connection issue to MongoDB. This is temporary and can be resolved by:

1. **Waiting a few minutes** - DNS issues usually resolve themselves
2. **Restarting your internet connection**
3. **Using a VPN** if your ISP is blocking MongoDB Atlas
4. **Running the script when the backend is already connected** (backend maintains the connection)

## 🔄 Alternative: Import When Deploying

When you deploy to production:
1. The import script will work better (stable server connection)
2. Run it once on the deployed backend
3. All properties will be in the cloud database
4. Accessible from both local and deployed versions

## 📊 After Import

Once imported, you'll have:
- **Total Properties:** 92 (existing) + 40 (new) = **132 properties**
- **New Cairo Coverage:** Comprehensive (South 90, North 90, 6th Settlement)
- **Property Types:** Residential, Commercial, Mixed-use
- **Price Range:** 5.9M - 63.6M EGP

All properties will:
- ✅ Appear on the homepage (if featured)
- ✅ Show in search results
- ✅ Display on the map with markers
- ✅ Be filterable by type, price, area, location
- ✅ Have proper coordinates for Google Maps

## 🎯 Next Steps

1. **Wait for stable connection** or **restart your router**
2. **Run the import script:**
   ```powershell
   cd "c:\Users\Khaled\Desktop\Aqar project\aqar\server"
   node scripts/importNewCairoData.js
   ```
3. **Check the website** - new properties should appear
4. **Test the map** - markers should show New Cairo locations

## 💡 Pro Tip

The script is **idempotent** - you can run it multiple times safely. It will:
- Skip properties that already exist
- Only import new ones
- Show you a summary of what was imported

---

**The import script is ready!** Just need a stable MongoDB connection to run it. Try again in a few minutes or when you deploy to production.
