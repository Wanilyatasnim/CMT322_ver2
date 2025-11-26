# Cloudinary Setup Guide

## Why Cloudinary?

Images uploaded to Railway are stored in the filesystem, which is **ephemeral** (temporary). This means:
- ❌ Images are **lost** when Railway redeploys or restarts
- ❌ Images are **lost** when the container restarts
- ✅ Cloudinary provides **permanent cloud storage** for images

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a **free account** (no credit card required)
3. Verify your email address

## Step 2: Get Your API Credentials

1. After logging in, you'll see your **Dashboard**
2. Look for these values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 3: Add Environment Variables to Railway

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the **Variables** tab
4. Add these three environment variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

5. Click **Save** or **Deploy** to apply changes

## Step 4: Redeploy

After adding the environment variables, Railway will automatically redeploy. Your images will now be stored permanently in Cloudinary!

## Step 5: Verify It's Working

1. Upload a new listing with images on your website
2. Check the Railway logs - you should see: `[Multer] Using Cloudinary for image storage`
3. Images should now persist even after redeployments

## Free Tier Limits

Cloudinary's free tier includes:
- ✅ 25 GB storage
- ✅ 25 GB monthly bandwidth
- ✅ Unlimited transformations
- ✅ Perfect for MVP/testing

## Troubleshooting

### Images still disappearing?
- Check Railway logs for Cloudinary errors
- Verify all 3 environment variables are set correctly
- Make sure there are no extra spaces in the variable values

### "Cloudinary setup failed" in logs?
- Double-check your API credentials
- Ensure environment variables are set in Railway (not just locally)
- Wait for Railway to redeploy after adding variables

### Want to use local storage for development?
- Simply don't set the Cloudinary environment variables
- The system will automatically fall back to local `uploads/` directory
- Note: This only works locally, not on Railway

## Migration Note

**Old images** (uploaded before Cloudinary setup) will still use the `/uploads/` path and may be broken if they were on Railway. **New images** uploaded after setup will use Cloudinary URLs and persist permanently.







