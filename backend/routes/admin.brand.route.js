import express from 'express';
const router = express.Router();
import adminBrandController from '../controllers/admin.brand.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// Admin routes - Quản lý thương hiệu
const adminAuth = [requireLogin, requireRole('admin')];

// POST /admin/brands - Tạo thương hiệu mới
router.post('/brands', adminAuth, adminBrandController.createBrand);

// PUT /admin/brands/{id} - Cập nhật thương hiệu
router.put('/brands/:id', adminAuth, adminBrandController.updateBrand);

// DELETE /admin/brands/{id} - Xóa thương hiệu
router.delete('/brands/:id', adminAuth, adminBrandController.deleteBrand);

export default router;
