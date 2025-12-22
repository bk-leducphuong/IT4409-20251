import Order from '../models/order.js';
import Cart from '../models/cart.js';
import ProductVariant from '../models/productVariant.js';
import Product from '../models/product.js';
import User from '../models/user.js';
import Coupon from '../models/coupon.js';
import emailService from '../libs/email.js';
import { generateVietQR } from '../libs/vietqr.js';
import { emitToAdmin } from '../utils/socketHelper.js';

import mongoose from 'mongoose';

// Tax rate (10% VAT in Vietnam)
const TAX_RATE = 0.1;

// Shipping fee calculation
const calculateShippingFee = (subtotal) => {
  if (subtotal >= 500000) return 0; // Free shipping over 500k VND
  return 1; // Flat 30k VND shipping fee
};

// Create order from cart (checkout)
export const createOrderFromCart = async (userId, orderData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { shipping_address, payment_method, customer_note } = orderData;
    let qrDataUrl = null;

    // Validate shipping address
    if (
      !shipping_address ||
      !shipping_address.full_name ||
      !shipping_address.phone ||
      !shipping_address.address_line
    ) {
      throw new Error('Vui lòng cung cấp đầy đủ thông tin giao hàng');
    }

    // Load cart with session
    const cart = await Cart.findOne({ user_id: userId })
      .populate({
        path: 'items.product_variant_id',
        populate: { path: 'product_id' },
      })
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    // Prepare order items and reserve stock
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of cart.items) {
      const variantId = cartItem.product_variant_id._id;
      const needQty = cartItem.quantity;

      // Atomically decrement stock
      const updated = await ProductVariant.findOneAndUpdate(
        { _id: variantId, stock_quantity: { $gte: needQty } },
        { $inc: { stock_quantity: -needQty } },
        { new: true, session },
      ).populate('product_id');

      if (!updated) {
        throw new Error(`Sản phẩm không đủ số lượng hoặc đã hết kho`);
      }

      const product = updated.product_id;
      const itemSubtotal = updated.price * needQty;
      subtotal += itemSubtotal;

      orderItems.push({
        product_variant_id: updated._id,
        product_name: product?.name || '',
        product_slug: product?.slug || '',
        sku: updated.sku,
        image_url: updated.main_image_url,
        attributes: updated.attributes,
        unit_price: updated.price,
        quantity: needQty,
        subtotal: itemSubtotal,
      });
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

    const orderNumber = `DH${new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase()}`;

    // Create order document
    const orderDoc = new Order({
      user_id: userId,
      order_number: orderNumber,
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
      payment_status: 'pending',
      customer_note,
    });

    // Copy shipping info to top-level required fields to satisfy model validation
    orderDoc.phone = shipping_address.phone;
    orderDoc.address_line = shipping_address.address_line;
    if (shipping_address.city) orderDoc.city = shipping_address.city;
    if (shipping_address.province) orderDoc.province = shipping_address.province;
    if (shipping_address.postal_code) orderDoc.postal_code = shipping_address.postal_code;
    if (shipping_address.country) orderDoc.country = shipping_address.country;

    await orderDoc.save({ session });

    // Generate QR for bank transfer
    if ((orderDoc.payment_method || '').toLowerCase() === 'bank_transfer') {
      const expiresMinutes = parseInt(process.env.BANK_TRANSFER_EXPIRES_MINUTES || '1440', 10);
      const expiresAt = new Date(Date.now() + expiresMinutes * 60000);
      orderDoc.reserved_until = expiresAt;

      // Lấy thông tin từ env
      const payeeName = process.env.BANK_PAYEE_NAME || 'Merchant';
      const accountNumber = process.env.BANK_ACCOUNT_NUMBER || '0000000000';
      const bankBin = process.env.BANK_BIN || '970422'; // MB Bank default
      const bankName = process.env.BANK_NAME || 'MB Bank';
      const amount = total;
      const reference = orderDoc.order_number;

      try {
        // ===== SỬ DỤNG VIETQR API =====
        const qrResult = await generateVietQR({
          accountNo: accountNumber,
          accountName: payeeName,
          acqId: bankBin,
          amount: amount,
          addInfo: reference,
          template: 'compact', // 'compact', 'qr_only', 'print'
        });

        qrDataUrl = qrResult.qrDataURL; // Base64 image

        console.log('✅ VietQR generated successfully for order:', orderDoc._id);
      } catch (qrErr) {
        console.error('❌ VietQR generation error:', qrErr?.message || qrErr);
        qrDataUrl = null;
      }

      // Lưu thông tin chuyển khoản
      orderDoc.bank_transfer = {
        bank_name: bankName,
        account_name: payeeName,
        account_number: accountNumber,
        amount,
        reference,
        receipt_url: qrDataUrl || '',
      };

      await orderDoc.save({ session });
    }

    // Clear cart
    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate order for return
    const populatedOrder = await Order.findById(orderDoc._id).populate(
      'user_id',
      'fullName email phone',
    );

    return { order: populatedOrder, qr: qrDataUrl };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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

/**
 * Tự động xác nhận thanh toán (được gọi bởi cron job hoặc webhook)
 */
export const autoConfirmPayment = async (transactionData) => {
  const { transactionId, amount, description, transactionDate, bankCode = 'MB' } = transactionData;

  try {
    const referenceMatch = description.match(/DH([A-Z0-9]{8})/i);

    if (!referenceMatch) {
      return { success: false, reason: 'No reference found' };
    }

    const orderNumber = referenceMatch[0].toUpperCase();

    const order = await Order.findOne({
      order_number: orderNumber,
      payment_method: 'bank_transfer',
      payment_status: 'pending',
    });

    if (!order) {
      return { success: false, reason: 'Order not found' };
    }

    if (order.bank_transfer.transaction_id === transactionId) {
      return { success: false, reason: 'Already processed' };
    }

    const expectedAmount = order.total;
    const receivedAmount = parseFloat(amount);
    const amountDiff = Math.abs(receivedAmount - expectedAmount);

    if (amountDiff > 1) {
      // Thông báo admin về sai số tiền
      emitToAdmin('payment:mismatch', {
        orderId: order._id,
        orderNumber: order.order_number,
        expected: expectedAmount,
        received: receivedAmount,
        transactionId,
      });

      return { success: false, reason: 'Amount mismatch' };
    }

    const oldStatus = order.status;

    order.payment_status = 'paid';
    order.status = 'processing';
    order.paid_at = new Date(transactionDate);
    order.bank_transfer.transaction_id = transactionId;
    order.bank_transfer.paid_at = new Date(transactionDate);
    order.bank_transfer.paid_amount = receivedAmount;
    order.bank_transfer.bank_code = bankCode;

    order.status_history.push({
      status: 'processing',
      changed_at: new Date(),
      note: `✅ Thanh toán tự động xác nhận. Mã GD: ${transactionId}`,
    });

    await order.save();

    // Gửi thông báo real-time cho admin
    emitToAdmin('order:paid', {
      orderId: order._id,
      orderNumber: order.order_number,
      oldStatus,
      newStatus: 'processing',
      amount: receivedAmount,
      transactionId,
      customerName: order.user_id.fullName,
      timestamp: new Date(),
    });

    return {
      success: true,
      order: order.toObject(),
      message: 'Payment confirmed successfully',
    };
  } catch (error) {
    console.error('❌ Auto confirm payment error:', error);
    throw error;
  }
};

/**
 * Lấy danh sách đơn hàng chờ thanh toán
 */
export const getPendingPaymentOrders = async () => {
  try {
    const orders = await Order.find({
      payment_method: 'bank_transfer',
      payment_status: 'pending',
      status: 'pending',
    })
      .populate('user_id', 'fullName email phone')
      .sort('-createdAt')
      .limit(50);

    const ordersWithTimeLeft = orders.map((order) => {
      const timeLeft = order.reserved_until ? Math.max(0, order.reserved_until - Date.now()) : 0;

      return {
        ...order.toObject(),
        timeLeftMinutes: Math.floor(timeLeft / 60000),
        isExpired: timeLeft === 0,
      };
    });

    return ordersWithTimeLeft;
  } catch (error) {
    throw new Error('Không thể lấy danh sách đơn chờ thanh toán: ' + error.message);
  }
};

/**
 * Xác nhận thanh toán thủ công (admin)
 */
export const confirmPaymentManually = async (orderId, confirmData) => {
  try {
    const { transactionId, amount, note, confirmedBy } = confirmData;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (order.payment_status === 'paid') {
      throw new Error('Đơn hàng đã được thanh toán');
    }

    if (order.payment_method !== 'bank_transfer') {
      throw new Error('Đơn hàng không phải thanh toán chuyển khoản');
    }

    order.payment_status = 'paid';
    order.status = 'processing';
    order.paid_at = new Date();

    if (transactionId) {
      order.bank_transfer.transaction_id = transactionId;
    }
    if (amount) {
      order.bank_transfer.paid_amount = amount;
    }

    order.status_history.push({
      status: 'processing',
      changed_at: new Date(),
      note: `✅ Admin xác nhận thanh toán thủ công${note ? ': ' + note : ''}`,
    });

    await order.save();

    // Thông báo admin
    emitToAdmin('order:paid', {
      orderId: order._id,
      orderNumber: order.order_number,
      amount: amount || order.total,
      manual: true,
      timestamp: new Date(),
    });

    return order;
  } catch (error) {
    throw new Error(error.message || 'Không thể xác nhận thanh toán');
  }
};

/**
 * Hủy đơn hàng hết hạn (thủ công hoặc tự động)
 */
export const cancelExpiredOrder = async (orderId, cancelData = {}) => {
  try {
    const { note, cancelledBy } = cancelData;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (order.status !== 'pending') {
      throw new Error('Chỉ có thể hủy đơn hàng ở trạng thái pending');
    }

    // Hoàn lại stock
    for (const item of order.items) {
      await ProductVariant.findByIdAndUpdate(item.product_variant_id, {
        $inc: { stock_quantity: item.quantity },
      });
    }

    order.status = 'cancelled';
    order.payment_status = 'expired';
    order.status_history.push({
      status: 'cancelled',
      changed_at: new Date(),
      note: note || '⏰ Hết hạn thanh toán',
    });

    await order.save();

    // Thông báo admin
    emitToAdmin('order:expired', {
      orderId: order._id,
      orderNumber: order.order_number,
      timestamp: new Date(),
    });

    return order;
  } catch (error) {
    throw new Error(error.message || 'Không thể hủy đơn hàng');
  }
};

/**
 * Hủy tất cả đơn hàng hết hạn (cron job)
 */
export const cancelExpiredOrders = async () => {
  try {
    const now = new Date();

    const expiredOrders = await Order.find({
      payment_method: 'bank_transfer',
      payment_status: 'pending',
      reserved_until: { $lt: now },
    });

    let cancelledCount = 0;

    for (const order of expiredOrders) {
      try {
        await cancelExpiredOrder(order._id);
        cancelledCount++;
      } catch (error) {
        console.error(`Failed to cancel order ${order.order_number}:`, error);
      }
    }

    return { cancelled: cancelledCount };
  } catch (error) {
    throw new Error('Không thể hủy đơn hàng hết hạn: ' + error.message);
  }
};

/**
 * Lấy thống kê theo dõi thanh toán (dashboard)
 */
export const getPaymentMonitoring = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [pendingOrders, expiredToday, paidToday] = await Promise.all([
      // Đơn chờ thanh toán
      Order.find({
        payment_method: 'bank_transfer',
        payment_status: 'pending',
        status: 'pending',
      }),

      // Đơn hết hạn hôm nay
      Order.countDocuments({
        payment_status: 'expired',
        updatedAt: { $gte: today },
      }),

      // Đơn thanh toán hôm nay
      Order.find({
        payment_status: 'paid',
        paid_at: { $gte: today },
      }),
    ]);

    return {
      pending_count: pendingOrders.length,
      pending_amount: pendingOrders.reduce((sum, o) => sum + o.total, 0),
      expired_today: expiredToday,
      paid_today: paidToday.length,
      paid_amount_today: paidToday.reduce((sum, o) => sum + o.total, 0),
    };
  } catch (error) {
    throw new Error('Không thể lấy thống kê thanh toán: ' + error.message);
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
  autoConfirmPayment,
  getPendingPaymentOrders,
  confirmPaymentManually,
  cancelExpiredOrder,
  cancelExpiredOrders,
  getPaymentMonitoring,
};
