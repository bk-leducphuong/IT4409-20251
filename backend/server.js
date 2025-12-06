import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import pinoHttp from 'pino-http';
import logger from './logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API Documentation',
      version: '1.0.0',
      description:
        'A comprehensive E-Commerce API with authentication, product management, and shopping cart functionality',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './server.js'],
};
const swaggerSpec = swaggerJSDoc(options);

import connectDB from './configs/database.js';
import homeRoutes from './routes/home.route.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js';
import brandRoutes from './routes/brand.route.js';
import cartRoutes from './routes/cart.route.js';
import wishlistRoutes from './routes/wishlist.route.js';
import adminProductRoutes from './routes/admin.product.route.js';
import adminCategoryRoutes from './routes/admin.category.route.js';
import adminBrandRoutes from './routes/admin.brand.route.js';
import orderRoutes from './routes/order.route.js';
import adminOrderRoutes from './routes/admin.order.route.js';
import reviewRoutes from './routes/review.route.js';
import uploadRoutes from './routes/upload.route.js';

const app = express();

// Kết nối Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Logger
app.use(pinoHttp({ logger }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/home', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

// Admin routes
app.use('/api/admin', adminProductRoutes);
app.use('/api/admin', adminCategoryRoutes);
app.use('/api/admin', adminBrandRoutes);
app.use('/api/admin', adminOrderRoutes);

const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
