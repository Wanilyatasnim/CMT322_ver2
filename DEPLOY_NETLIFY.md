# Deploy 2Street.my to Netlify + Railway

## Current Setup
**Frontend:** React (Netlify)  
**Backend:** Node.js + Express (Railway)

---

## Step 1: Deploy Backend to Railway

Since we already set up Railway, use the same project:

1. Go to https://railway.app/ → Your project
2. Get your backend URL (e.g., `https://cmt322-website-production.up.railway.app`)
3. ✅ Backend is ready!

---

## Step 2: Deploy Frontend to Netlify

### Option A: Automatic (Recommended)

1. Go to https://app.netlify.com/
2. Click **"Sign up"** → **"GitHub"**
3. Click **"Add new site"** → **"Import an existing project"**
4. Select: `Wanilyatasnim/cmt322_website`
5. Netlify auto-detects settings! ✅
6. Click **"Deploy site"**

**Done!** Your site is live!

---

### Option B: Manual Deploy

1. Build frontend locally:
```bash
cd client
npm install
npm run build
```

2. Go to https://app.netlify.com/
3. Drag & drop the `client/build` folder
4. Done!

---

## Step 3: Connect Frontend to Backend

After Netlify deploys:

1. Go to your Netlify site dashboard
2. **Site settings** → **Build & deploy** → **Environment variables**
3. Add:
   - `REACT_APP_API_URL` = `https://your-railway-backend.railway.app`
4. Trigger new deploy

OR edit `client/.env.production`:
```
REACT_APP_API_URL=https://your-railway-backend.railway.app
```

Rebuild and redeploy.

---

## Your URLs:

- **Frontend:** `https://your-site.netlify.app`
- **Backend:** `https://your-backend.railway.app`

---

## Update netlify.toml

Edit `netlify.toml` and replace:
```
to = "https://your-backend-url.railway.app/api/:splat"
```

With your actual Railway backend URL.

---

## Advantages:

✅ Netlify: fast frontend CDN  
✅ Railway: full backend support  
✅ Auto-deploys from GitHub  
✅ Free tier for both  

---

## Note:

Images uploaded on Netlify won't persist - use Cloudinary or AWS S3 for production!

