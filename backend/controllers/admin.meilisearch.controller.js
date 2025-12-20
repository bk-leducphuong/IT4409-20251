import meilisearchService from '../services/meilisearch.service.js';

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
