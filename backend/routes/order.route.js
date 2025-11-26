import express from 'express';
const router = express.Router();
import orderController from '../controllers/order.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';
import swaggerJSDoc from 'swagger-jsdoc';

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Order management
 *
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product_variant_id:
 *           type: string
 *           description: Product variant ObjectId
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *     ShippingAddress:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user_id:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total_amount:
 *           type: number
 *         status:
 *           type: string
 *         shipping_address:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         payment_method:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *     OrderResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             order:
 *               $ref: '#/components/schemas/Order'
 *     OrdersListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cartId, shippingAddress, paymentMethod]
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: Cart id to create order from
 *               shippingAddress:
 *                 $ref: '#/components/schemas/ShippingAddress'
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', requireLogin, orderController.createOrder);

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get orders of the authenticated user (paginated)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersListResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/', requireLogin, orderController.getMyOrders);

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get order by id
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order id
 *     responses:
 *       200:
 *         description: Order detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.get('/:id', requireLogin, orderController.getOrderById);

/**
 * @swagger
 * /api/order/admin/all:
 *   get:
 *     summary: Admin - Get all orders (filter, paginated)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: Orders list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/admin/all', requireLogin, requireRole('admin'), orderController.getAllOrders);

/**
 * @swagger
 * /api/order/{id}/status:
 *   patch:
 *     summary: Admin - Update order status
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.patch('/:id/status', requireLogin, requireRole('admin'), orderController.updateOrderStatus);

export default router;