import orderService from '../services/order.service.js';
import emailService from '../libs/email.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// POST /api/orders - Create order from cart (checkout)
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderData = req.body;

    // Validate required fields
    if (!orderData.shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp thông tin giao hàng',
      });
    }

    const order = await orderService.createOrderFromCart(userId, orderData);

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công!',
      data: { order },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/orders - Get user's order history
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, status } = req.query;

    const result = await orderService.getUserOrders(userId, { page, limit, status });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/orders/:orderId - Get order details
export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await orderService.getOrderById(orderId, userId);

    res.status(200).json({
      success: true,
      data: { order },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// PUT /api/orders/:orderId/cancel - Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await orderService.cancelOrder(orderId, userId, reason);

    res.status(200).json({
      success: true,
      message: 'Đã hủy đơn hàng thành công',
      data: { order },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
};
