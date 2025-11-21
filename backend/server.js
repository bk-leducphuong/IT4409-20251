import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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

const app = express();

// Kết nối Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Admin routes
app.use('/api/admin', adminProductRoutes);
app.use('/api/admin', adminCategoryRoutes);
app.use('/api/admin', adminBrandRoutes);

const PORT = process.env.PORT || 5001;

// Start server
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
