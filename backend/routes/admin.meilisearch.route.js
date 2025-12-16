import express from 'express';
import adminMeilisearchController from '../controllers/admin.meilisearch.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

/**
 * @swagger
 * tags:
 *   name: Admin - Meilisearch
 *   description: Meilisearch management endpoints for admins
 */

// POST /api/admin/meilisearch/sync - Sync all products to Meilisearch
router.post('/meilisearch/sync', adminMeilisearchController.syncProducts);

// POST /api/admin/meilisearch/configure - Configure Meilisearch index
router.post('/meilisearch/configure', adminMeilisearchController.configureIndex);

// GET /api/admin/meilisearch/stats - Get index statistics
router.get('/meilisearch/stats', adminMeilisearchController.getStats);

// DELETE /api/admin/meilisearch/clear - Clear all documents from index
router.delete('/meilisearch/clear', adminMeilisearchController.clearIndex);

export default router;
