import express from 'express';
const router = express.Router();
import adminOrderController from '../controllers/admin.order.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// All admin order routes require authentication and admin role
router.use(requireLogin);
// TODO: Uncomment when role system is implemented
// router.use(requireRole('admin'));

/**
 * @swagger
 * /api/admin/orders/statistics:
 *   get:
 *     summary: Get order statistics (admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statistics retrieved successfully
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
 *                     total_orders:
 *                       type: integer
 *                     total_revenue:
 *                       type: number
 *                     by_status:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           total_revenue:
 *                             type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/orders/statistics', adminOrderController.getOrderStatistics);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Admin - Orders]
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *         description: Filter by order status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by order number, customer name or email
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field (prefix with - for descending)
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
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
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/orders', adminOrderController.getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{orderId}:
 *   get:
 *     summary: Get order details (admin)
 *     tags: [Admin - Orders]
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
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 */
router.get('/orders/:orderId', adminOrderController.getOrderDetails);

/**
 * @swagger
 * /api/admin/orders/{orderId}/status:
 *   put:
 *     summary: Update order status (admin)
 *     tags: [Admin - Orders]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *                 example: processing
 *               note:
 *                 type: string
 *                 example: Order is being prepared
 *               tracking_number:
 *                 type: string
 *                 example: VN123456789
 *               carrier:
 *                 type: string
 *                 example: Viettel Post
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
 *         description: Invalid status or status transition not allowed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 */
router.put('/orders/:orderId/status', adminOrderController.updateOrderStatus);

/**
 * @swagger
 * /api/admin/orders/pending-payment:
 *   get:
 *     summary: Get orders pending payment (admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending payment orders retrieved successfully
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
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           order_number:
 *                             type: string
 *                           total:
 *                             type: number
 *                           reserved_until:
 *                             type: string
 *                             format: date-time
 *                           timeLeftMinutes:
 *                             type: integer
 *                           isExpired:
 *                             type: boolean
 *                           bank_transfer:
 *                             type: object
 *                             properties:
 *                               reference:
 *                                 type: string
 *                               amount:
 *                                 type: number
 */
router.get('/orders/pending-payment', adminOrderController.getPendingPaymentOrders);

/**
 * @swagger
 * /api/admin/orders/payment-monitoring:
 *   get:
 *     summary: Get payment monitoring dashboard data
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment monitoring data
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
 *                     pending_count:
 *                       type: integer
 *                     pending_amount:
 *                       type: number
 *                     expired_today:
 *                       type: integer
 *                     paid_today:
 *                       type: integer
 *                     paid_amount_today:
 *                       type: number
 */
router.get('/orders/payment-monitoring', adminOrderController.getPaymentMonitoring);

/**
 * @swagger
 * /api/admin/orders/{orderId}/confirm-payment:
 *   post:
 *     summary: Manually confirm payment (admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *                 example: MB123456789
 *               amount:
 *                 type: number
 *                 example: 52000
 *               note:
 *                 type: string
 *                 example: Xác nhận thanh toán từ screenshot
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Order already paid or invalid status
 *       404:
 *         description: Order not found
 */
router.post('/orders/:orderId/confirm-payment', adminOrderController.confirmPaymentManually);

/**
 * @swagger
 * /api/admin/orders/{orderId}/cancel-expired:
 *   post:
 *     summary: Cancel expired order (admin)
 *     tags: [Admin - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 example: Hủy do hết hạn thanh toán
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       400:
 *         description: Invalid order status
 *       404:
 *         description: Order not found
 */
router.post('/orders/:orderId/cancel-expired', adminOrderController.cancelExpiredOrder);

export default router;
