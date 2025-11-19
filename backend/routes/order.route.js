import express from 'express';
const router = express.Router();
import orderController from '../controllers/order.controller.js';
import { requireLogin } from '../middlewares/auth.middleware.js';

// POST /api/order - Create a new order
router.post('/', requireLogin, orderController.createOrder);

export default router;