# 2street Setup Instructions

## Complete Setup Guide

Follow these steps to get your 2street marketplace up and running.

### Prerequisites

- Node.js v14 or higher installed
- npm (comes with Node.js)
- Git (optional, for version control)

### Step 1: Install Dependencies

Open terminal in the project root directory and run:

```bash
# Install root dependencies (backend)
npm install

# Install client dependencies (frontend)
cd client
npm install
cd ..
```

This will install all required packages for both frontend and backend.

### Step 2: Create Environment File

Create a `.env` file in the root directory (same level as `package.json`):

**Windows (PowerShell):**
```powershell
New-Item -Path ".env" -ItemType File
Add-Content -Path ".env" -Value "PORT=5000"
Add-Content -Path ".env" -Value "JWT_SECRET=2street_secret_key_please_change_in_production"
Add-Content -Path ".env" -Value "NODE_ENV=development"
```

**Mac/Linux:**
```bash
cat > .env << EOF
PORT=5000
JWT_SECRET=2street_secret_key_please_change_in_production
NODE_ENV=development
EOF
```

**Or manually create the file:**
1. Create a new file named `.env`
2. Add these lines:
```
PORT=5000
JWT_SECRET=2street_secret_key_please_change_in_production
NODE_ENV=development
```

### Step 3: Verify Directory Structure

Make sure you have these directories:
- `client/` - React frontend
- `server/` - Express backend
- `uploads/` - For image storage (should already exist)

If `uploads/` doesn't exist, create it:
```bash
mkdir uploads
```

### Step 4: Start the Application

You have two options:

**Option A: Run Both Together (Recommended)**
```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) simultaneously.

**Option B: Run Separately**

Terminal 1 - Start backend:
```bash
npm run server
```

Terminal 2 - Start frontend:
```bash
cd client
npm start
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

Open your browser and go to http://localhost:3000

### Step 6: Create Your First Account

1. Click **"Register"** button on the homepage
2. Fill in the form with:
   - **Name**: Your full name
   - **Email**: Must end with `@student.usm.my`
   - **Password**: Choose a secure password
   - **Phone** (optional): Your contact number
   - **Matric Number** (optional): Your student ID
3. Click **"Register"**
4. You'll be automatically logged in and redirected to the homepage

### Step 7: Test the Application

#### As a Regular User:
1. ✅ Browse listings without logging in
2. ✅ Search for items
3. ✅ Filter by category and price
4. ✅ Create your own listing
5. ✅ Edit/delete your listings
6. ✅ Mark items as sold
7. ✅ View profile

#### As Admin:
1. Login with:
   - Email: `admin@2street.usm.my`
   - Password: `admin123`
2. Access admin dashboard at http://localhost:3000/admin
3. View statistics
4. Manage users (ban/unban)
5. Manage listings (delete inappropriate content)

### Step 8: Create Your First Listing

1. Click **"Sell Item"** in the navbar
2. Fill in the form:
   - **Title**: e.g., "iPhone 13 Pro Max 256GB"
   - **Description**: Detailed description of the item
   - **Price**: Enter price in RM
   - **Category**: Select from dropdown
   - **Condition**: Select condition
   - **Location**: Your hostel/campus location
   - **Images**: Upload 1-3 photos
3. Click **"Create Listing"**
4. Your listing will appear on the homepage

### Troubleshooting

#### Data File Issues
If you want to reset all data or encounter corrupted records:
1. Delete the `server/data/data.json` file
2. Restart the server
3. The file will be recreated automatically with default accounts/listings

#### Port Already in Use
If port 5000 or 3000 is already in use:

**For backend (port 5000):**
1. Edit `.env` file
2. Change `PORT=5000` to another port (e.g., `PORT=5001`)
3. Restart server

**For frontend (port 3000):**
- When running `npm start`, it will prompt you to use another port
- Or edit `client/package.json` to change the port

#### Images Not Showing
- Verify `uploads/` directory exists
- Check that backend is running on the correct port
- Ensure images are uploaded correctly

#### Cannot Register with Non-USM Email
This is intentional. Only `@student.usm.my` emails are accepted. For testing:
- Use format: `test123@student.usm.my`
- Or login with admin account

#### JWT Token Errors
- Verify `.env` file exists and has `JWT_SECRET` set
- Restart the server after creating/modifying `.env`

### Next Steps

After successful setup:

1. **Customize Categories**: Edit categories in:
   - `client/src/pages/Homepage.js` (CATEGORIES array)
   - `client/src/pages/CreateListing.js` (CATEGORIES array)

2. **Change Branding**: Update:
   - App name in `client/src/App.js`
   - Navbar title in `client/src/components/Navbar.js`

3. **Add More Features**: See README.md for future enhancements

4. **Deploy**: When ready for production:
   - Build frontend: `cd client && npm run build`
   - Deploy backend to a server (e.g., Railway)
   - Set proper environment variables (including Cloudinary if desired)
   - Add a persistent data solution (Cloudinary for images + external DB/volume) if you need data to survive redeploys

### Support Files

- **README.md**: Complete documentation
- **GETTING_STARTED.md**: Quick start guide
- **PROJECT_STRUCTURE.md**: Detailed file structure
- **env.template**: Template for environment variables

### Need Help?

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure all environment variables are set
4. Check that ports are not in use by other applications
5. Review the troubleshooting section above

---

**Congratulations!** You now have a fully functional marketplace application! 🎉

Start selling and buying on 2street!

