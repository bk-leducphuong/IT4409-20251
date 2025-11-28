import orderService from '../services/order.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// GET /api/admin/orders - Get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const { page, limit, status, search, sort } = req.query;

    const result = await orderService.getAllOrders({
      page,
      limit,
      status,
      search,
      sort,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/admin/orders/:orderId - Get order details (admin)
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Admin can view any order (no userId restriction)
    const order = await orderService.getOrderById(orderId);

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// PUT /api/admin/orders/:orderId/status - Update order status (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const statusData = req.body;

    // Validate required fields
    if (!statusData.status) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp trạng thái đơn hàng',
      });
    }

    const validStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ];
    if (!validStatuses.includes(statusData.status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ',
      });
    }

    const order = await orderService.updateOrderStatus(orderId, statusData);

    res.status(200).json({
      success: true,
      message: 'Đã cập nhật trạng thái đơn hàng',
      data: { order },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/admin/orders/statistics - Get order statistics (admin)
export const getOrderStatistics = async (req, res) => {
  try {
    const stats = await orderService.getOrderStatistics();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  getOrderStatistics,
};
