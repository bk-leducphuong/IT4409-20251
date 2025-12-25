# E-Commerce Platform

A full-stack e-commerce application with React frontend and Express.js backend.

## Tech Stack

**Frontend:**

- React 19 + Vite
- Zustand (state management)
- React Router

**Backend:**

- Node.js + Express.js
- MongoDB + Mongoose
- Meilisearch (search engine)
- Redis
- Socket.io
- JWT authentication

## Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Docker (optional, for Meilisearch)

## Quick Start

### 1. Install Dependencies

```bash
# Root level
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### 2. Environment Setup

**Backend:**

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Frontend:**

```bash
cd frontend
# Create .env file with:
# VITE_API_URL=http://localhost:5001
```

### 3. Start Services

**Start MongoDB:**

```bash
# Local MongoDB
sudo systemctl start mongod  # Linux
# OR use MongoDB Atlas (cloud)
```

**Start Meilisearch (optional):**

```bash
cd backend/meilisearch
docker-compose up -d
```

### 4. Seed Database (optional)

```bash
cd backend
npm run seed:all
```

Default admin credentials:

- Email: `admin@example.com`
- Password: `admin123`

### 5. Run Application

**Backend:**

```bash
cd backend
npm run dev  # Development mode
# Server runs on http://localhost:5001
# API docs: http://localhost:5001/api-docs
```

**Frontend:**

```bash
cd frontend
npm run dev  # Development mode
# App runs on http://localhost:5173
```

## Available Scripts

**Root:**

- `npm run lint` - Lint code
- `npm run format` - Format code

**Backend:**

- `npm run dev` - Start dev server
- `npm start` - Start production server
- `npm run seed:all` - Seed database
- `npm test` - Run tests

**Frontend:**

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
├── backend/          # Express.js API
│   ├── controllers/  # Request handlers
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── server.js     # Entry point
│
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── sites/       # Page components
│   │   ├── services/    # API services
│   │   └── stores/      # Zustand stores
│   └── vite.config.js
│
└── package.json      # Root dependencies
```

## Features

- User authentication (JWT)
- Product catalog with search
- Shopping cart & checkout
- Order management
- Admin dashboard
- Product reviews
- Wishlist
- Address management

## Documentation

- [Backend README](./backend/README.md) - Detailed backend documentation
- [Frontend README](./frontend/README.md) - Frontend setup
- API Documentation: `http://localhost:5001/api-docs` (when backend is running)

## License

ISC
