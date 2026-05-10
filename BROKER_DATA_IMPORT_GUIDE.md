# 📊 Broker Data Import Guide

## Data Summary

Your Q4 2025 broker data contains **~100 projects** across 4 regions:

### Regions:
1. **East Cairo** - 30 projects
   - 6th Settlement, Mostakbal City, Maadi, Heliopolis, etc.
   
2. **New Capital** - 12 projects
   - R7, R8, R3, Downtown, Heart of New Capital
   
3. **West Cairo** - 24 projects
   - 6th October, Sheikh Zayed, New Zayed
   
4. **North Coast** - 19 projects
   - Ras el Hekma, Sidi Abdelrahman, Marina 5, El Dabaa, Sidi Henish

**Total: ~85 unique projects**

---

## 🚀 Quick Import (Recommended)

I've created an import script at:
```
c:\Users\Khaled\Desktop\Aqar project\aqar\server\scripts\importBrokerData.js
```

### To Import:

**Option 1: Using the running backend**

Since your backend is already running and connected to MongoDB, the easiest way is to restart it with the import:

```bash
# Stop current backend (Ctrl+C in the terminal)
# Then run:
cd "c:\Users\Khaled\Desktop\Aqar project\aqar\server"
node scripts/importBrokerData.js
```

**Option 2: Manual import via MongoDB Compass**

1. Export the data to JSON format
2. Use MongoDB Compass to import directly
3. Connect to your cluster: `cluster0.zmyr1t8.mongodb.net`

---

## 📋 Data Transformation

The script automatically transforms your broker data into Aqar property format:

### Your Data Fields:
- Destination (location)
- Developer
- Project name
- Down Payment
- Years
- Installment Type
- Incentive

### Transformed to Aqar Format:
- **title**: "{Project} by {Developer}"
- **description**: Full project details with payment terms
- **price**: Estimated based on location and payment terms
- **status**: "sale"
- **type**: "residential"
- **location**: With coordinates
- **features**: Payment plan, installment details, incentives
- **images**: Stock images (you can update later)
- **owner**: Randomly assigned to existing owners/agents
- **isApproved**: true (ready to display)
- **isFeatured**: 30% chance

---

## 💰 Price Estimation Logic

Prices are estimated based on location:

| Location | Base Price (EGP) |
|----------|------------------|
| New Capital R3 (CBD) | 5,000,000 |
| Sheikh Zayed | 5,000,000 |
| North Coast (Ras el Hekma) | 6,000,000 |
| Heliopolis | 4,200,000 |
| Maadi | 4,000,000 |
| 6th Settlement | 3,500,000 |
| Mostakbal City | 3,000,000 |
| 6th October | 2,800,000 |

*Prices adjusted based on payment years (5% per year)*

---

## 🗺️ Location Mapping

The script includes coordinates for all locations:

- **East Cairo**: Cairo Governorate
- **New Capital**: New Capital Governorate  
- **West Cairo**: Giza Governorate
- **North Coast**: Matrouh Governorate

---

## ✅ What Happens After Import

1. **~85 new properties** added to database
2. All properties **approved** and ready to display
3. **~30% featured** (randomly selected)
4. Assigned to existing **owners/agents**
5. Visible immediately on website

---

## 🔍 Verify Import

After running the import:

```bash
# Check total properties
curl http://localhost:5000/api/properties

# Check featured properties
curl http://localhost:5000/api/properties/featured

# Check by location
curl "http://localhost:5000/api/properties?city=6th Settlement"
```

Or visit the website:
- Homepage: http://localhost:5174
- Search: http://localhost:5174/search

---

## 📝 Sample Transformed Property

**Original Data:**
```
Destination: 6th Settlement
Developer: Hyde Park
Project: Central
Down Payment: 5% DP + 5% After 3 Months
Years: 10
Installment Type: Equal
Incentive: None
```

**Transformed Property:**
```json
{
  "title": "Central by Hyde Park",
  "description": "Premium residential project in 6th Settlement. Central offers flexible payment plans with 5% DP + 5% After 3 Months down payment over 10 years. Equal installments. Limited time offer for Q4 2025.",
  "price": 5250000,
  "status": "sale",
  "type": "residential",
  "category": "Apartment",
  "rooms": 3,
  "bathrooms": 2,
  "area": 180,
  "location": {
    "address": "Central, 6th Settlement",
    "city": "6th Settlement",
    "governorate": "Cairo",
    "country": "Egypt",
    "coordinates": {
      "type": "Point",
      "coordinates": [31.4913, 30.0131]
    }
  },
  "features": [
    "Flexible Payment Plan",
    "10 Years Installment",
    "Equal Installments",
    "5% DP + 5% After 3 Months",
    "Q4 2025 Offer",
    "Prime Location",
    "Modern Design",
    "Security System"
  ],
  "isApproved": true,
  "isFeatured": false
}
```

---

## 🎯 Next Steps

1. **Run the import script** (see Option 1 above)
2. **Verify on website** - Check search page
3. **Update images** - Replace stock images with actual project images
4. **Add more details** - Edit properties to add specific unit types, amenities
5. **Set accurate prices** - Update prices based on actual market data

---

## 🔧 Troubleshooting

### "No owners or agents found"
Run the seed script first:
```bash
node scripts/seedDatabase.js
```

### "Already exists" messages
The script skips duplicate properties (same title)

### DNS/Connection errors
Make sure backend server is running:
```bash
npm run dev
```

---

## 📊 Expected Results

After import:
- **Before**: 7 properties
- **After**: ~92 properties (7 existing + 85 new)
- **Featured**: ~28 properties
- **Regions**: 4 (East Cairo, New Capital, West Cairo, North Coast)
- **Cities**: 20+ different locations

---

**Ready to import? Run the script and watch your database grow!** 🚀
