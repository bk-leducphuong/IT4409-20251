import express from 'express';
const router = express.Router();
import homeController from '../controllers/home.controller.js';

// GET / - Trang chủ
router.get('/', homeController.getHome);

export default router;
