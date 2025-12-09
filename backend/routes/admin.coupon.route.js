import express from 'express';
const router = express.Router();
import adminCouponController from '../controllers/admin.coupon.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Coupon:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Coupon ID
 *         code:
 *           type: string
 *           description: Coupon code (uppercase)
 *           example: SUMMER2024
 *         description:
 *           type: string
 *           description: Description of the coupon
 *           example: Summer sale - 20% off
 *         discount_type:
 *           type: string
 *           enum: [percentage, fixed_amount, free_shipping]
 *           description: Type of discount
 *         discount_value:
 *           type: number
 *           description: Discount value (percentage or fixed amount)
 *         max_discount_amount:
 *           type: number
 *           description: Maximum discount amount (for percentage discounts)
 *         min_order_value:
 *           type: number
 *           description: Minimum order value required
 *           default: 0
 *         usage_limit:
 *           type: number
 *           description: Total usage limit across all users
 *         usage_limit_per_user:
 *           type: number
 *           description: Usage limit per user
 *           default: 1
 *         usage_count:
 *           type: number
 *           description: Current usage count
 *         is_active:
 *           type: boolean
 *           description: Whether the coupon is active
 *           default: true
 *         valid_from:
 *           type: string
 *           format: date-time
 *           description: Valid from date
 *         valid_until:
 *           type: string
 *           format: date-time
 *           description: Valid until date (expiration)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// All coupon routes require authentication and admin privileges
router.use(requireLogin);
router.use(requireRole('admin'));

/**
 * @swagger
 * /api/admin/coupons:
 *   post:
 *     summary: Create a new coupon (admin only)
 *     tags: [Admin - Coupons]
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
 *               - description
 *               - discount_type
 *               - valid_until
 *             properties:
 *               code:
 *                 type: string
 *                 description: Coupon code (will be converted to uppercase)
 *                 example: SUMMER2024
 *               description:
 *                 type: string
 *                 description: Description of the coupon
 *                 example: Summer sale - 20% off all items
 *               discount_type:
 *                 type: string
 *                 enum: [percentage, fixed_amount, free_shipping]
 *                 description: Type of discount
 *                 example: percentage
 *               discount_value:
 *                 type: number
 *                 description: Discount value (required for percentage and fixed_amount)
 *                 example: 20
 *               max_discount_amount:
 *                 type: number
 *                 description: Maximum discount amount (optional, for percentage discounts)
 *                 example: 100000
 *               min_order_value:
 *                 type: number
 *                 description: Minimum order value required
 *                 example: 500000
 *                 default: 0
 *               usage_limit:
 *                 type: number
 *                 description: Total usage limit across all users (null for unlimited)
 *                 example: 100
 *               usage_limit_per_user:
 *                 type: number
 *                 description: Usage limit per user
 *                 example: 1
 *                 default: 1
 *               is_active:
 *                 type: boolean
 *                 description: Whether the coupon is active
 *                 default: true
 *               valid_from:
 *                 type: string
 *                 format: date-time
 *                 description: Valid from date (defaults to now)
 *               valid_until:
 *                 type: string
 *                 format: date-time
 *                 description: Valid until date (required)
 *                 example: 2024-12-31T23:59:59.000Z
 *     responses:
 *       201:
 *         description: Coupon created successfully
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
 *                       $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Invalid input or coupon code already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/', adminCouponController.createCoupon);

/**
 * @swagger
 * /api/admin/coupons:
 *   get:
 *     summary: Get all coupons with filters (admin only)
 *     tags: [Admin - Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: discount_type
 *         schema:
 *           type: string
 *           enum: [percentage, fixed_amount, free_shipping]
 *         description: Filter by discount type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by code or description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort order (e.g., -createdAt, code, valid_until)
 *     responses:
 *       200:
 *         description: List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupons:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Coupon'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/', adminCouponController.getCoupons);

/**
 * @swagger
 * /api/admin/coupons/{id}:
 *   get:
 *     summary: Get coupon by ID (admin only)
 *     tags: [Admin - Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupon:
 *                       $ref: '#/components/schemas/Coupon'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Coupon not found
 */
router.get('/:id', adminCouponController.getCouponById);

/**
 * @swagger
 * /api/admin/coupons/{id}/stats:
 *   get:
 *     summary: Get coupon statistics (admin only)
 *     tags: [Admin - Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Coupon not found
 */
router.get('/:id/stats', adminCouponController.getCouponStats);

/**
 * @swagger
 * /api/admin/coupons/{id}:
 *   put:
 *     summary: Update coupon (admin only)
 *     tags: [Admin - Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               discount_type:
 *                 type: string
 *                 enum: [percentage, fixed_amount, free_shipping]
 *               discount_value:
 *                 type: number
 *               max_discount_amount:
 *                 type: number
 *               min_order_value:
 *                 type: number
 *               usage_limit:
 *                 type: number
 *               usage_limit_per_user:
 *                 type: number
 *               is_active:
 *                 type: boolean
 *               valid_from:
 *                 type: string
 *                 format: date-time
 *               valid_until:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Coupon updated successfully
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
 *                       $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Coupon not found
 */
router.put('/:id', adminCouponController.updateCoupon);

/**
 * @swagger
 * /api/admin/coupons/{id}:
 *   delete:
 *     summary: Delete coupon (admin only)
 *     tags: [Admin - Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Coupon not found
 */
router.delete('/:id', adminCouponController.deleteCoupon);

export default router;
