import orderService from '../services/order.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// POST /api/order - Create a new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartId, shippingAddress, paymentMethod } = req.body;
    if (!cartId || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin đơn hàng' });
    }
    const order = await orderService.createOrder(userId, cartId, shippingAddress, paymentMethod);
    res.status(201).json({ success: true, message: 'Đơn hàng đã được tạo thành công', data: { order } });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/order - Lấy danh sách đơn của user
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await orderService.getOrdersByUser(userId, req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/order/:id - Lấy đơn theo id (user chỉ được xem đơn của mình)
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });

    // nếu không phải admin thì kiểm tra quyền sở hữu
    if (String(order.user_id._id || order.user_id) !== String(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Không có quyền xem đơn này' });
    }
    res.json({ success: true, data: { order } });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/order/admin - Admin lấy tất cả đơn
export const getAllOrders = async (req, res) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// PATCH /api/order/:id/status - Admin cập nhật trạng thái đơn
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Vui lòng cung cấp status mới' });
    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Status không hợp lệ' });

    const order = await orderService.updateOrderStatus(orderId, status);
    res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: { order } });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};