# E-Commerce Backend API

> A comprehensive RESTful API for an e-commerce platform built with Express.js, MongoDB, and documented with Swagger/OpenAPI.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Seeding](#database-seeding)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
  - Or use **MongoDB Atlas** (cloud database) - [Sign up here](https://www.mongodb.com/cloud/atlas)

Check your installations:

```bash
node --version   # Should be v16+
npm --version    # Should be 6+
mongo --version  # Should be 4.4+ (if using local MongoDB)
```

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/it4409
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### 3. Start MongoDB

**Option A: Local MongoDB**

```bash
# Start MongoDB service
# On macOS
brew services start mongodb-community

# On Linux (Ubuntu/Debian)
sudo systemctl start mongod

# On Windows
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**

- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `.env` file

### 4. Seed the Database (Optional but Recommended)

```bash
# Seed all data at once (admin, categories, brands, products, users)
npm run seed:all

# Or seed individually
npm run seed:admin       # Create admin user
npm run seed:brands      # Add brands
npm run seed:categories  # Add categories
npm run seed:products    # Add products
npm run seed:users       # Add test users
```

**Default Admin Credentials:**

```
Email: admin@example.com
Password: admin123
```

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:

```
✅ MongoDB đã kết nối: localhost
📊 Database: it4409
Server listening at http://localhost:5000
API Docs available at http://localhost:5000/api-docs
```

---

## 📚 API Documentation

### Accessing Swagger UI

Once the server is running, open your browser and navigate to:

```
http://localhost:5000/api-docs
```

This will open an interactive API documentation where you can:

- ✅ View all available endpoints
- ✅ See request/response schemas
- ✅ Test API endpoints directly
- ✅ Understand authentication requirements

### Using the API Documentation

#### 1. **Browse Endpoints**

- All endpoints are organized by tags (Authentication, Products, Cart, etc.)
- Click on any endpoint to expand and see details

#### 2. **Test Public Endpoints**

- Endpoints like `GET /api/products` or `GET /api/categories` can be tested immediately
- Click "Try it out"
- Fill in any required parameters
- Click "Execute"
- View the response

#### 3. **Test Protected Endpoints**

Many endpoints require authentication. Here's how to test them:

**Step 1: Login**

```bash
POST /api/auth/login
```

Request body:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Step 2: Copy the Token**
From the response, copy the JWT token:

```json
{
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Step 3: Authorize in Swagger**

1. Click the green **"Authorize"** button (top right in Swagger UI)
2. In the "bearerAuth" field, enter:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ⚠️ **Important**: Include the word "Bearer" followed by a space before the token
3. Click **"Authorize"**
4. Click **"Close"**

**Step 4: Test Protected Endpoints**
Now you can test any protected endpoint (marked with a lock icon 🔒)

---

## 🗄️ Environment Setup

### Required Environment Variables

| Variable      | Description               | Example                            |
| ------------- | ------------------------- | ---------------------------------- |
| `NODE_ENV`    | Environment mode          | `development` or `production`      |
| `PORT`        | Server port               | `5000`                             |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/it4409` |
| `JWT_SECRET`  | Secret key for JWT tokens | `your_secret_key_here`             |
| `JWT_EXPIRE`  | JWT token expiration time | `7d` (7 days)                      |

### MongoDB Connection Strings

**Local MongoDB:**

```
mongodb://localhost:27017/it4409
```

**MongoDB Atlas (Cloud):**

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/it4409?retryWrites=true&w=majority
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start server with auto-reload (nodemon)

# Production
npm start                # Start server in production mode

# Database Seeding
npm run seed:all         # Seed all data (recommended)
npm run seed:admin       # Create admin user only
npm run seed:brands      # Seed brands only
npm run seed:categories  # Seed categories only
npm run seed:products    # Seed products only
npm run seed:users       # Seed test users only
npm run seed:addresses   # Seed addresses only

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# MongoDB (if using mongodb-runner)
npm run mongodb:dev:start  # Start local MongoDB instance
npm run mongodb:dev:stop   # Stop local MongoDB instance
```

---

## 🌐 API Overview

### Base URL

```
http://localhost:5000/api
```

### API Categories

#### 🔐 Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (protected)

#### 👤 User Management

- `GET /api/user/profile` - Get current user profile (protected)
- `PATCH /api/user/profile` - Update profile (protected)
- `PATCH /api/user/profile/change-password` - Change password (protected)
- `GET /api/user` - Get all users (admin only)
- `POST /api/user` - Create user (admin only)
- `GET /api/user/:id` - Get user by ID (admin only)
- `PATCH /api/user/:id` - Update user (admin only)
- `DELETE /api/user/:id` - Delete user (admin only)

#### 📍 Address Management

- `GET /api/user/addresses` - Get all addresses (protected)
- `GET /api/user/addresses/default` - Get default address (protected)
- `GET /api/user/addresses/:id` - Get address by ID (protected)
- `POST /api/user/addresses` - Create new address (protected)
- `PUT /api/user/addresses/:id` - Update address (protected)
- `PUT /api/user/addresses/:id/default` - Set default address (protected)
- `DELETE /api/user/addresses/:id` - Delete address (protected)

#### 🛍️ Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:slug` - Get product by slug

#### 📂 Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

#### 🏷️ Brands

- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get brand by ID

#### 🛒 Shopping Cart

- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/items` - Add item to cart (protected)
- `PUT /api/cart/items/:productVariantId` - Update item quantity (protected)
- `DELETE /api/cart/items/:productVariantId` - Remove item (protected)

#### 🔧 Admin - Product Management

- `POST /api/admin/products` - Create product (admin only)
- `PUT /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)
- `POST /api/admin/products/:id/variants` - Create variant (admin only)
- `PUT /api/admin/variants/:variant_id` - Update variant (admin only)
- `DELETE /api/admin/variants/:variant_id` - Delete variant (admin only)

#### 🔧 Admin - Category Management

- `POST /api/admin/categories` - Create category (admin only)
- `PUT /api/admin/categories/:id` - Update category (admin only)
- `DELETE /api/admin/categories/:id` - Delete category (admin only)

#### 🔧 Admin - Brand Management

- `POST /api/admin/brands` - Create brand (admin only)
- `PUT /api/admin/brands/:id` - Update brand (admin only)
- `DELETE /api/admin/brands/:id` - Delete brand (admin only)

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Files Location

```
backend/controllers/__test__/
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: `MongoServerError: Authentication failed`**

```bash
# Solution: Check your MongoDB credentials in .env file
MONGODB_URI=mongodb://username:password@localhost:27017/it4409
```

**Error: `MongoNetworkError: connect ECONNREFUSED`**

```bash
# Solution: Make sure MongoDB is running
# Check MongoDB status:
sudo systemctl status mongod  # Linux
brew services list             # macOS

# Start MongoDB:
sudo systemctl start mongod    # Linux
brew services start mongodb-community  # macOS
```

### Port Already in Use

**Error: `EADDRINUSE: address already in use :::5000`**

```bash
# Solution: Kill the process using port 5000
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Or use a different port in .env:
PORT=5001
```

### JWT Token Issues

**Error: `jwt malformed` or `invalid token`**

- Make sure to include "Bearer " prefix when sending token
- Check that `JWT_SECRET` is set in `.env` file
- Token may have expired (default: 7 days)

### Dependencies Installation Fails

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📞 Common Frontend Integration Examples

### Using Fetch API

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
};

// Get products with authentication
const getProducts = async (token) => {
  const response = await fetch('http://localhost:5000/api/products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};
```

### Using Axios

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

// Get products
export const getProducts = (params) => {
  return api.get('/products', { params });
};
```

---

## 📦 Project Structure

```
backend/
├── configs/
│   └── database.js         # MongoDB configuration
├── controllers/            # Request handlers
│   └── __test__/           # Unit tests
├── docs/                   # Feature documentation
│   ├── ADDRESS_MANAGEMENT.md
│   ├── ADDRESS_API_EXAMPLES.md
│   └── ADDRESS_QUICK_REFERENCE.md
├── middlewares/            # Custom middleware (auth, error handling)
├── models/                 # Mongoose schemas
├── postman/                # Postman collections
├── routes/                 # API routes (with Swagger docs)
├── seeds/                  # Database seeding scripts
├── services/               # Business logic
├── .env                    # Environment variables (create this)
├── .env.example            # Environment template
├── server.js               # Entry point
└── package.json            # Dependencies and scripts
```

---

## 🔑 Key Features

- ✅ RESTful API architecture
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin/User)
- ✅ MongoDB with Mongoose ODM
- ✅ Interactive API documentation (Swagger/OpenAPI)
- ✅ CORS enabled
- ✅ Error handling middleware
- ✅ Database seeding scripts
- ✅ Jest testing setup
- ✅ Input validation
- ✅ Address management (multiple shipping/billing addresses)
- ✅ Postman collection for API testing

---

## 📄 License

ISC

---

## 👥 For Frontend Developers

### Quick Integration Checklist

- [ ] Install and start MongoDB
- [ ] Create `.env` file with correct values
- [ ] Run `npm install`
- [ ] Run `npm run seed:all` to populate database
- [ ] Start server with `npm run dev`
- [ ] Access API docs at `http://localhost:5000/api-docs`
- [ ] Test login endpoint to get JWT token
- [ ] Use token for protected endpoints

### Important Notes for Frontend

1. **CORS is enabled** - You can make requests from any origin in development
2. **All responses follow this format:**
   ```json
   {
     "message": "Success message",
     "data": { ... }
   }
   ```
3. **Error responses:**
   ```json
   {
     "message": "Error message",
     "errors": [ ... ]  // Optional validation errors
   }
   ```
4. **Authentication**: Include token in headers:
   ```
   Authorization: Bearer <your_token_here>
   ```
5. **Pagination**: Many list endpoints support `page` and `limit` query params
6. **Filtering**: Product endpoint supports filters:
   - `?category=laptop`
   - `?brand=Apple`
   - `?search=MacBook`
   - `?sort_by=price_asc|price_desc|newest`

---

## 📖 Additional Documentation

### Address Management Feature

The backend includes a comprehensive address management system that allows users to:

- Manage multiple shipping and billing addresses
- Set default addresses
- Validate phone numbers (Vietnamese format)
- Soft delete addresses

**Documentation:**

- 📘 [Full Documentation](./docs/ADDRESS_MANAGEMENT.md) - Complete feature overview
- 📗 [API Examples](./docs/ADDRESS_API_EXAMPLES.md) - Usage examples with code
- 📙 [Quick Reference](./docs/ADDRESS_QUICK_REFERENCE.md) - Fast lookup guide
- 📦 [Postman Collection](./postman/Address_Management_API.postman_collection.json) - Ready-to-use API tests

**Quick Example:**

```javascript
// Create an address
const response = await fetch('http://localhost:5000/api/user/addresses', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'Nguyen Van A',
    phone: '0987654321',
    addressLine1: '123 Nguyen Trai',
    city: 'Thanh Xuan',
    province: 'Ha Noi',
    country: 'Vietnam',
    addressType: 'both',
  }),
});
```

## 🆘 Need Help?

- Check the [Swagger documentation](http://localhost:5000/api-docs) for detailed API specs
- Import [Postman Collection](./postman/) for quick API testing
- See feature documentation in [docs/](./docs/) folder
- Review test files in [controllers/**test**/](./controllers/__test__/) for examples

**Happy coding! 🚀**
