import express from 'express';
const router = express.Router();
import wishlistController from '../controllers/wishlist.controller.js';
import { requireLogin } from '../middlewares/auth.middleware.js';

// All wishlist routes require authentication
router.use(requireLogin);

// GET /api/wishlist - Get user's wishlist
router.get('/', wishlistController.getWishlist);

// POST /api/wishlist/items - Add item to wishlist
router.post('/items', wishlistController.addItem);

// DELETE /api/wishlist/items/:productId - Remove item from wishlist
router.delete('/items/:productId', wishlistController.removeItem);

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get('/check/:productId', wishlistController.checkItem);

export default router;
