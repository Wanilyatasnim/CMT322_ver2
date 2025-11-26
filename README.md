# 2Street.my - USM Student Marketplace

A simple platform for USM students to buy and sell secondhand items within the campus community.

## Features

### User Features
- **User Authentication**: Register with USM email (@student.usm.my) and login
- **Create Listings**: Post items for sale with title, description, price, category, condition, location, and photos
- **Manage Listings**: View, edit, delete your own listings and mark them as sold
- **Browse & Search**: Browse all listings, search by keyword, filter by category and price range
- **Product Details**: View detailed product information with seller contact info
- **Contact Seller**: Direct WhatsApp contact with pre-filled message
- **Safety Tips**: Access safety guidelines and reporting functionality
- **Profile Management**: View and edit your profile information

### Admin Features
- **Admin Dashboard**: View statistics, all users, and all listings
- **User Management**: Ban/unban users
- **Listing Management**: Delete inappropriate listings
- **Approve Listings**: Approve new listings (extended feature)

## Tech Stack

- **Frontend**: React.js with React Router
- **Backend**: Node.js with Express
- **Data Store**: Lightweight JSON file (no external database required)
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Local file system with Multer

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd test
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Set up environment variables**
Create a `.env` file in the root directory:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

5. **Create uploads directory**
```bash
mkdir uploads
```

6. **Run the application**

Development mode (runs both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

7. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Accounts

The app ships with two ready-to-use accounts that are stored inside `server/data/data.json` (the file is auto-created on first run):

| Role   | Email                       | Password |
|--------|-----------------------------|----------|
| Admin  | `admin@2street.usm.my`      | `admin123` |
| User   | `student@2street.usm.my`    | `user123`  |

You can continue registering additional USM student accounts via the UI—everything is stored in the same JSON file so no external DB setup is required.

## Usage

### For Students

1. **Register**: Create an account with your USM student email
2. **Browse**: View all available listings on the homepage
3. **Search**: Use the search bar and filters to find specific items
4. **View Details**: Click on a listing to see full details
5. **Contact Seller**: Click "Contact via WhatsApp" button
6. **Sell Items**: Create your own listing with photos and details

### For Admin

1. **Login**: Use the admin credentials above
2. **Dashboard**: View statistics and manage platform
3. **Manage Users**: Ban or unban users as needed
4. **Manage Listings**: Delete inappropriate listings

## Project Structure

```
test/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── services/       # API services
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Auth + multer config
│   ├── data/               # Local JSON data store
│   ├── routes/             # API routes
│   └── index.js
├── uploads/                # Image uploads directory
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (protected)
- `PUT /api/listings/:id` - Update listing (protected)
- `DELETE /api/listings/:id` - Delete listing (protected)
- `PATCH /api/listings/:id/sold` - Mark as sold (protected)
- `GET /api/listings/:id/seller-listings` - Get seller's other listings
- `POST /api/listings/:id/report` - Report listing

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)
- `GET /api/users/my-listings` - Get user's listings (protected)
- `GET /api/users/:id` - Get public user info

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/listings` - Get all listings (admin only)
- `GET /api/admin/stats` - Get statistics (admin only)
- `DELETE /api/admin/listings/:id` - Delete listing (admin only)
- `PATCH /api/admin/users/:id/ban` - Ban user (admin only)
- `PATCH /api/admin/users/:id/unban` - Unban user (admin only)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- File upload restrictions
- Role-based access control
- USM email domain validation

## MVP Scope

This is the Minimum Viable Product (MVP) version. Features included:
- Basic user authentication
- CRUD operations for listings
- Image upload
- Search and filtering
- Admin moderation
- WhatsApp contact integration

Features excluded for MVP:
- Email verification
- Password reset
- In-app messaging
- Payment system
- Reviews/ratings
- Advanced search filters
- Wishlist/favorites

## Future Enhancements

- Email notifications
- Advanced filtering and sorting
- Rating and review system
- Messaging system
- Mobile app version
- Analytics dashboard
- Featured listings
- Listing promotion options

## License

This project is developed for educational purposes.

## Support

For issues or questions, please contact the development team.

---

**2street** - Making campus shopping easier! 🛍️

