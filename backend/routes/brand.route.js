import express from 'express';
const router = express.Router();
import brandController from '../controllers/brand.controller.js';

// Public routes - Customer APIs

// GET /brands - Lấy danh sách tất cả thương hiệu
router.get('/', brandController.getBrands);

// GET /brands/{id} - Lấy chi tiết thương hiệu
router.get('/:id', brandController.getBrandById);

export default router;
