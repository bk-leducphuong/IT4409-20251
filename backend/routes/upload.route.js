import express from 'express';
import UploadController from '../controllers/upload.controller.js';
import { uploadSingle, uploadMultiple } from '../middlewares/upload.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Image upload management
 */

/**
 * @swagger
 * /api/upload/products/{variantId}:
 *   post:
 *     summary: Upload multiple product images
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/products/:variantId',
  authenticateToken,
  uploadMultiple('images', 10),
  UploadController.uploadProductImages,
);

/**
 * @swagger
 * /api/upload/product/{variantId}:
 *   post:
 *     summary: Upload single product image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               sortOrder:
 *                 type: number
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/product/:variantId',
  authenticateToken,
  uploadSingle('image'),
  UploadController.uploadSingleProductImage,
);

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/avatar', authenticateToken, uploadSingle('avatar'), UploadController.uploadAvatar);

/**
 * @swagger
 * /api/upload/product-image/{imageId}:
 *   delete:
 *     summary: Delete a product image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/product-image/:imageId', authenticateToken, UploadController.deleteProductImage);

/**
 * @swagger
 * /api/upload/product-images:
 *   delete:
 *     summary: Delete multiple product images
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Images deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/product-images', authenticateToken, UploadController.deleteProductImages);

/**
 * @swagger
 * /api/upload/products/{variantId}/images:
 *   get:
 *     summary: Get all images for a product variant
 *     tags: [Upload]
 *     parameters:
 *       - in: path
 *         name: variantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product variant ID
 *     responses:
 *       200:
 *         description: Images retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/products/:variantId/images', UploadController.getProductImagesByVariant);

/**
 * @swagger
 * /api/upload/product-image/{imageId}/sort-order:
 *   patch:
 *     summary: Update image sort order
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product image ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sortOrder:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sort order updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch(
  '/product-image/:imageId/sort-order',
  authenticateToken,
  UploadController.updateImageSortOrder,
);

/**
 * @swagger
 * /api/upload/product-image/{imageId}/alt-text:
 *   patch:
 *     summary: Update image alt text
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product image ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               altText:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alt text updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch(
  '/product-image/:imageId/alt-text',
  authenticateToken,
  UploadController.updateImageAltText,
);

/**
 * @swagger
 * /api/upload/products/{variantId}/reorder:
 *   put:
 *     summary: Reorder images for a product variant
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: variantId
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
 *             properties:
 *               imageOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     sortOrder:
 *                       type: number
 *     responses:
 *       200:
 *         description: Images reordered successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/products/:variantId/reorder', authenticateToken, UploadController.reorderImages);

export default router;
