import express from 'express';
const router = express.Router();
import userController from '../controllers/user.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// Protected routes (requireLogin)
router.get('/profile', requireLogin, userController.getProfile);
router.patch('/profile', requireLogin, userController.updateProfile);
router.patch('/profile/change-password', requireLogin, userController.changePassword);

// User management routes (require admin role)
router.get('/', requireLogin, requireRole('admin'), userController.getAllUsers);
router.get('/admin', requireLogin, requireRole('admin'), userController.getAdmins);
router.post('/', requireLogin, requireRole('admin'), userController.createUser);
router.get('/:id', requireLogin, requireRole('admin'), userController.getUserById);
router.patch('/:id', requireLogin, requireRole('admin'), userController.updateUserById);
router.delete('/:id', requireLogin, requireRole('admin'), userController.deleteUserById);

export default router;
