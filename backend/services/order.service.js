import Order from '../models/order.js';
import Cart from '../models/cart.js';
import ProductVariant from '../models/productVariant.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import Coupon from '../models/coupon.js';
import emailService from '../libs/email.js';

// Tax rate (10% VAT in Vietnam)
const TAX_RATE = 0.1;

// Shipping fee calculation (can be made more sophisticated)
const calculateShippingFee = (subtotal) => {
  if (subtotal >= 500000) return 0; // Free shipping over 500k VND
  return 30000; // Flat 30k VND shipping fee
};

// Create order from cart (checkout)
export const createOrderFromCart = async (userId, orderData) => {
  try {
    const { shipping_address, payment_method, customer_note } = orderData;

    // Validate shipping address
    if (
      !shipping_address ||
      !shipping_address.full_name ||
      !shipping_address.phone ||
      !shipping_address.address_line
    ) {
      throw new Error('Vui lòng cung cấp đầy đủ thông tin giao hàng');
    }

    // Get user's cart
    const cart = await Cart.findOne({ user_id: userId }).populate({
      path: 'items.product_variant_id',
      populate: {
        path: 'product_id',
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    // Prepare order items with product snapshots
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const variant = cartItem.product_variant_id;
      const product = variant.product_id;

      // Verify stock availability
      if (variant.stock_quantity < cartItem.quantity) {
        throw new Error(`Sản phẩm ${product.name} không đủ số lượng trong kho`);
      }

      // Calculate item subtotal
      const itemSubtotal = variant.price * cartItem.quantity;
      subtotal += itemSubtotal;

      // Create order item with snapshot
      orderItems.push({
        product_variant_id: variant._id,
        product_name: product.name,
        product_slug: product.slug,
        sku: variant.sku,
        image_url: variant.main_image_url,
        attributes: variant.attributes,
        unit_price: variant.price,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      });

      // Reduce stock quantity
      variant.stock_quantity -= cartItem.quantity;
      await variant.save();
    }

    // Calculate totals
    const tax = Math.round(subtotal * TAX_RATE);
    let shipping_fee = calculateShippingFee(subtotal);
    let discount = 0;
    let couponData = null;

    // Handle coupon if applied
    if (cart.applied_coupon && cart.applied_coupon.coupon_id) {
      const coupon = await Coupon.findById(cart.applied_coupon.coupon_id);

      if (coupon && coupon.is_valid) {
        // Verify user can still use this coupon
        const canUse = coupon.canBeUsedBy(userId);
        if (canUse.valid) {
          // Calculate discount with current subtotal
          discount = coupon.calculateDiscount(subtotal, shipping_fee);

          // If coupon is free_shipping, set shipping_fee to 0
          if (coupon.discount_type === 'free_shipping') {
            discount = shipping_fee;
            shipping_fee = 0;
          }

          // Record coupon usage
          await coupon.recordUsage(userId);

          // Save coupon data for order
          couponData = {
            coupon_id: coupon._id,
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            discount_amount: discount,
          };
        }
      }
    }

    const total = subtotal + tax + shipping_fee - discount;

    // Create order
    const order = await Order.create({
      user_id: userId,
      items: orderItems,
      status: 'pending',
      shipping_address,
      subtotal,
      tax,
      shipping_fee,
      discount,
      coupon: couponData,
      total,
      payment_method: payment_method || 'cod',
      payment_status: payment_method === 'cod' ? 'pending' : 'pending',
      customer_note,
    });

    // Clear cart after successful order
    cart.items = [];
    cart.applied_coupon = undefined;
    await cart.save();

    // Populate order for return
    const populatedOrder = await Order.findById(order._id).populate(
      'user_id',
      'fullName email phone',
    );

    return populatedOrder;
  } catch (error) {
    throw new Error(error.message || 'Không thể tạo đơn hàng');
  }
};

// Get user's order history
export const getUserOrders = async (userId, options = {}) => {
  try {
    const { page = 1, limit = 10, status } = options;
    const skip = (page - 1) * limit;

    const query = { user_id: userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-admin_note'); // Don't show admin notes to users

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error('Không thể lấy danh sách đơn hàng: ' + error.message);
  }
};

// Get single order details
export const getOrderById = async (orderId, userId = null) => {
  try {
    const query = { _id: orderId };
    if (userId) {
      query.user_id = userId; // Only get order if it belongs to user
    }

    const order = await Order.findOne(query).populate('user_id', 'fullName email phone');

    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    return order;
  } catch (error) {
    throw new Error(error.message || 'Không thể lấy thông tin đơn hàng');
  }
};

// Cancel order (user)
export const cancelOrder = async (orderId, userId, reason = '') => {
  try {
    const order = await Order.findOne({ _id: orderId, user_id: userId });

    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    // Check if order can be cancelled
    if (!['pending', 'processing'].includes(order.status)) {
      throw new Error('Không thể hủy đơn hàng ở trạng thái này');
    }

    // Update status
    order.updateStatus('cancelled', reason || 'Hủy bởi khách hàng');
    order.cancellation_reason = reason;

    // Restore stock quantities
    for (const item of order.items) {
      await ProductVariant.findByIdAndUpdate(item.product_variant_id, {
        $inc: { stock_quantity: item.quantity },
      });
    }

    // Restore coupon usage if coupon was used
    if (order.coupon && order.coupon.coupon_id) {
      const coupon = await Coupon.findById(order.coupon.coupon_id);
      if (coupon) {
        // Decrease total usage count
        coupon.usage_count = Math.max(0, coupon.usage_count - 1);

        // Decrease user's usage count
        const userUsage = coupon.used_by.find(
          (usage) => usage.user_id.toString() === userId.toString(),
        );
        if (userUsage && userUsage.usage_count > 0) {
          userUsage.usage_count -= 1;
          // Remove user from used_by if usage_count is 0
          if (userUsage.usage_count === 0) {
            coupon.used_by = coupon.used_by.filter(
              (usage) => usage.user_id.toString() !== userId.toString(),
            );
          }
        }

        await coupon.save();
      }
    }

    await order.save();

    return order;
  } catch (error) {
    throw new Error(error.message || 'Không thể hủy đơn hàng');
  }
};

// ===== ADMIN FUNCTIONS =====

// Get all orders (admin)
export const getAllOrders = async (options = {}) => {
  try {
    const { page = 1, limit = 20, status, search, sort = '-createdAt' } = options;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by order number or customer email
    if (search) {
      const users = await User.find({
        $or: [{ email: new RegExp(search, 'i') }, { fullName: new RegExp(search, 'i') }],
      }).select('_id');

      const userIds = users.map((u) => u._id);

      query.$or = [{ order_number: new RegExp(search, 'i') }, { user_id: { $in: userIds } }];
    }

    const orders = await Order.find(query)
      .populate('user_id', 'fullName email phone')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new Error('Không thể lấy danh sách đơn hàng: ' + error.message);
  }
};

// Update order status (admin)
export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const { status, note, tracking_number, carrier } = statusData;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    // Validate status transition
    const validTransitions = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['refunded'],
      cancelled: [],
      refunded: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      throw new Error(`Không thể chuyển từ trạng thái ${order.status} sang ${status}`);
    }

    // Update status
    order.updateStatus(status, note);

    // Update tracking info if provided
    if (tracking_number) order.tracking_number = tracking_number;
    if (carrier) order.carrier = carrier;

    // Handle refund - restore stock and coupon usage
    if (status === 'refunded') {
      for (const item of order.items) {
        await ProductVariant.findByIdAndUpdate(item.product_variant_id, {
          $inc: { stock_quantity: item.quantity },
        });
      }

      // Restore coupon usage if coupon was used
      if (order.coupon && order.coupon.coupon_id) {
        const coupon = await Coupon.findById(order.coupon.coupon_id);
        if (coupon) {
          coupon.usage_count = Math.max(0, coupon.usage_count - 1);

          const userUsage = coupon.used_by.find(
            (usage) => usage.user_id.toString() === order.user_id.toString(),
          );
          if (userUsage && userUsage.usage_count > 0) {
            userUsage.usage_count -= 1;
            if (userUsage.usage_count === 0) {
              coupon.used_by = coupon.used_by.filter(
                (usage) => usage.user_id.toString() !== order.user_id.toString(),
              );
            }
          }

          await coupon.save();
        }
      }

      order.payment_status = 'refunded';
    }

    // Handle payment
    if (
      status === 'delivered' &&
      order.payment_status === 'pending' &&
      order.payment_method === 'cod'
    ) {
      order.payment_status = 'paid';
      order.paid_at = new Date();
    }

    await order.save();

    return order;
  } catch (error) {
    throw new Error(error.message || 'Không thể cập nhật trạng thái đơn hàng');
  }
};

// Get order statistics (admin)
export const getOrderStatistics = async () => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total_revenue: { $sum: '$total' },
        },
      },
    ]);

    const total_orders = await Order.countDocuments();
    const total_revenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);

    return {
      total_orders,
      total_revenue: total_revenue[0]?.total || 0,
      by_status: stats,
    };
  } catch (error) {
    throw new Error('Không thể lấy thống kê đơn hàng: ' + error.message);
  }
};

export default {
  createOrderFromCart,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStatistics,
};
