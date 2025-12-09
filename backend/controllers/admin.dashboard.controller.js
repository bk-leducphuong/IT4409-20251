import dashboardService from '../services/admin.dashboard.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

/**
 * GET /api/admin/dashboard/stats
 * Get comprehensive dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await dashboardService.getDashboardStats({
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

/**
 * GET /api/admin/dashboard/sales
 * Get sales analytics with time-based grouping
 */
export const getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;

    // Validate groupBy parameter
    const validGroupBy = ['daily', 'weekly', 'monthly'];
    if (groupBy && !validGroupBy.includes(groupBy)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid groupBy parameter. Must be one of: daily, weekly, monthly',
      });
    }

    const analytics = await dashboardService.getSalesAnalytics({
      startDate,
      endDate,
      groupBy,
    });

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

/**
 * GET /api/admin/dashboard/top-products
 * Get top selling products
 */
export const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit, sortBy } = req.query;

    // Validate sortBy parameter
    const validSortBy = ['revenue', 'quantity'];
    if (sortBy && !validSortBy.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sortBy parameter. Must be one of: revenue, quantity',
      });
    }

    // Validate limit parameter
    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be a number between 1 and 100',
      });
    }

    const topProducts = await dashboardService.getTopProducts({
      startDate,
      endDate,
      limit,
      sortBy,
    });

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  getDashboardStats,
  getSalesAnalytics,
  getTopProducts,
};
