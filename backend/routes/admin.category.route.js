import express from 'express';
const router = express.Router();
import adminCategoryController from '../controllers/admin.category.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// Admin routes - Quản lý danh mục
const adminAuth = [requireLogin, requireRole('admin')];

/**
 * @swagger
 * /api/admin/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: Laptops
 *               slug:
 *                 type: string
 *                 maxLength: 100
 *                 example: laptops
 *               parent_category_id:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *                 description: Parent category ID (null for root categories)
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input or slug already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/categories', adminAuth, adminCategoryController.createCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               slug:
 *                 type: string
 *                 maxLength: 100
 *               parent_category_id:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 */
router.put('/categories/:id', adminAuth, adminCategoryController.updateCategory);

/**
 * @swagger
 * /api/admin/categories/{id}:
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Admin - Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 */
router.delete('/categories/:id', adminAuth, adminCategoryController.deleteCategory);

export default router;
