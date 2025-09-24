# Cardiology Hospital Backend API

This is the backend API for the Cardiology Hospital website, built with Node.js, Express, and MongoDB.

## Features

- **Admin Authentication**: Secure admin login with JWT tokens
- **User Registration**: User signup with data validation
- **User Management**: Admin can view, update, and delete registered users
- **Statistics**: User statistics and analytics
- **Security**: Rate limiting, CORS, helmet security headers
- **Database**: MongoDB with Mongoose ODM

## Environment Variables

Create a `.env` file in the backend root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://pmi_it:Loai-66343439@cluster0.e0rjr.mongodb.net/cardiology_hospital?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_USERNAME=pmi
ADMIN_PASSWORD=123

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## Installation

1. Navigate to the backend directory:
```bash
cd CardiologyWebsite_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create the `.env` file with the environment variables above

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/verify` - Verify JWT token

### Users (Admin only)
- `GET /api/users` - Get all registered users
- `GET /api/users/stats` - Get user statistics
- `PATCH /api/users/:userId/status` - Update user status
- `DELETE /api/users/:userId` - Delete user

### Health Check
- `GET /api/health` - API health check

## Admin Credentials

- **Username**: `pmi`
- **Password**: `123`

## Database Schema

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  phone: String (required),
  countryCode: String (default: '+973'),
  dateOfBirth: Date (required),
  gender: String (enum: ['male', 'female', 'other', 'prefer-not-to-say']),
  password: String (required, min 8 chars),
  role: String (enum: ['user', 'admin'], default: 'user'),
  status: String (enum: ['registered', 'pending', 'approved', 'rejected']),
  isActive: Boolean (default: true),
  lastLogin: Date,
  signupTime: Date (default: now)
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with express-validator

## Development

- **Start server**: `npm run dev` (with nodemon)
- **Start production**: `npm start`
- **Environment**: Development mode with detailed error messages

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use a production MongoDB instance
5. Set up proper logging and monitoring
