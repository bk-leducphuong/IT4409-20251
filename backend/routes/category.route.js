import express from 'express';
const router = express.Router();
import categoryController from '../controllers/category.controller.js';

// Public routes - Customer APIs

// GET /categories - Lấy danh sách tất cả danh mục
router.get('/', categoryController.getCategories);

// GET /categories/{slug} - Lấy chi tiết danh mục theo slug
router.get('/:slug', categoryController.getCategoryBySlug);

export default router;
