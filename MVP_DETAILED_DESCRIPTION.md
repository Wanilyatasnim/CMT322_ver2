# 2Street.my - Detailed MVP Description

## Overview
**2Street.my** is a student marketplace platform specifically designed for USM (Universiti Sains Malaysia) students to buy and sell secondhand items within the campus community. The platform provides a simple, secure, and user-friendly interface for students to trade items like electronics, furniture, books, appliances, and other goods.

---

## 1. User Authentication & Profile Module

### Registration
- ✅ **USM Email Validation**: Only emails ending with `@student.usm.my` are accepted
- ✅ **Required Fields**:
  - Full Name
  - USM Student Email
  - Password (with confirmation)
- ✅ **Optional Fields**:
  - Phone Number
  - Matric Number
- ✅ **Password Security**: Passwords are hashed using bcrypt before storage
- ✅ **Instant Login**: Users are automatically logged in after successful registration

### Login
- ✅ **Email & Password Authentication**: Standard login form
- ✅ **JWT Token**: Users receive a JSON Web Token for session management
- ✅ **Token Storage**: Token stored in browser localStorage
- ✅ **Session Duration**: Token valid for 7 days
- ✅ **Error Handling**: Clear error messages for invalid credentials

### Logout
- ✅ **One-Click Logout**: Removes authentication token
- ✅ **Redirect**: Automatically redirects to homepage after logout

### User Profile
- ✅ **View Profile**: Accessible from navigation bar
- ✅ **Profile Information Displayed**:
  - Full Name
  - Email (read-only, cannot be changed)
  - Phone Number
  - Matric Number
  - Account Creation Date
- ✅ **Edit Profile**:
  - Update Name
  - Update Phone Number
  - Update Matric Number
  - Email cannot be modified
- ✅ **Success Feedback**: Confirmation message after profile update

---

## 2. Product Listing Module

### Create Listing
- ✅ **Required Fields**:
  - Title (text input)
  - Description (textarea)
  - Price (number input, in RM)
  - Category (dropdown: Electronics, Furniture, Books, Appliances, Others)
  - Condition (dropdown: New, Like New, Good, Fair)
  - Images (1-3 photos required, at least 1 mandatory)
- ✅ **Optional Fields**:
  - Location/Hostel (text input)
- ✅ **Image Upload**:
  - Multiple image selection (up to 3)
  - Image preview before submission
  - File validation (images only)
  - Maximum file size: 5MB per image
  - Image preview grid display
  - Remove image option before upload
- ✅ **Form Validation**: All required fields must be filled
- ✅ **Success Response**: Redirects to "My Listings" page after creation

### View My Listings
- ✅ **Dedicated Page**: Accessible from navigation bar
- ✅ **Listings Display**: Grid layout showing all user's listings
- ✅ **Listing Information Shown**:
  - Product image (first image)
  - Product title
  - Price
  - Category
  - Condition
  - Status (Active/Sold)
- ✅ **Status Badge**: Visual indicator for sold items
- ✅ **Empty State**: Helpful message when no listings exist

### Edit Listing
- ✅ **Access**: Available from "My Listings" page
- ✅ **Editable Fields**: All fields can be modified
- ✅ **Image Management**:
  - View existing images
  - Remove existing images
  - Add new images (replaces old ones if new images uploaded)
  - Maintains up to 3 images limit
- ✅ **Form Pre-filled**: All current listing data loaded automatically
- ✅ **Update Confirmation**: Redirects to "My Listings" after update

### Delete Listing
- ✅ **Confirmation Dialog**: Prevents accidental deletion
- ✅ **Permanent Deletion**: Removes listing from the data store
- ✅ **UI Update**: Listing removed from list immediately after deletion

### Mark as Sold
- ✅ **One-Click Action**: Button available on listing detail page and "My Listings" page
- ✅ **Confirmation**: Dialog asks for confirmation before marking
- ✅ **Status Update**: Changes listing status from "active" to "sold"
- ✅ **Visual Indicator**: Sold items display "SOLD" badge
- ✅ **Hide from Browse**: Sold items don't appear in homepage listings

---

## 3. Browse & Search Module

### Homepage
- ✅ **Latest Listings**: All active listings displayed (newest first by default)
- ✅ **Grid Layout**: Responsive grid showing product cards
- ✅ **Product Cards Display**:
  - Product image (or placeholder if no image)
  - Product title (2 lines max, truncated)
  - Price (formatted in RM)
  - Category badge
  - Condition badge
- ✅ **Loading State**: Spinner displayed while fetching listings
- ✅ **Empty State**: Message when no listings found
- ✅ **Listing Count**: Shows total number of listings found

### Category Navigation
- ✅ **Category Cards**: Clickable cards similar to Shopee design
- ✅ **Categories Available**:
  - Electronics (📱)
  - Furniture (🪑)
  - Books (📚)
  - Appliances (🔌)
  - Others (📦)
- ✅ **Visual Feedback**: Selected category highlighted with colored border
- ✅ **Auto-Filter**: Clicking category automatically filters listings
- ✅ **Category Icons**: Each category has unique emoji icon
- ✅ **Color Coding**: Each category has unique color theme

### Search Functionality
- ✅ **Search Bar**: Prominent search input at top of page
- ✅ **Search Scope**: Searches both title and description
- ✅ **Real-time Search**: Press Enter or click Search button
- ✅ **Partial Match**: Finds listings with keywords anywhere in text
- ✅ **Case Insensitive**: Search works regardless of capitalization

### Advanced Filters
- ✅ **Category Filter**: Already available via category cards
- ✅ **Condition Filter**: 
  - Dropdown with options: All Conditions, New, Like New, Good, Fair
  - Auto-applies when changed
  - Works with other filters
- ✅ **Location Filter**:
  - Text input field
  - Partial match search (e.g., "Aman" finds "Aman Damai Hostel")
  - Case insensitive
  - Press Enter or click Search
- ✅ **Price Range Filter**:
  - Minimum Price input
  - Maximum Price input
  - Both optional (can use one or both)
  - Decimal values supported
- ✅ **Filter Combination**: All filters work together simultaneously
- ✅ **Clear Filters**: One button to reset all filters

### Sorting Options
- ✅ **Sort Dropdown**: Located in filter section
- ✅ **Sort Options Available**:
  - Newest First (default)
  - Oldest First
  - Price: Low to High
  - Price: High to Low
- ✅ **Instant Sort**: Results update immediately when sort option changes
- ✅ **Persistent**: Sort preference maintained with filters

### Product Detail Page
- ✅ **Complete Information Display**:
  - Product title
  - Price (large, prominent)
  - Category
  - Condition
  - Location (if provided)
  - Description (full text, preserves formatting)
  - Listing date
  - Status (Active/Sold)
- ✅ **Image Gallery**:
  - Main large image display
  - Thumbnail navigation (if multiple images)
  - Click thumbnails to change main image
  - Active thumbnail highlighted
  - Image fallback for missing images
- ✅ **Seller Information**:
  - Seller name
  - Seller phone number (visible to all visitors)
- ✅ **Contact Options**:
  - WhatsApp button (opens WhatsApp with pre-filled message)
  - Report button (opens report modal)
- ✅ **Click Counter**: Tracks number of views (increments on each view)
- ✅ **Seller's Other Listings**:
  - Section showing up to 6 other active listings from same seller
  - Grid layout
  - Excludes current listing
  - Only shows active listings

### Owner Actions
- ✅ **Edit Listing**: Button visible only to listing owner
- ✅ **Mark as Sold**: Button visible only to listing owner (if active)
- ✅ **View Restrictions**: Owner cannot see "Contact Seller" button

---

## 4. Contact & Safety Module

### Seller Contact
- ✅ **Phone Number Display**: Seller's phone number visible on product detail page
- ✅ **Direct Contact**: No registration required to view seller info
- ✅ **WhatsApp Integration**:
  - One-click WhatsApp contact button
  - Pre-filled message with product title
  - Opens WhatsApp Web or mobile app
  - Automatic phone number formatting
  - Works on all devices

### Report Listing
- ✅ **Report Button**: Available on all product detail pages
- ✅ **Report Modal**: Pop-up form for reporting
- ✅ **Report Fields**:
  - Reason field (textarea, required)
- ✅ **Submission**: Sends report to admin (logged in backend)
- ✅ **Confirmation**: Success message after submission
- ✅ **Anonymous**: Users don't need to be logged in to report

### Safety Tips Page
- ✅ **Dedicated Page**: Accessible from navigation bar
- ✅ **Content Sections**:
  - Best Practices
  - Warning Signs
  - Reporting Issues
  - Emergency Contact Information
- ✅ **Best Practices Include**:
  - Meet in public places
  - Inspect items before buying
  - Verify seller information
  - Use secure payment methods
  - Trust your instincts
- ✅ **Warning Signs Listed**:
  - Pressure to meet in isolated locations
  - Requests for advance payment
  - Prices too good to be true
  - Reluctance to show items
  - Unusual payment requests
  - Vague contact information
- ✅ **Reporting Guidelines**: Instructions on how to report issues
- ✅ **Emergency Information**: Campus security contact details

---

## 5. Admin Module

### Admin Authentication
- ✅ **Admin Credentials**:
  - Email: `admin@2street.usm.my`
  - Password: `admin123`
- ✅ **Admin Role**: Separate role stored in the data layer
- ✅ **Admin Login**: Same login page, different privileges
- ✅ **Restricted Access**: Admin-only routes protected

### Admin Dashboard
- ✅ **Statistics Overview**:
  - Total Users count
  - Total Listings count
  - Active Listings count
  - Sold Listings count
- ✅ **Visual Cards**: Statistics displayed in card format
- ✅ **Tab Navigation**: Three main tabs (Statistics, Users, Listings)

### User Management
- ✅ **View All Users**: Complete list of registered users
- ✅ **User Information Displayed**:
  - User ID
  - Full Name
  - Email
  - Phone Number
  - Role (user/admin)
  - Status (active/banned)
  - Account Creation Date
- ✅ **User Actions**:
  - Ban User: Changes status to "banned"
  - Unban User: Changes status back to "active"
- ✅ **Confirmation**: Dialog before banning/unbanning
- ✅ **Status Indicators**: Color-coded status badges

### Listing Management
- ✅ **View All Listings**: Complete list of all listings (active and sold)
- ✅ **Listing Information Displayed**:
  - Listing ID
  - Title
  - Category
  - Price
  - Status (active/sold)
  - User ID (seller)
- ✅ **Admin Actions**:
  - Delete Listing: Removes listing from the data store
- ✅ **Confirmation**: Dialog before deletion
- ✅ **Status Indicators**: Color-coded status badges

### Admin Restrictions
- ✅ **No Buying/Selling**: Admin cannot access "Sell Item" or "My Listings"
- ✅ **Admin-Only Navigation**: Admin sees only Admin, Safety Tips, and Logout
- ✅ **Direct Access**: Admin automatically redirected to dashboard after login

---

## 6. Technical Features

### Frontend Technology
- ✅ **React.js**: Modern JavaScript framework
- ✅ **React Router**: Client-side routing
- ✅ **Axios**: HTTP client for API calls
- ✅ **React Icons**: Icon library
- ✅ **Responsive Design**: Mobile-friendly layout
- ✅ **Notion-Style Theme**: Clean, modern design aesthetic

### Backend Technology
- ✅ **Node.js**: JavaScript runtime
- ✅ **Express.js**: Web framework
- ✅ **Local JSON data store**: Lightweight persistence layer
- ✅ **JWT**: JSON Web Tokens for authentication
- ✅ **Bcrypt**: Password hashing
- ✅ **Multer**: File upload handling
- ✅ **CORS**: Cross-origin resource sharing enabled

### Data Store
- ✅ **Users Collection**:
  - id (auto-increment)
  - name
  - email (unique)
  - password (hashed)
  - phone
  - matric_number
  - role (user/admin)
  - status (active/banned)
  - created_at timestamp
- ✅ **Listings Collection**:
  - id (auto-increment)
  - user_id (seller reference)
  - title
  - description
  - price
  - category
  - condition
  - location
  - images (comma-separated URLs)
  - status (active/sold)
  - clicks (view counter)
  - created_at timestamp
- ✅ **Reports Collection**: Stores listing reports with reporter info + status
- ✅ **Auto-Initialization**: JSON file created automatically on first run
- ✅ **Auto-Seeding**: Sample data added on deployment

### Security Features
- ✅ **Password Hashing**: Bcrypt with 10 rounds
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Email Validation**: USM email domain restriction
- ✅ **Input Validation**: Sanitizes payloads before persistence
- ✅ **File Upload Validation**: Only image files accepted
- ✅ **File Size Limits**: 5MB maximum per image
- ✅ **Role-Based Access Control**: Admin and user roles
- ✅ **Route Protection**: Protected routes require authentication

### Image Handling
- ✅ **Local Storage**: Images stored in `uploads/` directory
- ✅ **Unique Filenames**: Timestamp-based naming prevents conflicts
- ✅ **Multiple Images**: Support for 1-3 images per listing
- ✅ **Image Preview**: Preview before upload
- ✅ **Image Display**: Static file serving for images
- ✅ **Fallback Images**: Placeholder for missing images

### API Endpoints
- ✅ **Authentication**:
  - POST `/api/auth/register` - Register new user
  - POST `/api/auth/login` - Login user
  - GET `/api/auth/me` - Get current user
- ✅ **Listings**:
  - GET `/api/listings` - Get all listings (with filters)
  - GET `/api/listings/:id` - Get single listing
  - POST `/api/listings` - Create listing
  - PUT `/api/listings/:id` - Update listing
  - DELETE `/api/listings/:id` - Delete listing
  - PATCH `/api/listings/:id/sold` - Mark as sold
  - GET `/api/listings/:id/seller-listings` - Get seller's other listings
  - POST `/api/listings/:id/report` - Report listing
- ✅ **Users**:
  - GET `/api/users/profile` - Get user profile
  - PUT `/api/users/profile` - Update profile
  - GET `/api/users/my-listings` - Get user's listings
  - GET `/api/users/:id` - Get public user info
- ✅ **Admin**:
  - GET `/api/admin/users` - Get all users
  - GET `/api/admin/listings` - Get all listings
  - GET `/api/admin/stats` - Get statistics
  - DELETE `/api/admin/listings/:id` - Delete listing
  - PATCH `/api/admin/users/:id/ban` - Ban user
  - PATCH `/api/admin/users/:id/unban` - Unban user
  - PATCH `/api/admin/listings/:id/approve` - Approve listing

### Deployment
- ✅ **Railway Deployment**: Configured for cloud hosting
- ✅ **Auto-Deploy**: Automatic deployment on git push
- ✅ **Environment Variables**: Configurable via Railway dashboard
- ✅ **Data Seeding**: Auto-seeds sample data on deployment
- ✅ **Build Configuration**: Automated build process

---

## 7. User Experience Features

### Navigation
- ✅ **Fixed Navbar**: Always visible at top
- ✅ **Brand Logo**: 2Street.my branding
- ✅ **User Context**: Shows user name when logged in
- ✅ **Role-Based Menu**: Different menu items for admin vs user
- ✅ **Mobile Responsive**: Mobile menu toggle for small screens
- ✅ **Active States**: Visual feedback for current page

### Loading States
- ✅ **Spinners**: Loading indicators during API calls
- ✅ **Button States**: Disabled buttons during submission
- ✅ **Loading Messages**: Text feedback (e.g., "Logging in...", "Creating...")

### Error Handling
- ✅ **Form Validation**: Client-side validation for required fields
- ✅ **Error Messages**: Clear, user-friendly error messages
- ✅ **Network Errors**: Graceful handling of API failures
- ✅ **404 Pages**: Not found handling for invalid routes

### Success Feedback
- ✅ **Success Messages**: Confirmation after successful actions
- ✅ **Redirects**: Automatic navigation after successful operations
- ✅ **Visual Feedback**: Success alerts with green styling

### Responsive Design
- ✅ **Mobile First**: Optimized for mobile devices
- ✅ **Tablet Support**: Works on tablet screens
- ✅ **Desktop Support**: Full-featured on desktop
- ✅ **Flexible Layouts**: Grid adapts to screen size
- ✅ **Touch Friendly**: Large tap targets on mobile

---

## 8. Sample Data

### Test Users
- ✅ **Admin User**:
  - Email: `admin@2street.usm.my`
  - Password: `admin123`
- ✅ **Sample Students** (Password: `password123`):
  - Ahmad Zaki: `ahmad.zaki@student.usm.my`
  - Siti Sarah: `siti.sarah@student.usm.my`
  - Lee Wei Ming: `lee.weiming@student.usm.my`

### Sample Listings
- ✅ **7 Sample Listings**:
  - MacBook Pro 13 inch M1 Chip (RM 3,500)
  - Samsung Galaxy S21 Ultra (RM 2,200)
  - IKEA Study Table with Drawer (RM 150)
  - Mini Refrigerator - Sharp (RM 280)
  - Calculus Textbook (RM 80)
  - Chemistry Lab Coat (RM 35)
  - AirPods Pro 2nd Generation (RM 750)

---

## 9. Excluded Features (Intentional MVP Limitations)

- ❌ **Email Verification**: Not included (can add later)
- ❌ **Password Reset**: Not included (can add later)
- ❌ **In-App Messaging**: External WhatsApp only
- ❌ **Payment Gateway**: No payment processing
- ❌ **Reviews/Ratings**: Not included
- ❌ **Wishlist/Favorites**: Not included
- ❌ **Advanced Search**: Basic search only
- ❌ **Email Notifications**: Not included
- ❌ **Social Login**: Email/password only
- ❌ **Profile Pictures**: Not included
- ❌ **Transaction History**: Not included
- ❌ **Appointment Scheduler**: Not included
- ❌ **Map Integration**: Text location only
- ❌ **Listing Expiry**: No automatic expiry
- ❌ **Featured Listings**: All listings equal
- ❌ **Price Negotiation**: Fixed prices only

---

## 10. Success Criteria

### For Students (Sellers)
- ✅ Register with USM email
- ✅ Login to account
- ✅ Create listings with photos
- ✅ Edit and delete own listings
- ✅ Mark items as sold
- ✅ View own listings

### For Students (Buyers)
- ✅ Browse all listings without login
- ✅ Search for items
- ✅ Filter by category, condition, location, price
- ✅ Sort by newest or price
- ✅ View product details
- ✅ See seller contact information
- ✅ Contact seller via WhatsApp
- ✅ Report inappropriate listings

### For Admin
- ✅ Login as admin
- ✅ View platform statistics
- ✅ View all users
- ✅ View all listings
- ✅ Ban/unban users
- ✅ Delete inappropriate listings
- ✅ Moderate content

---

## 11. Key Differentiators

- ✅ **USM-Exclusive**: Only USM students can register
- ✅ **Campus Focus**: Designed for campus community
- ✅ **Simple & Fast**: No complex features, easy to use
- ✅ **Direct Contact**: WhatsApp integration for instant contact
- ✅ **Mobile-Friendly**: Works great on phones
- ✅ **Free to Use**: No fees or commissions
- ✅ **Safety First**: Safety tips and reporting features

---

## 12. Future Enhancement Opportunities

### Potential Additions (Post-MVP)
- Email verification system
- Password reset functionality
- In-app messaging system
- Payment gateway integration
- Review and rating system
- Wishlist/favorites feature
- Advanced search with filters
- Email notifications
- Profile picture upload
- Map integration for meetups
- Listing expiry and renewal
- Featured listings
- Price negotiation system
- Analytics dashboard
- Mobile app version

---

## Summary

**2Street.my** is a complete, functional MVP that successfully addresses the core need: enabling USM students to buy and sell secondhand items within their campus community. The platform is production-ready, fully deployed, and includes all essential features for a functional marketplace while maintaining simplicity and ease of use.

**Status**: ✅ **100% Complete and Functional**

