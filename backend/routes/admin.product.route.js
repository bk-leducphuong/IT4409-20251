import express from 'express';
const router = express.Router();
import adminProductController from '../controllers/admin.product.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// Admin routes - Tất cả routes cần authentication và role admin
const adminAuth = [requireLogin, requireRole('admin')];

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Admin - Products]
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
 *               - category_id
 *               - brand_id
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: MacBook Pro 16"
 *               slug:
 *                 type: string
 *                 maxLength: 255
 *                 example: macbook-pro-16
 *               description:
 *                 type: string
 *                 example: High-performance laptop for professionals
 *               category_id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               brand_id:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input or slug already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/products', adminAuth, adminProductController.createProduct);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *               slug:
 *                 type: string
 *                 maxLength: 255
 *               description:
 *                 type: string
 *               category_id:
 *                 type: string
 *               brand_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 */
router.put('/products/:id', adminAuth, adminProductController.updateProduct);

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Delete a product (cascades to variants and images) (Admin only)
 *     tags: [Admin - Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
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
 *         description: Product not found
 */
router.delete('/products/:id', adminAuth, adminProductController.deleteProduct);

/**
 * @swagger
 * /api/admin/products/{id}/variants:
 *   post:
 *     summary: Create a new variant for a product (Admin only)
 *     tags: [Admin - Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *               - price
 *               - stock_quantity
 *               - main_image_url
 *             properties:
 *               sku:
 *                 type: string
 *                 maxLength: 100
 *                 example: MBP16-512-SLV
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 2499.99
 *               original_price:
 *                 type: number
 *                 minimum: 0
 *                 example: 2799.99
 *               stock_quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 50
 *               main_image_url:
 *                 type: string
 *                 example: https://example.com/images/mbp-silver.jpg
 *               attributes:
 *                 type: object
 *                 example: { "RAM": "16GB", "Storage": "512GB", "Color": "Silver" }
 *     responses:
 *       201:
 *         description: Variant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Invalid input or SKU already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 */
router.post('/products/:id/variants', adminAuth, adminProductController.createVariant);

/**
 * @swagger
 * /api/admin/variants/{variant_id}:
 *   put:
 *     summary: Update a product variant (Admin only)
 *     tags: [Admin - Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *                 maxLength: 100
 *               price:
 *                 type: number
 *                 minimum: 0
 *               original_price:
 *                 type: number
 *                 minimum: 0
 *               stock_quantity:
 *                 type: integer
 *                 minimum: 0
 *               main_image_url:
 *                 type: string
 *               attributes:
 *                 type: object
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProductVariant'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Variant not found
 */
router.put('/variants/:variant_id', adminAuth, adminProductController.updateVariant);

/**
 * @swagger
 * /api/admin/variants/{variant_id}:
 *   delete:
 *     summary: Delete a product variant (Admin only)
 *     tags: [Admin - Product Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variant_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
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
 *         description: Variant not found
 */
router.delete('/variants/:variant_id', adminAuth, adminProductController.deleteVariant);

export default router;
