import express from 'express';
import adminMeilisearchController from '../controllers/admin.meilisearch.controller.js';
import { requireLogin, requireRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(requireLogin);
router.use(requireRole('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin - Meilisearch
 *   description: |
 *     Meilisearch management endpoints for administrators.
 */

/**
 * @swagger
 * /api/admin/meilisearch/sync:
 *   post:
 *     summary: Sync all products to Meilisearch
 *     description: Synchronizes all products from MongoDB to the Meilisearch index. This operation fetches all products with their variants, categories, and brands, formats them, and adds them to the search index in batches.
 *     tags: [Admin - Meilisearch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Products synced successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *                     count:
 *                       type: integer
 *                       example: 50
 *                       description: Number of products synced
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to sync products
 */
router.post('/meilisearch/sync', adminMeilisearchController.syncProducts);

/**
 * @swagger
 * /api/admin/meilisearch/configure:
 *   post:
 *     summary: Configure Meilisearch index settings
 *     description: |
 *       Configures the Meilisearch index with optimal settings for product search:
 *       - **Searchable attributes**: name, description, brand_name, category_name, sku
 *       - **Filterable attributes**: category_id, brand_id, price, stock_quantity, category_slug, brand_name
 *       - **Sortable attributes**: price, createdAt, name
 *       - **Ranking rules**: words, typo, proximity, attribute, sort, exactness, price:asc
 *     tags: [Admin - Meilisearch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Index configured successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Meilisearch index configured successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to configure index
 */
router.post('/meilisearch/configure', adminMeilisearchController.configureIndex);

/**
 * @swagger
 * /api/admin/meilisearch/stats:
 *   get:
 *     summary: Get Meilisearch index statistics
 *     description: Retrieves comprehensive statistics about the Meilisearch index including document count, database size, and field distribution.
 *     tags: [Admin - Meilisearch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Index statistics retrieved successfully
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
 *                     numberOfDocuments:
 *                       type: integer
 *                       example: 50
 *                       description: Total number of documents in the index
 *                     rawDocumentDbSize:
 *                       type: integer
 *                       example: 49152
 *                       description: Database size in bytes
 *                     avgDocumentSize:
 *                       type: integer
 *                       example: 975
 *                       description: Average document size in bytes
 *                     isIndexing:
 *                       type: boolean
 *                       example: false
 *                       description: Whether the index is currently processing documents
 *                     numberOfEmbeddings:
 *                       type: integer
 *                       example: 0
 *                       description: Number of embeddings
 *                     numberOfEmbeddedDocuments:
 *                       type: integer
 *                       example: 0
 *                       description: Number of documents with embeddings
 *                     fieldDistribution:
 *                       type: object
 *                       description: Distribution of fields across all documents
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         id: 50
 *                         name: 50
 *                         slug: 50
 *                         description: 50
 *                         category_id: 50
 *                         brand_id: 50
 *                         price: 50
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to get index stats
 */
router.get('/meilisearch/stats', adminMeilisearchController.getStats);

/**
 * @swagger
 * /api/admin/meilisearch/clear:
 *   delete:
 *     summary: Clear all documents from Meilisearch index
 *     description: |
 *       Removes all documents from the Meilisearch index. This operation does not delete the index itself or its settings.
 *
 *       **Warning**: This action is irreversible. All indexed products will be removed.
 *       You will need to run the sync endpoint to repopulate the index.
 *     tags: [Admin - Meilisearch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Index cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Meilisearch index cleared successfully
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Forbidden - Admin access required
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to clear index
 */
router.delete('/meilisearch/clear', adminMeilisearchController.clearIndex);

export default router;
