# Getting Started with 2street

## Quick Start Guide

### Step 1: Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 2: Configure Environment

Create a `.env` file in the root directory with the following content:

```
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_this
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` to a random string for security!

### Step 3: Start the Application

**Option A: Run both frontend and backend together (Recommended)**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Step 5: Create Your First Account

1. Click "Register" on the homepage
2. Use a USM student email (must end with @student.usm.my)
3. Fill in your details and create your account
4. Start browsing or create your first listing!

## Default Admin Account

For testing and administration:
- **Email**: admin@2street.usm.my
- **Password**: admin123

## Test the Application

1. **Browse as Guest**: View all listings without logging in
2. **Register**: Create a new student account
3. **Create Listing**: List an item for sale with photos
4. **Search & Filter**: Try searching for items by keyword, category, and price
5. **View Details**: Click on any listing to see full details
6. **Contact Seller**: Use the WhatsApp contact button (opens WhatsApp)
7. **Admin Dashboard**: Login as admin to manage the platform

## Troubleshooting

### Data File Issues
If you ever want to reset the seeded data:
1. Delete `server/data/data.json`
2. Restart the server - it will auto-create the file with default accounts/listings

### Port Already in Use
If port 5000 or 3000 is already in use:
1. Update the PORT in `.env` file for backend
2. Update the proxy in `client/package.json` for frontend

### Image Upload Issues
Make sure the `uploads/` directory exists:
```bash
mkdir uploads
```

### Node Version Issues
Make sure you're using Node.js v14 or higher:
```bash
node --version
```

## Next Steps

- Read the full README.md for detailed documentation
- Explore the API endpoints
- Customize the categories and features
- Deploy to production

## Need Help?

Check the main README.md for:
- Full feature documentation
- API endpoint details
- Project structure
- Deployment guide

Happy trading on 2street! 🛍️

