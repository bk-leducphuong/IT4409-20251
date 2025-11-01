import express from 'express';
const router = express.Router();
import productController from '../controllers/product.controller.js';

// Public routes - Customer APIs

// GET /products - Lấy danh sách sản phẩm
// Query params: ?category={slug}&brand={name}&search={term}&sort_by=price_asc|price_desc|newest&page=1&limit=20
router.get('/', productController.getProducts);

// GET /products/{slug} - Lấy chi tiết sản phẩm (bao gồm tất cả variants)
router.get('/:slug', productController.getProductBySlug);

export default router;
