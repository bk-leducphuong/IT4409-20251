import express from 'express';
const router = express.Router();
import adminDashboardController from '../controllers/admin.dashboard.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

// All admin dashboard routes require authentication and admin role
router.use(requireLogin);
// TODO: Uncomment when role system is implemented
// router.use(requireRole('admin'));

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get comprehensive dashboard statistics
 *     description: Returns sales statistics, revenue reports, user statistics, and order analytics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (ISO 8601 format)
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (ISO 8601 format)
 *         example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     revenue:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                           example: 15000000
 *                         orders_count:
 *                           type: integer
 *                           example: 150
 *                         average_order_value:
 *                           type: number
 *                           example: 100000
 *                     orders:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 200
 *                         by_status:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               status:
 *                                 type: string
 *                               count:
 *                                 type: integer
 *                               total_amount:
 *                                 type: number
 *                         pending:
 *                           type: integer
 *                           example: 25
 *                         recent_7_days:
 *                           type: integer
 *                           example: 45
 *                     users:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 500
 *                         active_customers:
 *                           type: integer
 *                           example: 450
 *                         new_this_month:
 *                           type: integer
 *                           example: 50
 *                     products:
 *                       type: object
 *                       properties:
 *                         total_products:
 *                           type: integer
 *                           example: 100
 *                         total_variants:
 *                           type: integer
 *                           example: 250
 *                         low_stock:
 *                           type: integer
 *                           example: 15
 *                         out_of_stock:
 *                           type: integer
 *                           example: 5
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/dashboard/stats', adminDashboardController.getDashboardStats);

/**
 * @swagger
 * /api/admin/dashboard/sales:
 *   get:
 *     summary: Get sales analytics with time-based grouping
 *     description: Returns detailed sales data grouped by day, week, or month
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering (defaults to 30 days ago)
 *         example: "2024-11-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering (defaults to today)
 *         example: "2024-12-01"
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: daily
 *         description: How to group the sales data
 *         example: "daily"
 *     responses:
 *       200:
 *         description: Sales analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     period:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                           format: date-time
 *                         end:
 *                           type: string
 *                           format: date-time
 *                         groupBy:
 *                           type: string
 *                           example: "daily"
 *                     summary:
 *                       type: object
 *                       properties:
 *                         total_sales:
 *                           type: number
 *                           example: 10000000
 *                         total_orders:
 *                           type: integer
 *                           example: 100
 *                         total_items_sold:
 *                           type: integer
 *                           example: 250
 *                         average_order_value:
 *                           type: number
 *                           example: 100000
 *                     sales_data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: object
 *                           total_sales:
 *                             type: number
 *                           order_count:
 *                             type: integer
 *                           average_order_value:
 *                             type: number
 *                           total_items_sold:
 *                             type: integer
 *                     payment_methods:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           method:
 *                             type: string
 *                           count:
 *                             type: integer
 *                           total_amount:
 *                             type: number
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/dashboard/sales', adminDashboardController.getSalesAnalytics);

/**
 * @swagger
 * /api/admin/dashboard/top-products:
 *   get:
 *     summary: Get top selling products
 *     description: Returns list of best-selling products with sales metrics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *         example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *         example: "2024-12-31"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *         description: Number of products to return
 *         example: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [revenue, quantity]
 *           default: revenue
 *         description: Sort products by revenue or quantity sold
 *         example: "revenue"
 *     responses:
 *       200:
 *         description: Top products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     top_products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: string
 *                           product_slug:
 *                             type: string
 *                           product_name:
 *                             type: string
 *                           category:
 *                             type: string
 *                           brand:
 *                             type: string
 *                           total_quantity_sold:
 *                             type: integer
 *                           total_revenue:
 *                             type: number
 *                           order_count:
 *                             type: integer
 *                           average_price:
 *                             type: number
 *                           image_url:
 *                             type: string
 *                     top_variants:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           variant_id:
 *                             type: string
 *                           product_name:
 *                             type: string
 *                           sku:
 *                             type: string
 *                           attributes:
 *                             type: object
 *                           total_quantity_sold:
 *                             type: integer
 *                           total_revenue:
 *                             type: number
 *                           image_url:
 *                             type: string
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/dashboard/top-products', adminDashboardController.getTopProducts);

export default router;
