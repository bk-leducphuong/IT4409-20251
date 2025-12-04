import express from 'express';
const router = express.Router();
import reviewController from '../controllers/review.controller.js';
import { requireLogin } from '../middlewares/auth.middleware.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Review ID
 *         product_id:
 *           type: string
 *           description: Product ID
 *         user_id:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             fullName:
 *               type: string
 *             avatar:
 *               type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1 to 5
 *         title:
 *           type: string
 *           description: Review title
 *         comment:
 *           type: string
 *           description: Review comment
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs (max 5)
 *         helpful_count:
 *           type: number
 *           description: Number of users who found this helpful
 *         verified_purchase:
 *           type: boolean
 *           description: Whether this is from a verified purchase
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ReviewInput:
 *       type: object
 *       required:
 *         - rating
 *         - comment
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         title:
 *           type: string
 *           maxLength: 200
 *         comment:
 *           type: string
 *           maxLength: 2000
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           maxItems: 5
 *     RatingStatistics:
 *       type: object
 *       properties:
 *         averageRating:
 *           type: number
 *           description: Average rating (0-5)
 *         totalReviews:
 *           type: number
 *           description: Total number of reviews
 *         ratingDistribution:
 *           type: object
 *           properties:
 *             5:
 *               type: number
 *             4:
 *               type: number
 *             3:
 *               type: number
 *             2:
 *               type: number
 *             1:
 *               type: number
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       200:
 *         description: Review updated successfully
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
 *                     review:
 *                       $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         description: Review not found
 */
router.put('/:id', requireLogin, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       403:
 *         description: Not authorized to delete this review
 *       404:
 *         description: Review not found
 */
router.delete('/:id', requireLogin, reviewController.deleteReview);

/**
 * @swagger
 * /api/reviews/{id}/helpful:
 *   post:
 *     summary: Mark a review as helpful (or unmark if already marked)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review marked/unmarked as helpful
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
 *                     helpful_count:
 *                       type: number
 *                     is_helpful:
 *                       type: boolean
 *       404:
 *         description: Review not found
 */
router.post('/:id/helpful', requireLogin, reviewController.markReviewHelpful);

export default router;
