import Order from "../models/order.js";
import Cart from "../models/cart.js";
import ProductVariant from "../models/productVariant.js";
import mongoose from "mongoose";

// Create a new order
export const createOrder = async (userId, cartId, shippingAddress, paymentMethod) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await Cart.findById(cartId).populate('items.product_variant_id').session(session);
    if (!cart || cart.user_id.toString() !== userId.toString()) {
      throw new Error('Giỏ hàng không tồn tại hoặc không hợp lệ');
    }
    if (!cart.items || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    // Kiểm tra tồn kho
    for (const item of cart.items) {
      const variant = item.product_variant_id;
      if (variant.stock != null && variant.stock < item.quantity) {
        throw new Error(`Sản phẩm ${variant._id} không đủ số lượng`);
      }
    }

    // Tính tổng tiền
    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.quantity * item.product_variant_id.price;
    });

    // Tạo order items snapshot
    const orderItems = cart.items.map(item => ({
      product_variant_id: item.product_variant_id._id,
      quantity: item.quantity,
      price: item.product_variant_id.price,
    }));

    const order = new Order({
      user_id: userId,
      items: orderItems,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
    });

    await order.save({ session });

    // Trừ tồn kho cho mỗi variant nếu có trường stock
    for (const it of orderItems) {
      await ProductVariant.findByIdAndUpdate(
        it.product_variant_id,
        { $inc: { stock: typeof it.quantity === 'number' ? -it.quantity : -Number(it.quantity) } },
        { session }
      );
    }

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || 'Không thể tạo đơn hàng');
  }
};

// Lấy danh sách đơn của user (pagination)
export const getOrdersByUser = async (userId, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;
  const orders = await Order.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));
  const total = await Order.countDocuments({ user_id: userId });
  return { data: orders, total, page: Number(page), limit: Number(limit) };
};

// Lấy đơn theo id (thêm kiểm tra quyền bên controller)
export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate('items.product_variant_id').populate('user_id', '-password -token');
  return order;
};

// Admin: Lấy tất cả đơn (filter, pagination)
export const getAllOrders = async (query = {}) => {
  const {
    page = 1,
    limit = 20,
    status,
    search // search by order id or user email/phone can be added
  } = query;
  const filter = {};
  if (status) filter.status = status;
  // basic search placeholder
  if (search) {
    filter.$or = [
      { _id: mongoose.Types.ObjectId.isValid(search) ? mongoose.Types.ObjectId(search) : null },
    ].filter(Boolean);
  }
  const skip = (page - 1) * limit;
  const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(Number(skip)).limit(Number(limit)).populate('user_id', '-password -token');
  const total = await Order.countDocuments(filter);
  return { data: orders, total, page: Number(page), limit: Number(limit) };
};

// Admin: Cập nhật trạng thái đơn (nếu cancel thì trả tồn kho)
export const updateOrderStatus = async (orderId, newStatus) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error('Đơn hàng không tồn tại');

    const prevStatus = order.status;
    order.status = newStatus;
    await order.save({ session });

    // Nếu hủy đơn và trước đó chưa hủy, trả lại tồn kho
    if (newStatus === 'cancelled' && prevStatus !== 'cancelled') {
      for (const item of order.items) {
        await ProductVariant.findByIdAndUpdate(
          item.product_variant_id,
          { $inc: { stock: item.quantity } },
          { session }
        );
      }
    }

    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || 'Không thể cập nhật trạng thái đơn');
  }
};

export default {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};