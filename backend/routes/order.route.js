import express from 'express';
const router = express.Router();
import orderController from '../controllers/order.controller.js';
import { requireLogin } from '../middlewares/auth.middleware.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product_variant_id:
 *           type: string
 *           description: Product variant ID
 *         product_name:
 *           type: string
 *         sku:
 *           type: string
 *         image_url:
 *           type: string
 *         attributes:
 *           type: object
 *         unit_price:
 *           type: number
 *         quantity:
 *           type: integer
 *         subtotal:
 *           type: number
 *     ShippingAddress:
 *       type: object
 *       required:
 *         - full_name
 *         - phone
 *         - address_line
 *       properties:
 *         full_name:
 *           type: string
 *           example: Nguyen Van A
 *         phone:
 *           type: string
 *           example: "0123456789"
 *         address_line:
 *           type: string
 *           example: 123 Nguyen Trai Street
 *         city:
 *           type: string
 *           example: Ho Chi Minh
 *         province:
 *           type: string
 *           example: Ho Chi Minh
 *         postal_code:
 *           type: string
 *           example: "700000"
 *         country:
 *           type: string
 *           default: Vietnam
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         order_number:
 *           type: string
 *           example: ORD-20231125-00001
 *         user_id:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *         shipping_address:
 *           $ref: '#/components/schemas/ShippingAddress'
 *         subtotal:
 *           type: number
 *         tax:
 *           type: number
 *         shipping_fee:
 *           type: number
 *         discount:
 *           type: number
 *         total:
 *           type: number
 *         payment_method:
 *           type: string
 *           enum: [cod, credit_card, bank_transfer, momo, zalopay]
 *         payment_status:
 *           type: string
 *           enum: [pending, paid, failed, refunded]
 *         tracking_number:
 *           type: string
 *         carrier:
 *           type: string
 *         customer_note:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// All order routes require authentication
router.use(requireLogin);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create order from cart (checkout)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shipping_address
 *             properties:
 *               shipping_address:
 *                 $ref: '#/components/schemas/ShippingAddress'
 *               payment_method:
 *                 type: string
 *                 enum: [cod, credit_card, bank_transfer, momo, zalopay]
 *                 default: cod
 *                 example: cod
 *               customer_note:
 *                 type: string
 *                 example: Please deliver after 5 PM
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input or empty cart
 *       401:
 *         description: Unauthorized
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's order history
 *     tags: [Orders]
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
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: Order history retrieved successfully
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
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/:orderId', orderController.getOrderDetails);

/**
 * @swagger
 * /api/orders/{orderId}/cancel:
 *   put:
 *     summary: Cancel order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Changed my mind
 *     responses:
 *       200:
 *         description: Order cancelled successfully
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
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cannot cancel order in current status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.put('/:orderId/cancel', orderController.cancelOrder);

export default router;
