import orderService from '../services/order.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// POST /api/order - Create a new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartId, shippingAddress, paymentMethod } = req.body;
    // Validation
    if (!cartId || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin đơn hàng',
      });
    }
    const order = await orderService.createOrder(userId, cartId, shippingAddress, paymentMethod);

    res.status(201).json({
        success: true,
        message: 'Đơn hàng đã được tạo thành công',
        data: { order },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  createOrder,
};