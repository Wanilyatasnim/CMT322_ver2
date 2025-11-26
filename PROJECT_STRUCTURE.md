# 2street Project Structure

```
test/
│
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── Navbar.js          # Navigation bar
│   │   │   └── ProductCard.js     # Product card display
│   │   ├── context/
│   │   │   └── AuthContext.js     # Authentication context
│   │   ├── pages/                  # Page components
│   │   │   ├── AdminDashboard.js  # Admin management page
│   │   │   ├── CreateListing.js   # Create new listing
│   │   │   ├── EditListing.js     # Edit existing listing
│   │   │   ├── Homepage.js        # Homepage with listings
│   │   │   ├── Login.js           # Login page
│   │   │   ├── MyListings.js      # User's listings
│   │   │   ├── ProductDetail.js   # Product detail page
│   │   │   ├── Profile.js         # User profile
│   │   │   ├── Register.js        # Registration page
│   │   │   └── SafetyTips.js      # Safety tips page
│   │   ├── services/
│   │   │   └── api.js             # API service layer
│   │   ├── App.js                 # Main App component
│   │   ├── App.css                # App styles
│   │   ├── index.js               # React entry point
│   │   └── index.css              # Global styles
│   └── package.json               # Frontend dependencies
│
├── server/                         # Express Backend
│   ├── config/
│   │   ├── auth.js                # JWT authentication
│   │   └── multer.js              # File upload config
│   ├── data/
│   │   └── dataStore.js           # Lightweight JSON data layer
│   ├── routes/
│   │   ├── admin.js               # Admin routes
│   │   ├── auth.js                # Authentication routes
│   │   ├── listings.js            # Listing routes
│   │   └── users.js               # User routes
│   └── index.js                   # Server entry point
│
├── uploads/                        # Image uploads directory
│   └── .gitkeep                   # Keep directory in git
│
├── .gitignore                     # Git ignore rules
├── .env                           # Environment variables (create manually)
├── package.json                   # Backend dependencies
├── GETTING_STARTED.md             # Quick start guide
├── PROJECT_STRUCTURE.md           # This file
└── README.md                      # Main documentation

```

## Key Files Explanation

### Frontend (client/)

#### Components
- **Navbar.js**: Top navigation bar with authentication state
- **ProductCard.js**: Reusable card for displaying listing previews

#### Pages
- **Homepage.js**: Main landing page with search and filters
- **ProductDetail.js**: Detailed view of a single listing with contact options
- **CreateListing.js**: Form to create new product listings
- **EditListing.js**: Form to edit existing listings
- **MyListings.js**: View all listings created by logged-in user
- **Profile.js**: User profile management
- **Login.js**: User login page
- **Register.js**: User registration page
- **AdminDashboard.js**: Admin panel for managing users and listings
- **SafetyTips.js**: Safety guidelines and reporting information

#### Services
- **api.js**: Centralized API service with axios configuration

#### Context
- **AuthContext.js**: React context for user authentication state

### Backend (server/)

#### Configuration
- **auth.js**: JWT token generation and verification
- **multer.js**: File upload configuration for images

#### Data Store
- **dataStore.js**: Handles reading/writing the local JSON file, seeds default admin & sample data, and exposes helpers for users/listings/reports.

#### Routes
- **auth.js**: POST /register, POST /login, GET /me
- **listings.js**: CRUD operations for listings
- **users.js**: User profile and listings management
- **admin.js**: Admin-only routes for moderation

#### Entry Point
- **index.js**: Express server setup and route mounting

### Data Schema (JSON)
- `users`: id, name, email, password hash, phone, matric_number, role, status, created_at
- `listings`: id, user_id, title, description, price, category, condition, location, images, status, clicks, created_at
- `reports`: id, listing_id, reporter_id, reporter_name, reporter_email, reason, status, created_at

## API Flow

1. **Frontend** makes HTTP request via `api.js`
2. **Backend** receives request in `routes/`
3. **Middleware** verifies authentication (if required)
4. **Data store** read/write handled via `dataStore.js`
5. **Response** sent back to frontend
6. **React** updates UI with new data

## Authentication Flow

1. User registers/logs in via `auth.js` routes
2. Backend generates JWT token
3. Token stored in localStorage
4. Token attached to subsequent requests
5. Protected routes verify token via `verifyToken` middleware
6. Admin routes check role via `isAdmin` middleware

## Image Upload Flow

1. User selects images in frontend
2. FormData created with images
3. POST to `/api/listings` with multipart/form-data
4. Multer middleware saves files to `uploads/` (or uploads to Cloudinary if env vars exist)
5. File URLs are saved in the JSON data store
6. Frontend displays images via `/uploads/` static route or Cloudinary links

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (user/admin)
- USM email domain validation
- Input validation to prevent malicious payloads
- File upload restrictions (images only, max 5MB)

## Data Flow Examples

### Creating a Listing
1. User fills form in `CreateListing.js`
2. FormData created with images
3. POST to `/api/listings` with auth token
4. Multer saves images to `uploads/` (or Cloudinary)
5. Data store saves listing metadata with image paths
6. User redirected to `/my-listings`

### Viewing Product Details
1. User clicks on product card
2. Navigate to `/product/:id`
3. `ProductDetail.js` fetches listing data
4. API also fetches seller information
5. Click counter incremented
6. Display all information with contact options

### Admin Moderation
1. Admin logs in with admin credentials
2. Accesses `/admin` route
3. Views all users and listings
4. Can ban users or delete listings
5. Actions immediately persisted to the JSON data store

## Environment Variables

Create `.env` file with:
```
PORT=5000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Data Persistence

`server/data/data.json` is auto-created on first server start. It includes:
- Default admin + sample student account
- Sample listings for demo purposes
- Automatic persistence of all new users/listings/reports

