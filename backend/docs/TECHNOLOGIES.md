# Backend Technologies Stack

## Core Framework & Runtime

| Technology     | Version    | Purpose                         |
| -------------- | ---------- | ------------------------------- |
| **Node.js**    | Latest LTS | JavaScript runtime environment  |
| **Express.js** | 5.1.0      | Web application framework       |
| **ES Modules** | Native     | Modern JavaScript module system |

## Database & Data Storage

| Technology   | Version  | Purpose                         |
| ------------ | -------- | ------------------------------- |
| **MongoDB**  | 7.0      | Primary NoSQL database          |
| **Mongoose** | 8.19.1   | MongoDB object modeling (ODM)   |
| **Redis**    | 7-alpine | In-memory cache & session store |
| **ioredis**  | 5.8.2    | Redis client for Node.js        |

## Search Engine

| Technology      | Version | Purpose                        |
| --------------- | ------- | ------------------------------ |
| **Meilisearch** | v1.16   | Full-text search engine        |
| **meilisearch** | 0.54.0  | Node.js client for Meilisearch |

## Authentication & Security

| Technology        | Version  | Purpose                           |
| ----------------- | -------- | --------------------------------- |
| **jsonwebtoken**  | 9.0.2    | JWT token generation & validation |
| **bcryptjs**      | 3.0.2    | Password hashing                  |
| **cookie-parser** | 1.4.7    | Cookie parsing middleware         |
| **validator**     | 13.15.15 | Input validation & sanitization   |

## Real-time Communication

| Technology           | Version | Purpose                               |
| -------------------- | ------- | ------------------------------------- |
| **Socket.IO**        | 4.8.1   | Real-time bidirectional communication |
| **socket.io-client** | 4.8.1   | Socket.IO client library              |

## File Upload & Image Processing

| Technology | Version | Purpose                           |
| ---------- | ------- | --------------------------------- |
| **Multer** | 2.0.2   | File upload middleware            |
| **Sharp**  | 0.34.5  | High-performance image processing |

## Background Jobs & Scheduling

| Technology    | Version | Purpose                     |
| ------------- | ------- | --------------------------- |
| **node-cron** | 4.2.1   | Task scheduling & cron jobs |

## Email & Communication

| Technology     | Version | Purpose              |
| -------------- | ------- | -------------------- |
| **Nodemailer** | 7.0.11  | Email sending (SMTP) |

## HTTP & API

| Technology | Version | Purpose                         |
| ---------- | ------- | ------------------------------- |
| **Axios**  | 1.13.2  | HTTP client for external APIs   |
| **CORS**   | 2.8.5   | Cross-Origin Resource Sharing   |
| **dotenv** | 17.2.3  | Environment variable management |

## API Documentation

| Technology             | Version | Purpose                          |
| ---------------------- | ------- | -------------------------------- |
| **Swagger JSDoc**      | 6.2.8   | API documentation generation     |
| **Swagger UI Express** | 5.0.1   | Interactive API documentation UI |

## Logging & Monitoring

| Technology      | Version | Purpose                      |
| --------------- | ------- | ---------------------------- |
| **Pino**        | 10.1.0  | Fast JSON logger             |
| **pino-http**   | 11.0.0  | HTTP request logging         |
| **pino-pretty** | 13.1.2  | Pretty print for development |

## QR Code Generation

| Technology     | Version  | Purpose                     |
| -------------- | -------- | --------------------------- |
| **qrcode**     | 1.5.4    | QR code generation          |
| **VietQR API** | External | Vietnamese banking QR codes |

## Web Scraping

| Technology  | Version | Purpose                                |
| ----------- | ------- | -------------------------------------- |
| **Cheerio** | 1.1.2   | Server-side HTML parsing (jQuery-like) |

## Testing

| Technology        | Version | Purpose                      |
| ----------------- | ------- | ---------------------------- |
| **Jest**          | 29.7.0  | JavaScript testing framework |
| **@jest/globals** | 29.7.0  | Jest global APIs             |

## Development Tools

| Technology          | Version | Purpose                                |
| ------------------- | ------- | -------------------------------------- |
| **Nodemon**         | 3.1.10  | Auto-restart on file changes           |
| **@faker-js/faker** | 10.1.0  | Generate fake data for testing/seeding |

## Infrastructure & DevOps

| Technology         | Version | Purpose                       |
| ------------------ | ------- | ----------------------------- |
| **Docker**         | Latest  | Containerization              |
| **Docker Compose** | Latest  | Multi-container orchestration |
| **Nginx**          | Alpine  | Reverse proxy & load balancer |

## External Services & APIs

| Service              | Purpose                                   |
| -------------------- | ----------------------------------------- |
| **VietQR API**       | Generate Vietnamese banking QR codes      |
| **Banking Webhooks** | Receive payment transaction notifications |
| **SMTP Server**      | Email delivery (Gmail, custom SMTP)       |

## Technology Categories Summary

### 🎯 **Core Stack**

- Node.js + Express.js (ES Modules)
- MongoDB + Mongoose
- Redis for caching

### 🔍 **Search & Discovery**

- Meilisearch for full-text search
- Redis for trending products cache

### 🔐 **Security & Auth**

- JWT for authentication
- bcryptjs for password hashing
- Input validation

### 📡 **Real-time Features**

- Socket.IO for live updates
- Admin notifications
- Order status updates

### ⚙️ **Background Processing**

- node-cron for scheduled tasks
- Banking payment confirmation
- Trending products calculation

### 📧 **Communication**

- Nodemailer for emails
- Webhooks for external integrations

### 🖼️ **Media Handling**

- Multer for file uploads
- Sharp for image processing
- QR code generation

### 📚 **Documentation**

- Swagger/OpenAPI
- Auto-generated API docs

### 🐳 **Deployment**

- Docker containerization
- Docker Compose orchestration
- Nginx reverse proxy

### 🧪 **Testing & Development**

- Jest for unit/integration tests
- Nodemon for development
- Faker for test data

## Version Highlights

- **Express 5.x**: Latest major version with improved performance
- **Mongoose 8.x**: Latest ODM with better TypeScript support
- **Socket.IO 4.x**: Modern real-time communication
- **MongoDB 7.0**: Latest stable database version
- **Redis 7**: Latest cache version
- **Node.js**: ES Modules support (no Babel/transpilation needed)

## Architecture Patterns

- **Layered Architecture**: Routes → Controllers → Services → Models
- **RESTful API**: Standard HTTP methods and status codes
- **MVC Pattern**: Model-View-Controller separation
- **Middleware Pattern**: Request/response pipeline
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
