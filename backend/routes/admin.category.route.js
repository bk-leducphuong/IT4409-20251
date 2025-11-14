import express from 'express';
const router = express.Router();
import adminCategoryController from '../controllers/admin.category.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// Admin routes - Quản lý danh mục
const adminAuth = [requireLogin, requireRole('admin')];

// POST /admin/categories - Tạo danh mục mới
router.post('/categories', adminAuth, adminCategoryController.createCategory);

// PUT /admin/categories/{id} - Cập nhật danh mục
router.put('/categories/:id', adminAuth, adminCategoryController.updateCategory);

// DELETE /admin/categories/{id} - Xóa danh mục
router.delete('/categories/:id', adminAuth, adminCategoryController.deleteCategory);

export default router;
