import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setSocketIO } from './utils/socketHelper.js';
import cors from 'cors';
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
import adminCouponRoutes from './routes/admin.coupon.route.js';
import orderRoutes from './routes/order.route.js';
import adminOrderRoutes from './routes/admin.order.route.js';
import adminDashboardRoutes from './routes/admin.dashboard.route.js';
import adminMeilisearchRoutes from './routes/admin.meilisearch.route.js';
import reviewRoutes from './routes/review.route.js';
import webHookRoutes from './routes/webhook.route.js';

// 🆕 Import Cron Job
import startBankingCronJobs from './jobs/bankingCron.js';
import startTrendingProductsCron from './jobs/trendingProductsCron.js';
import uploadRoutes from './routes/upload.route.js';
import addressRoutes from './routes/address.route.js';

const app = express();
const httpServer = createServer(app); // 🆕 Tạo HTTP server

// ============================================
// 🆕 SOCKET.IO SETUP
// ============================================
export let io = null;

if (process.env.ENABLE_SOCKET === 'true') {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.ADMIN_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  setSocketIO(io);

  // Socket.IO Connection Handler
  io.on('connection', (socket) => {
    console.log('✅ Admin connected:', socket.id);

    // Tự động join room admin
    socket.join('admin');

    // Gửi stats khi kết nối
    socket.emit('connection:success', {
      message: 'Connected to server',
      timestamp: new Date(),
    });

    socket.on('disconnect', () => {
      console.log('❌ Admin disconnected:', socket.id);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  console.log('🔌 Socket.IO enabled');
}

// Kết nối Database
connectDB();

// ============================================
// MIDDLEWARE
// ============================================
// Webhook route
app.use('/api/webhooks', webHookRoutes);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(pinoHttp({ logger }));

// ============================================
// ROUTES
// ============================================
// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/home', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user/addresses', addressRoutes);
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
app.use('/api/admin/coupons', adminCouponRoutes);
app.use('/api/admin', adminOrderRoutes);
app.use('/api/admin', adminDashboardRoutes);
app.use('/api/admin', adminMeilisearchRoutes);

// ============================================
// 🆕 CRON JOBS
// ============================================
if (process.env.ENABLE_BANKING_CRON === 'true') {
  startBankingCronJobs();
  console.log('⏰ Banking cron jobs enabled');
}

if (process.env.ENABLE_TRENDING_CRON === 'true') {
  startTrendingProductsCron();
  console.log('⏰ Trending products cron enabled');
}

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log(`✅ Server listening on 0.0.0.0:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`📡 Webhook: http://localhost:${PORT}/api/webhooks/banking/mb`);

  if (io) console.log(`🔌 Socket.IO: Enabled`);
  if (process.env.ENABLE_BANKING_CRON === 'true') {
    console.log(`⏰ Cron Jobs: Enabled`);
  }

  console.log('='.repeat(50));
});

export default app;
