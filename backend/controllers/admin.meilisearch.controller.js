import meilisearchService from '../services/meilisearch.service.js';

/**
 * @swagger
 * /api/admin/meilisearch/sync:
 *   post:
 *     summary: Sync all products to Meilisearch
 *     tags: [Admin - Meilisearch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products synced successfully
 *       500:
 *         description: Server error
 */
export const syncProducts = async (req, res) => {
  try {
    const result = await meilisearchService.syncAllProducts();
    
    res.status(200).json({
      success: true,
      message: 'Products synced successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @swagger
 * /api/admin/meilisearch/configure:
 *   post:
 *     summary: Configure Meilisearch index settings
 *     tags: [Admin - Meilisearch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Index configured successfully
 *       500:
 *         description: Server error
 */
export const configureIndex = async (req, res) => {
  try {
    await meilisearchService.configureIndex();
    
    res.status(200).json({
      success: true,
      message: 'Meilisearch index configured successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @swagger
 * /api/admin/meilisearch/stats:
 *   get:
 *     summary: Get Meilisearch index statistics
 *     tags: [Admin - Meilisearch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Index statistics retrieved successfully
 *       500:
 *         description: Server error
 */
export const getStats = async (req, res) => {
  try {
    const stats = await meilisearchService.getIndexStats();
    
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @swagger
 * /api/admin/meilisearch/clear:
 *   delete:
 *     summary: Clear all documents from Meilisearch index
 *     tags: [Admin - Meilisearch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Index cleared successfully
 *       500:
 *         description: Server error
 */
export const clearIndex = async (req, res) => {
  try {
    await meilisearchService.clearIndex();
    
    res.status(200).json({
      success: true,
      message: 'Meilisearch index cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  syncProducts,
  configureIndex,
  getStats,
  clearIndex,
};
