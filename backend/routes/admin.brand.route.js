import express from 'express';
const router = express.Router();
import adminBrandController from '../controllers/admin.brand.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// Admin routes - Quản lý thương hiệu
const adminAuth = [requireLogin, requireRole('admin')];

/**
 * @swagger
 * /api/admin/brands:
 *   post:
 *     summary: Create a new brand (Admin only)
 *     tags: [Admin - Brands]
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
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *                 example: Apple
 *               logo_url:
 *                 type: string
 *                 nullable: true
 *                 example: https://example.com/logos/apple.png
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Invalid input or brand already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/brands', adminAuth, adminBrandController.createBrand);

/**
 * @swagger
 * /api/admin/brands/{id}:
 *   put:
 *     summary: Update a brand (Admin only)
 *     tags: [Admin - Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
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
 *               logo_url:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Brand not found
 */
router.put('/brands/:id', adminAuth, adminBrandController.updateBrand);

/**
 * @swagger
 * /api/admin/brands/{id}:
 *   delete:
 *     summary: Delete a brand (Admin only)
 *     tags: [Admin - Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
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
 *         description: Brand not found
 */
router.delete('/brands/:id', adminAuth, adminBrandController.deleteBrand);

export default router;
