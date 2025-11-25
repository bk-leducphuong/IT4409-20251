import express from 'express';
const router = express.Router();
import homeController from '../controllers/home.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Get home page information
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Home page data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       500:
 *         description: Server error
 */
router.get('/', homeController.getHome);

/**
 * @swagger
 * /api/home/dashboard:
 *   get:
 *     summary: Get admin dashboard data (Admin only)
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics and data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/dashboard', requireLogin, requireRole('admin'), homeController.getDashboard);

export default router;
