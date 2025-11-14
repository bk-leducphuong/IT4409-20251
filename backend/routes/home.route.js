import express from 'express';
const router = express.Router();
import homeController from '../controllers/home.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// GET / - Trang chủ
router.get('/', homeController.getHome);

router.get('/dashboard', requireLogin, requireRole('admin'), homeController.getDashboard);

export default router;
