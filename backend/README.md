# Hotel Annapurna Samar - Backend

This is the backend API for the Hotel Annapurna Samar management system.

## Features

- **Authentication**: JWT-based authentication system
- **Bookings Management**: CRUD operations for hotel bookings
- **Media Management**: File upload and management for images/videos
- **Reports**: Analytics and reporting functionality
- **Blog Management**: Content management for hotel blog

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hotel-annapurna-samar
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Database**:
   Make sure MongoDB is running on your system or use MongoDB Atlas.

4. **Run the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Media
- `GET /api/media` - Get all media files
- `POST /api/media/upload` - Upload files
- `DELETE /api/media/:id` - Delete media file

### Reports
- `GET /api/reports` - Get basic reports
- `GET /api/reports/date-range` - Get bookings by date range
- `GET /api/reports/revenue` - Get revenue statistics

## Default Login Credentials

- **Username**: admin
- **Password**: admin123

## File Structure

```
backend/
├── config/
│   ├── config.js     # Environment configuration
│   └── db.js         # Database connection
├── middleware/
│   ├── auth.js       # JWT authentication middleware
│   └── upload.js     # File upload middleware
├── models/
│   ├── Blog.js       # Blog post model
│   ├── Booking.js    # Booking model
│   ├── Guest.js      # Guest model
│   └── Media.js      # Media file model
├── routes/
│   ├── auth.js       # Authentication routes
│   ├── bookings.js   # Booking routes
│   ├── media.js      # Media routes
│   └── reports.js    # Report routes
├── uploads/          # File upload directory
├── server.js         # Main server file
└── package.json
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
