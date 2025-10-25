import express from 'express';
const router = express.Router();
import userController from '../controllers/user.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// Protected routes (requireLogin)
router.get('/profile', requireLogin, userController.getProfile);
// router.put('/profile', requireLogin, userController.updateProfile);

// Admin routes (requireLogin + requireRole)
// router.get('/admin/users', requireLogin, requireRole('admin'), userController.getAllUsers);

export default router;