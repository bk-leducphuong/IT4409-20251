import express from 'express';
import authController from '../controllers/auth.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (không cần authentication)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (cần authentication)
// router.get('/profile', requireLogin, authController.getProfile);
router.post('/logout', requireLogin, authController.logout);

export default router;
