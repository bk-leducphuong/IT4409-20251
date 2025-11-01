import express from 'express';
const router = express.Router();
import adminProductController from '../controllers/admin.product.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// Admin routes - Tất cả routes cần authentication và role admin
const adminAuth = [requireLogin, requireRole('admin')];

// ============ Product Routes ============

// POST /admin/products - Tạo sản phẩm mới (sản phẩm gốc)
router.post('/products', adminAuth, adminProductController.createProduct);

// PUT /admin/products/{id} - Cập nhật sản phẩm gốc
router.put('/products/:id', adminAuth, adminProductController.updateProduct);

// DELETE /admin/products/{id} - Xóa sản phẩm (cascade xóa variants và images)
router.delete('/products/:id', adminAuth, adminProductController.deleteProduct);

// ============ Variant Routes ============

// POST /admin/products/{id}/variants - Thêm biến thể mới cho sản phẩm
router.post('/products/:id/variants', adminAuth, adminProductController.createVariant);

// PUT /admin/variants/{variant_id} - Cập nhật biến thể
router.put('/variants/:variant_id', adminAuth, adminProductController.updateVariant);

// DELETE /admin/variants/{variant_id} - Xóa một biến thể cụ thể
router.delete('/variants/:variant_id', adminAuth, adminProductController.deleteVariant);

export default router;
