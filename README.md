# DXDY Event Management Platform

A full-stack MERN (MongoDB, Express, React, Node.js) application for discovering, creating, and managing events. The platform provides a seamless experience for event organizers and attendees with modern authentication, real-time event filtering, and bookmark management.


##  Project Overview

DXDY Event Management is a comprehensive event discovery and management platform that enables users to:

- Discover Events: Browse and filter events by location, category, and search keywords
- Create Events: Event organizers can create, edit, and manage their events with rich details
- User Authentication: Secure sign-up and login with multiple authentication methods (Email/Password, Google OAuth)
- Bookmark Events: Save favorite events for quick access later
- User Profiles: Manage user information, change passwords, and update email
- Event Management: Create, edit, delete, and manage events with location-based features

The platform prioritizes security, performance, and user experience with modern development practices.


##  Tech Stack

### Frontend
- **Framework**: React 19.2.6
- **Build Tool**: Vite 8.0.12
- **State Management**: Redux Toolkit 2.12.0 with React-Redux 9.3.0
- **Routing**: React Router DOM 7.15.1
- **HTTP Client**: Axios 1.16.1
- **Authentication**: Google OAuth (@react-oauth/google 0.13.5)
- **UI/UX**: 
  - Tailwind CSS 3.4.19 (Utility-first CSS framework)
  - React Icons 5.6.0 (Icon library)
  - React Toastify 11.1.0 (Notifications)
- **Development**: ESLint 10.3.0, Autoprefixer 10.5.0, PostCSS 8.5.15
- **Hosting**: Vercel

### **Backend**
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 8.0.0 (via Mongoose ODM)
- **Authentication**:
  - JSON Web Tokens (JWT) 9.0.2
  - OTP Generation (otp-generator 4.0.1)
  - Google Auth Library (google-auth-library 10.6.1)
  - Password Hashing (bcryptjs 2.4.3)
- **File Upload**: Multer 2.0.2
- **Email Service**: Nodemailer 6.10.1
- **Input Validation**: Express Validator 7.0.1
- **CORS**: CORS 2.8.6
- **Environment Management**: Dotenv 17.3.1
- **Development**: Nodemon 3.1.14

### **Database**
- **MongoDB**: NoSQL database for flexible schema and scalability
- **Collections**: Users, Events, OTP

### **External APIs & Services**
- Google OAuth 2.0: Third-party authentication provider
- Email Service (SMTP): Nodemailer for sending verification codes and notifications
- OpenStreetMap Nominatim API: Used for location search, address lookup, and geocoding functionality


##  Setup Instructions

### **Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher (LTS recommended)
- **npm**: v8 or higher (comes with Node.js)
- **MongoDB**: Local instance or MongoDB Atlas cloud account
- **Git**: For cloning the repository
- **Code Editor**: VS Code or similar

### **Installation**

#### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd dxdyEventManagement
```

#### 2. **Backend Setup**

Navigate to the Backend directory:
```bash
cd Backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the Backend directory with the following variables:

```env
# Server Configuration
PORT=8080

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dxdy_events

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com


# Email Service (SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Frontend Client URL
CLIENT_URL=http://localhost:5173

```

**Environment Variables Explanation**:
- `MONGODB_URI`: MongoDB connection string. Get from MongoDB Atlas or use local instance
- `JWT_SECRET`: Secret key for signing JWT tokens (must be at least 32 characters)
- `GOOGLE_CLIENT_ID`: OAuth 2.0 Client ID from Google Cloud Console
- `EMAIL_USER/PASSWORD`: Gmail credentials with app-specific password enabled
- `CLIENT_URL`: Frontend URL for CORS configuration

#### 3. **Frontend Setup**

Navigate to the Frontend directory (in another terminal):
```bash
cd Frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the Frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Or for production:
```env
VITE_API_BASE_URL=https://your-backend-url.com
```
VITE_GOOGLE_CLIENT_ID=

### **Running the Application**

#### **Backend**

Start the backend server:
```bash
cd Backend
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Backend will be available at: `http://localhost:8080`

#### **Frontend**

In another terminal, start the frontend development server:
```bash
cd Frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

##  API Documentation

### **Base URL**
```
http://localhost:8080/api
```

### **Authentication**
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

### **Authentication Endpoints** (`/api/auth`)

#### **1. Send Registration OTP**
- **Endpoint**: `POST /auth/send-registration-otp`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "OTP sent to email"
}
```
- **Error** (400):
```json
{
  "status": "fail",
  "message": "User already exists"
}
```

#### **2. Verify Registration OTP**
- **Endpoint**: `POST /auth/verify-registration-otp`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
- **Response** (201 Created):
```json
{
  "status": "success",
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **3. Login**
- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **4. Google Login**
- **Endpoint**: `POST /auth/google`
- **Access**: Public
- **Request Body**:
```json
{
  "credential": "google_id_token_from_frontend"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Google login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Doe",
    "email": "jane@gmail.com",
    "avatar": "https://..."
  }
}
```

#### **5. Forgot Password**
- **Endpoint**: `POST /auth/forgot-password`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Password reset OTP sent to email"
}
```

#### **6. Reset Password**
- **Endpoint**: `POST /auth/reset-password`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePassword123"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Password reset successful"
}
```

#### **7. Logout**
- **Endpoint**: `POST /auth/logout`
- **Access**: Public
- **Request Body**: `{}` (empty)
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### **User Endpoints** (`/api/users`)
*All endpoints require authentication*

#### **1. Get Current User Profile**
- **Endpoint**: `GET /users/me`
- **Access**: Protected
- **Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true,
      "createdAt": "2026-05-24T10:00:00.000Z",
      "lastLogin": "2026-05-24T09:00:00.000Z",
      "provider": "local"
    }
  }
}
```

#### **2. Update Profile**
- **Endpoint**: `PATCH /users/update-profile`
- **Access**: Protected
- **Request Body**:
```json
{
  "name": "John Updated",
  "email": "example@gmail.com"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Profile updated",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Updated",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": true
    }
  }
}
```

#### **3. Change Password**
- **Endpoint**: `PATCH /users/change-password`
- **Access**: Protected
- **Request Body**:
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Password changed successfully. Please login again."
}
```

#### **4. Send Email Change OTP**
- **Endpoint**: `POST /users/send-email-change-otp`
- **Access**: Protected
- **Request Body**:
```json
{
  "newEmail": "newemail@example.com"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "OTP sent to new email address"
}
```

#### **5. Verify Email Change OTP**
- **Endpoint**: `POST /users/verify-email-change-otp`
- **Access**: Protected
- **Request Body**:
```json
{
  "newEmail": "newemail@example.com",
  "otp": "123456"
}
```
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Email updated successfully",
  "data": {
    "user": {
      "email": "newemail@example.com"
    }
  }
}
```

---

### **Event Endpoints** (`/api/events`)

#### **1. Get All Events (List Events)**
- **Endpoint**: `GET /events`
- **Access**: Public
- **Query Parameters**:
  - `category` (optional): Filter by category
  - `city` (optional): Filter by city
  - `country` (optional): Filter by country
  - `search` (optional): Search in title, description, category, tags, or city
  - `createdBy` (optional): Filter by event creator
  - `page` (optional): Pagination page number (default: 1)
  - `limit` (optional): Items per page (default: 20)

- **Example**: `GET /events?city=New%20York&category=Music&page=1&limit=10`

- **Response** (200 OK):
```json
{
  "status": "success",
  "items": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "title": "JavaScript Conference 2026",
      "slug": "javascript-conference-2026",
      "description": "Annual JavaScript developers conference",
      "category": "Technology",
      "startDate": "2026-06-15",
      "startTime": "09:00",
      "endDate": "2026-06-16",
      "endTime": "17:00",
      "organizer": "Tech Events Inc",
      "imageUrl": "https://cloudinary.com/...",
      "tags": ["javascript", "web", "developers"],
      "location": {
        "name": "Convention Center",
        "formattedAddress": "123 Main St, New York, NY 10001, USA",
        "city": "New York",
        "country": "USA",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      },
      "createdBy": "507f1f77bcf86cd799439011"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 45
}
```

#### **2. Get Event by ID**
- **Endpoint**: `GET /events/:eventId`
- **Access**: Public
- **Response** (200 OK):
```json
{
  "_id": "607f1f77bcf86cd799439013",
  "title": "JavaScript Conference 2026",
  "slug": "javascript-conference-2026",
  "description": "Annual JavaScript developers conference",
  "category": "Technology",
  "startDate": "2026-06-15",
  "startTime": "09:00",
  "organizer": "Tech Events Inc",
  "imageUrl": "https://...",
  "location": {
    "name": "Convention Center",
    "formattedAddress": "123 Main St, New York, NY 10001, USA",
    "city": "New York",
    "country": "USA"
  },
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **3. Create Event**
- **Endpoint**: `POST /events`
- **Access**: Protected (Authenticated users)
- **Request Body**:
```json
{
  "title": "Summer Music Festival",
  "description": "A wonderful music festival with top artists",
  "category": "Music",
  "startDate": "2026-07-15",
  "startTime": "18:00",
  "endDate": "2026-07-15",
  "endTime": "23:00",
  "organizer": "Music Events LLC",
  "imageUrl": "https...",
  "tags": ["music", "summer", "festival"],
  "location": {
    "name": "Central Park",
    "formattedAddress": "Central Park, New York, NY, USA",
    "city": "New York",
    "country": "USA",
    "coordinates": {
      "lat": 40.7829,
      "lng": -73.9654
    }
  }
}
```
- **Response** (201 Created):
```json
{
  "_id": "607f1f77bcf86cd799439014",
  "title": "Summer Music Festival",
  "slug": "summer-music-festival",
  "description": "A wonderful music festival with top artists",
  "category": "Music",
  "startDate": "2026-07-15",
  "startTime": "18:00",
  "endDate": "2026-07-15",
  "endTime": "23:00",
  "organizer": "Music Events LLC",
  "imageUrl": "https...",
  "tags": ["music", "summer", "festival"],
  "location": {
    "name": "Central Park",
    "formattedAddress": "Central Park, New York, NY, USA",
    "city": "New York",
    "country": "USA",
    "coordinates": {
      "lat": 40.7829,
      "lng": -73.9654
    }
  },
  "isCustom": true,
  "createdBy": "507f1f77bcf86cd799439011"
}
```

#### **4. Update Event**
- **Endpoint**: `PUT /events/:eventId`
- **Access**: Protected (Event creator only)
- **Request Body**:
```json
{
  "title": "Updated Music Festival",
  "description": "Updated description"
}
```
- **Response** (200 OK):
```json
{
  "_id": "607f1f77bcf86cd799439014",
  "title": "Updated Music Festival",
  "description": "Updated description",
  "category": "Music",
  "slug": "updated-music-festival",
  "isCustom": true,
  "createdBy": "507f1f77bcf86cd799439011"
}
```

#### **5. Delete Event**
- **Endpoint**: `DELETE /events/:eventId`
- **Access**: Protected (Event creator only)
- **Response** (204 No Content): No response body

---

### **Bookmark Endpoints** (`/api/bookmarks`)
*All endpoints require authentication*

#### **1. Get User Bookmarks**
- **Endpoint**: `GET /bookmarks`
- **Access**: Protected
- **Response** (200 OK):
```json
{
  "items": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "title": "JavaScript Conference 2026",
      "slug": "javascript-conference-2026",
      "description": "Annual JavaScript developers conference"
    }
  ]
}
```

#### **2. Toggle Bookmark**
- **Endpoint**: `POST /bookmarks/:eventId`
- **Access**: Protected
- **Request Body**: `{}` (empty)
- **Response** (200 OK):
```json
{
  "bookmarked": true,
  "savedEvents": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "title": "JavaScript Conference 2026",
      "slug": "javascript-conference-2026"
    }
  ]
}
```

---

### **Health Check**
- **Endpoint**: `GET /health`
- **Access**: Public
- **Response** (200 OK):
```json
{
  "status": "success",
  "message": "Server is running"
}
```


##  Architecture Decisions

### **1. Why These Technologies Were Chosen**

#### **Frontend: React + Vite**
- **React 19**: Latest features, excellent ecosystem, large community support
- **Vite**: Lightning-fast build tool with HMR (Hot Module Replacement) for superior DX
- **Redux Toolkit**: Simplified Redux patterns with better DX, immutability helpers
- **Tailwind CSS**: Utility-first CSS for rapid UI development and consistent design

**Tradeoff**: React has a steep learning curve but provides powerful component reusability. Vite is relatively new but provides significantly better performance than Webpack.

#### **Backend: Express.js + Node.js**
- **Express**: Lightweight, flexible, excellent middleware ecosystem
- **Node.js**: JavaScript everywhere, non-blocking I/O, perfect for I/O-heavy operations like file uploads and database queries
- **ES Modules**: Future-proof, modern JavaScript standard

**Tradeoff**: Node.js single-threaded model requires careful handling of CPU-intensive operations. Express is minimal, requiring manual addition of features.

#### **Database: MongoDB**
- **Flexible Schema**: Event data has variable structures (custom fields, multiple location formats)
- **Horizontal Scalability**: Document-based model scales well for event collections
- **Rich Query Language**: Excellent support for complex filtering and text search

**Tradeoff**: No ACID transactions in early versions (addressed in recent updates). Requires more careful data validation at application level.

#### **Authentication Strategy**
- **JWT + OTP**: Stateless authentication (no session storage needed)
- **Google OAuth**: Frictionless login for users with existing Google accounts
- **Email OTP**: Enhanced security for sensitive operations (registration, password reset)

**Tradeoff**: JWT tokens cannot be revoked instantly (mitigated by short expiry times and refresh tokens). OTP adds complexity but significantly improves security.
---

### **2. Folder Structure Decisions**

#### **Backend Structure**
```
Backend/
├── config/              # Configuration files (database connections)
├── controllers/         # Request handlers, business logic orchestration
├── middleware/          # Authentication, error handling, validation
├── models/              # Mongoose schemas and database models
├── routes/              # API route definitions and endpoint mapping
├── services/            # Core business logic, reusable operations
│   ├── auth.service.js      # Authentication logic
│   ├── email.service.js     # Email and OTP handling
│   ├── event.service.js     # Event operations
│   ├── bookmark.service.js  # Bookmark logic
│   └── location.service.js  # Location/geocoding operations
├── utils/               # Helper functions and utilities
├── server.js            # Application entry point
└── package.json
```

**Rationale**:
- **Separation of Concerns**: Services contain business logic, controllers handle requests
- **Scalability**: Easy to add new models, routes, or services
- **Testability**: Services are decoupled and independently testable
- **Maintainability**: Clear structure makes it easy for new developers to navigate

#### **Frontend Structure**
```
Frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page-level components (route destinations)
│   ├── Redux/           # State management
│   │   ├── Api/         # API client configuration
│   │   ├── Features/    # Redux slices (auth, events, bookmarks)
│   │   └── Store/       # Redux store configuration
│   ├── routes/          # Routing setup and protected routes
│   ├── utils/           # Helper functions and utilities
│   ├── assets/          # Images, icons, static files
│   ├── index.css        # Global styles
│   └── main.jsx         # React entry point
├── package.json
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vercel.json          # Vercel deployment config
```

**Rationale**:
- **Component-Based**: Encourages reusable, composable UI pieces
- **Feature-Based Redux**: Slices grouped by feature (auth, events) rather than type
- **Clear Entry Points**: Different pages have their own components

---

### **3. State Management: Redux Toolkit**

**Architecture Decision**:
- **Slices**: Each feature (auth, events, bookmarks) has a dedicated slice
- **Async Thunks**: Handle API calls with proper loading/error states
- **Middleware Bypassed**: Only necessary thunks are used to keep store lean
- **Local Storage**: Tokens persisted to enable session recovery

**Slices**:
- **authSlice**: User authentication state (user, token, loading, error)
- **eventsSlice**: Events list, filters, pagination
- **bookmarksSlice**: User's bookmarked events

**Sample Slice Structure**:
```javascript
// Initial State
{
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false
}
```

**Rationale**:
- Redux Toolkit reduces boilerplate vs vanilla Redux
- Immer middleware handles immutability automatically
- Slices make code organization clear and scalable

---

### **4. Authentication Approach**

**Multi-Method Authentication Strategy**:

1. **Traditional Auth (Email + Password)**:
   - Registration: User → Send OTP → Verify OTP → Account Created
   - Login: Email + Password → Generate JWT

2. **Google OAuth**:
   - One-click authentication via Google credentials
   - Auto-creates user account if first-time login

3. **Password Reset**:
   - Email OTP verification before allowing new password

**Flow Diagram**:
```
User Registration Flow:
1. User provides name, email, password
2. System sends OTP to email
3. User verifies OTP
4. Account created, JWT token issued
5. Token stored in localStorage

Login Flow:
1. User provides email + password
2. Credentials validated
3. JWT token generated (expires in 7 days)
4. Token stored locally
5. Axios interceptor adds token to all requests

Protected Routes:
1. React component checks if token exists
2. If no token, redirect to login
3. If token exists, route accessible
4. Token sent in Authorization header for API calls
```

**Security Considerations**:
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT expires in 7 days
- OTP expires in 5 minutes
- Email verification prevents unauthorized email access
---


##  Future Improvements

### **Feature Enhancements**

1. **Event Recommendations Engine**
   - ML-based recommendations based on user browsing/bookmark history
   - Personalized event feed

2. **Real-time Notifications**
   - WebSocket integration for real-time event updates
   - Push notifications when bookmarked events are about to start

3. **Event Ticketing System**
   - Ticket generation and management
   - QR code-based check-in system
   - Payment integration (Stripe/PayPal)

4. **Calendar Integration**
   - Export events to Google Calendar, Outlook
   - iCal format support

5. **User Reviews & Ratings**
   - Rate events after attending
   - User-generated reviews
   - Average rating display

6. **Event Analytics**
   - Organizer dashboard with event statistics
   - Attendee engagement metrics
   - Traffic and conversion analytics


7. **Event Series/Recurring Events**
   - Support for recurring events (weekly, monthly, etc.)
   - Series management for organizers

---

### **Scalability Improvements**

1. **Database Optimization**
   - Implement connection pooling for MongoDB
   - Add read replicas for high-traffic queries
   - Implement database sharding by geography
   - **Impact**: 10x query performance improvement

2. **Caching Layer**
   - Redis for frequently accessed data (popular events, categories)
   - Cache query results for expensive filters
   - Cache user bookmarks
   - **Impact**: 50% reduction in database load

3. **Content Delivery**
   - CDN for static assets and images
   - Implement CloudFlare for DDoS protection
   - Geographic distribution of assets
   - **Impact**: 70% faster load times globally

4. **Horizontal Scaling**
   - Load balancer for multiple backend instances
   - Docker containerization for easy deployment
   - Kubernetes orchestration for auto-scaling
   - **Impact**: Handle 10x user growth

5. **Search Optimization**
   - Implement Elasticsearch for full-text search
   - Fuzzy search for typo tolerance
   - Search autocomplete/suggestions
   - **Impact**: Sub-second search response times

6. **Session Management**
   - Redis-based session store
   - Distributed session handling
   - **Impact**: Support multiple backend instances

---

### **Security Enhancements**

1. **API Rate Limiting**
   - Implement rate limiting by IP/user
   - Prevent brute force attacks
   - Prevent API scraping
   - **Tool**: express-rate-limit

2. **Input Sanitization**
   - Sanitize all user inputs to prevent XSS
   - SQL/NoSQL injection prevention
   - **Tool**: DOMPurify, Joi schema validation

3. **HTTPS Everywhere**
   - Force HTTPS on all connections
   - Implement HSTS headers
   - SSL certificate management


5. **Two-Factor Authentication (2FA)**
   - TOTP/SMS-based 2FA option
   - Backup codes for recovery

## Assumptions
- All users have a valid email address for OTP verification
- Internet connection is available for Google OAuth and map services
- Event organizers are responsible for event content accuracy
- Users can only edit or delete events created by themselves
- JWT tokens remain valid until expiration unless the user logs out
- OpenStreetMap Nominatim API availability is assumed during location searches
- MongoDB server is assumed to be properly configured and running

