import express from 'express';
const router = express.Router();
import productController from '../controllers/product.controller.js';

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

export default router;
