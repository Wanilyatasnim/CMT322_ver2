# Troubleshooting Guide - 2Street.my

## Issue: Database Empty on Railway

### Symptoms:
- No listings showing
- Empty admin dashboard
- Website loads but no data

### Root Cause:
Railway uses ephemeral storage - database resets on each deployment.

### Solution Applied:
Auto-seeding script that runs on server startup if database is empty.

---

## How to Verify It's Working

### Check Railway Logs:

1. Go to https://railway.app/
2. Open your project
3. Click on the latest deployment
4. Click **"View Logs"** or **"Deployments"** → **"View Logs"**

### You should see:
```
Connected to SQLite database
Database initialized successfully
Admin user created: admin@2street.usm.my / admin123
Database has no listings. Seeding sample data...
Sample users created
Sample listings created
Database seeded successfully!
Server running on port 5000
```

---

## Force Fresh Deploy

If data still missing:

### Option 1: Manual Redeploy
1. Railway dashboard → Your project
2. Click **"Settings"**
3. Scroll down → **"Danger Zone"**
4. Click **"Redeploy"**

### Option 2: Push Empty Commit
```bash
git commit --allow-empty -m "Trigger fresh deploy"
git push
```

### Option 3: Railway CLI
```bash
railway redeploy
```

---

## Common Issues

### Issue: "Database has no listings. Seeding..." doesn't appear
**Solution:** Check logs for errors during seeding.

### Issue: Users created but no listings
**Check:** Look for error like "INSERT INTO listings failed"
**Fix:** Database schema might be missing. Check if tables created properly.

### Issue: Duplicate admin users
**Cause:** Admin created in both db.init() and seeding
**Status:** Fixed - seeding checks for listings, not admin

---

## Testing Locally

To test seeding locally:

```bash
# Delete local database
rm 2street.db

# Start server
npm run server

# Check console - should see seeding messages
# Check homepage - should see 7 listings
```

---

## Production Database Solutions

For real production (data persistence):

### Option 1: Railway PostgreSQL
- Add PostgreSQL service in Railway
- Change database.js to use PostgreSQL
- Data persists forever

### Option 2: Railway Volumes
- Add volume service
- Store SQLite on volume
- Data persists across deploys

### Option 3: External Database
- MongoDB Atlas
- Supabase
- PlanetScale

---

## Quick Checklist

✅ **Database initializes** (check logs)  
✅ **Admin user created** (should login)  
✅ **Sample users created** (3 users)  
✅ **Sample listings created** (7 listings)  
✅ **Homepage shows listings**  
✅ **Admin dashboard shows stats**  

If any missing → Check logs for errors!

---

## Need Help?

Check Railway logs first! They tell you exactly what's happening.

```bash
# Command to view recent logs
railway logs --tail
```

Or use Railway web interface → Deployments → View Logs

