# Cloudinary Image Troubleshooting Guide

## Problem: Images Disappeared After Railway Redeploy

### Why This Happens

1. **Database Reset**: Railway uses ephemeral (temporary) storage. When you redeploy:
   - The SQLite database (`2street.db`) is **reset**
   - All image URLs stored in the database are **lost**
   - Even if images are in Cloudinary, the database doesn't have the URLs anymore

2. **Cloudinary Not Configured**: If Cloudinary environment variables are not set in Railway:
   - Images are stored locally in the container
   - Local files are **deleted** when Railway redeploys
   - Images are permanently lost

---

## Solution: Verify Cloudinary Setup

### Step 1: Check Railway Environment Variables

1. Go to your Railway project: https://railway.app/
2. Click on your service
3. Go to the **"Variables"** tab
4. Verify these 3 variables are set:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### Step 2: Check Railway Logs

1. In Railway dashboard, click **"Deployments"** tab
2. Click on the latest deployment
3. Click **"View Logs"**
4. Look for these messages:

**✅ If Cloudinary is working:**
```
[Multer] ✅ Using Cloudinary for image storage
[Multer] Cloudinary folder: 2street-listings
```

**⚠️ If Cloudinary is NOT working:**
```
[Multer] ⚠️ Using local storage (uploads/ directory)
[Multer] ⚠️ WARNING: Local storage is ephemeral on Railway...
```

### Step 3: Test Image Upload

1. Go to your website
2. Create a new listing with an image
3. Check Railway logs - you should see:
   ```
   [Create Listing] Images stored: ✅ Cloudinary
   [Create Listing] Cloudinary URLs: https://res.cloudinary.com/...
   ```

4. Check the image URL in your browser:
   - Right-click on the uploaded image
   - Select "Copy image address"
   - The URL should start with `https://res.cloudinary.com/`

---

## How to Fix Missing Images

### Option 1: Re-upload Images (Recommended)

Since the database was reset, you need to:
1. **Re-upload** all listings with images
2. Make sure Cloudinary is configured first (see Step 1 above)
3. New images will be saved permanently in Cloudinary

### Option 2: Verify Cloudinary Has Your Images

1. Go to https://cloudinary.com/console
2. Log in to your account
3. Go to **"Media Library"**
4. Check the `2street-listings` folder
5. Your images should be there!

**Note**: Even if images are in Cloudinary, you still need to re-upload listings because the database URLs are lost.

---

## Prevention: Ensure Cloudinary is Always Configured

### For Future Deployments:

1. **Always set Cloudinary variables in Railway** before deploying
2. **Check logs** after each deployment to verify Cloudinary is active
3. **Test upload** a new listing to confirm images go to Cloudinary

---

## Quick Diagnostic Commands

### Check if Cloudinary is configured (in Railway logs):
```bash
# Look for this in logs:
[Multer] ✅ Using Cloudinary for image storage
```

### Check image URLs in database:
- Cloudinary URLs: `https://res.cloudinary.com/...`
- Local URLs: `/uploads/filename.jpg` (will break on Railway)

---

## Summary

**The Problem:**
- Database resets on Railway redeploy → Image URLs are lost
- If Cloudinary not configured → Images stored locally → Lost on redeploy

**The Solution:**
1. ✅ Set Cloudinary environment variables in Railway
2. ✅ Verify in logs that Cloudinary is active
3. ✅ Re-upload listings with images (database was reset)
4. ✅ Future uploads will persist in Cloudinary

**Important:** Even with Cloudinary, if the database resets, you lose the image URLs. The images are still in Cloudinary, but the database doesn't know where they are. You need to re-upload listings to reconnect them.

---

## Need More Help?

1. Check Railway logs for Cloudinary errors
2. Verify Cloudinary credentials are correct
3. Make sure there are no extra spaces in environment variable values
4. Wait for Railway to finish redeploying after adding variables

