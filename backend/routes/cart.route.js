import express from 'express';
const router = express.Router();
import cartController from '../controllers/cart.controller.js';
import { requireLogin } from '../middlewares/auth.middleware.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         product_variant_id:
 *           type: string
 *           description: Product variant ID
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Quantity of the item
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Cart ID
 *         user_id:
 *           type: string
 *           description: User ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// All cart routes require authentication
router.use(requireLogin);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's current cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_variant_id
 *               - quantity
 *             properties:
 *               product_variant_id:
 *                 type: string
 *                 description: Product variant ID to add
 *                 example: 507f1f77bcf86cd799439011
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity to add
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product variant not found
 */
router.post('/items', cartController.addItem);

/**
 * @swagger
 * /api/cart/items/{productVariantId}:
 *   put:
 *     summary: Update item quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productVariantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: New quantity
 *                 example: 3
 *     responses:
 *       200:
 *         description: Item quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart or item not found
 */
router.put('/items/:productVariantId', cartController.updateItemQuantity);

/**
 * @swagger
 * /api/cart/items/{productVariantId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productVariantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart or item not found
 */
router.delete('/items/:productVariantId', cartController.removeItem);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.delete('/', cartController.clearCart);

/**
 * @swagger
 * /api/cart/apply-coupon:
 *   post:
 *     summary: Apply coupon to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Coupon code to apply
 *                 example: SUMMER2024
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupon:
 *                       type: object
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid coupon or does not meet requirements
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.post('/apply-coupon', cartController.applyCoupon);

/**
 * @swagger
 * /api/cart/remove-coupon:
 *   delete:
 *     summary: Remove coupon from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Coupon removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       400:
 *         description: No coupon applied to cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.delete('/remove-coupon', cartController.removeCoupon);

export default router;
