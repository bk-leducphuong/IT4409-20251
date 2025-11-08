import express from 'express';
const router = express.Router();
import cartController from '../controllers/cart.controller.js';
import { requireLogin } from '../middlewares/auth.middleware.js';

// All cart routes require authentication
router.use(requireLogin);

// GET /api/cart - Get user's current cart
router.get('/', cartController.getCart);

// POST /api/cart/items - Add item to cart
router.post('/items', cartController.addItem);

// PUT /api/cart/items/:productVariantId - Update item quantity
router.put('/items/:productVariantId', cartController.updateItemQuantity);

// DELETE /api/cart/items/:productVariantId - Remove item from cart
router.delete('/items/:productVariantId', cartController.removeItem);

export default router;
