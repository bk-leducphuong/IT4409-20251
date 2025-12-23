import express from 'express';
const router = express.Router();
import productController from '../controllers/product.controller.js';
import reviewController from '../controllers/review.controller.js';
import { requireLogin } from '../middlewares/auth.middleware.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product name
 *         slug:
 *           type: string
 *           description: URL-friendly product identifier
 *         description:
 *           type: string
 *           description: Product description
 *         category_id:
 *           type: string
 *           description: Category ID
 *         brand_id:
 *           type: string
 *           description: Brand ID
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductVariant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Variant ID
 *         product_id:
 *           type: string
 *           description: Product ID
 *         sku:
 *           type: string
 *           description: Stock Keeping Unit
 *         price:
 *           type: number
 *           description: Current price
 *         original_price:
 *           type: number
 *           description: Original price (before discount)
 *         stock_quantity:
 *           type: number
 *           description: Available stock quantity
 *         main_image_url:
 *           type: string
 *           description: Main product image URL
 *         attributes:
 *           type: object
 *           description: Variant attributes (e.g., RAM, Storage, Color)
 *           example: { "RAM": "16GB", "Storage": "512GB", "Color": "Silver" }
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ProductWithVariants:
 *       allOf:
 *         - $ref: '#/components/schemas/Product'
 *         - type: object
 *           properties:
 *             variants:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductVariant'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get list of products with filters and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category slug
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand name
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest]
 *           default: newest
 *         description: Sort products by price or date
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
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       400:
 *         description: Invalid query parameters
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/trending:
 *   get:
 *     summary: Get trending products calculated from recent sales
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items to return
 *     responses:
 *       200:
 *         description: Trending products with scores
 */
router.get('/trending', productController.getTrendingProducts);

/**
 * @swagger
 * /api/products/{slug}:
 *   get:
 *     summary: Get product details by slug (including all variants)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     responses:
 *       200:
 *         description: Product details with all variants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProductWithVariants'
 *       404:
 *         description: Product not found
 */
router.get('/:slug', productController.getProductBySlug);

/**
 * @swagger
 * /api/products/{slug}/reviews:
 *   get:
 *     summary: Get reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by rating
 *       - in: query
 *         name: verified_only
 *         schema:
 *           type: boolean
 *         description: Show only verified purchases
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [newest, helpful, rating_high, rating_low]
 *           default: newest
 *         description: Sort reviews
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
 *     responses:
 *       200:
 *         description: List of reviews with statistics
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
 *                     reviews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *                     statistics:
 *                       $ref: '#/components/schemas/RatingStatistics'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *       404:
 *         description: Product not found
 */
router.get('/:slug/reviews', reviewController.getProductReviews);

/**
 * @swagger
 * /api/products/{slug}/reviews:
 *   post:
 *     summary: Add a review for a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *         description: Invalid input or user already reviewed
 *       404:
 *         description: Product not found
 */
router.post('/:slug/reviews', requireLogin, reviewController.addReview);

export default router;
