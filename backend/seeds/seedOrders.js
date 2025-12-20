import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectDB from '../configs/database.js';
import Order from '../models/order.js';
import User from '../models/user.js';
import ProductVariant from '../models/productVariant.js';
import Product from '../models/product.js';

dotenv.config();

const TAX_RATE = 0.1;

const calculateShippingFee = (subtotal) => {
  if (subtotal >= 500000) return 0;
  return 30000;
};

// Generate unique order number based on creation date
const generateOrderNumber = (createdAt, index) => {
  const dateStr = createdAt.toISOString().slice(0, 10).replace(/-/g, '');
  const orderNum = String(index + 1).padStart(5, '0');
  return `ORD-${dateStr}-${orderNum}`;
};

const seedOrders = async () => {
  try {
    await connectDB();

    // Clear existing orders
    await Order.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu orders cũ');

    // Get users (excluding admin)
    const users = await User.find({ role: { $ne: 'admin' } }).limit(15);
    if (users.length === 0) {
      console.log('⚠️  Không có user nào. Vui lòng seed users trước.');
      return;
    }

    // Get product variants with populated product info
    const variants = await ProductVariant.find().populate('product_id').limit(50);
    if (variants.length === 0) {
      console.log('⚠️  Không có product variant nào. Vui lòng seed products trước.');
      return;
    }

    const orders = [];
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentMethods = ['cod', 'credit_card', 'bank_transfer', 'momo', 'zalopay'];

    // Create 30-50 orders
    const orderCount = faker.number.int({ min: 30, max: 50 });

    for (let i = 0; i < orderCount; i++) {
      const user = faker.helpers.arrayElement(users);
      const status = faker.helpers.arrayElement(statuses);

      // Create 1-5 items per order
      const itemCount = faker.number.int({ min: 1, max: 5 });
      const orderItems = [];
      let subtotal = 0;

      const selectedVariants = faker.helpers.arrayElements(variants, itemCount);

      for (const variant of selectedVariants) {
        const product = variant.product_id;
        const quantity = faker.number.int({ min: 1, max: 3 });
        const itemSubtotal = variant.price * quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          product_variant_id: variant._id,
          product_name: product.name,
          product_slug: product.slug,
          sku: variant.sku,
          image_url: variant.main_image_url,
          attributes: variant.attributes,
          unit_price: variant.price,
          quantity: quantity,
          subtotal: itemSubtotal,
        });
      }

      const tax = Math.round(subtotal * TAX_RATE);
      const shipping_fee = calculateShippingFee(subtotal);
      const discount =
        faker.helpers.maybe(() => faker.number.int({ min: 10000, max: 50000 }), {
          probability: 0.3,
        }) || 0;
      const total = subtotal + tax + shipping_fee - discount;

      const payment_method = faker.helpers.arrayElement(paymentMethods);

      // Create shipping address
      const shipping_address = {
        full_name: user.fullName,
        phone: user.phone || faker.phone.number('0#########'),
        address_line: faker.location.streetAddress(),
        city: faker.location.city(),
        province: faker.helpers.arrayElement([
          'Hà Nội',
          'Hồ Chí Minh',
          'Đà Nẵng',
          'Hải Phòng',
          'Cần Thơ',
        ]),
        postal_code: faker.location.zipCode(),
        country: 'Vietnam',
      };

      // Create status history based on current status
      const status_history = [
        {
          status: 'pending',
          changed_at: faker.date.recent({ days: 30 }),
          note: 'Order created',
        },
      ];

      let createdAt = faker.date.recent({ days: 30 });
      let payment_status = 'pending';
      let paid_at = null;
      let shipped_at = null;
      let delivered_at = null;
      let cancelled_at = null;
      let tracking_number = null;
      let carrier = null;

      if (['processing', 'shipped', 'delivered'].includes(status)) {
        status_history.push({
          status: 'processing',
          changed_at: faker.date.between({ from: createdAt, to: new Date() }),
          note: 'Order is being prepared',
        });
      }

      if (['shipped', 'delivered'].includes(status)) {
        shipped_at = faker.date.between({ from: createdAt, to: new Date() });
        status_history.push({
          status: 'shipped',
          changed_at: shipped_at,
          note: 'Order has been shipped',
        });
        tracking_number = `VN${faker.string.numeric(9)}`;
        carrier = faker.helpers.arrayElement([
          'Viettel Post',
          'VNPost',
          'GHTK',
          'GHN',
          'J&T Express',
        ]);
      }

      if (status === 'delivered') {
        delivered_at = faker.date.between({ from: shipped_at || createdAt, to: new Date() });
        status_history.push({
          status: 'delivered',
          changed_at: delivered_at,
          note: 'Order delivered successfully',
        });
        payment_status = 'paid';
        paid_at = delivered_at;
      }

      if (status === 'cancelled') {
        cancelled_at = faker.date.between({ from: createdAt, to: new Date() });
        status_history.push({
          status: 'cancelled',
          changed_at: cancelled_at,
          note: faker.helpers.arrayElement([
            'Customer requested cancellation',
            'Out of stock',
            'Invalid address',
            'Payment failed',
          ]),
        });
      }

      orders.push({
        user_id: user._id,
        items: orderItems,
        status,
        status_history,
        shipping_address,
        subtotal,
        tax,
        shipping_fee,
        discount,
        total,
        payment_method,
        payment_status,
        paid_at,
        tracking_number,
        carrier,
        shipped_at,
        delivered_at,
        cancelled_at,
        customer_note: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
        createdAt,
        updatedAt: new Date(),
      });
    }

    // Sort orders by creation date to ensure sequential order numbers per day
    orders.sort((a, b) => a.createdAt - b.createdAt);

    // Group orders by date and assign order numbers
    const ordersByDate = new Map();

    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().slice(0, 10);
      if (!ordersByDate.has(dateKey)) {
        ordersByDate.set(dateKey, []);
      }
      ordersByDate.get(dateKey).push(order);
    });

    // Assign order numbers for each date group
    ordersByDate.forEach((dailyOrders, dateKey) => {
      dailyOrders.forEach((order, index) => {
        order.order_number = generateOrderNumber(order.createdAt, index);
      });
    });

    const createdOrders = await Order.insertMany(orders);
    console.log(`✅ Đã seed ${createdOrders.length} orders thành công!`);
    console.log('');
    console.log('📝 Sample order numbers:');
    createdOrders.slice(0, 5).forEach((order) => {
      console.log(`   - ${order.order_number} (${order.status})`);
    });
    console.log('');
    console.log('📊 Thống kê orders:');

    // Count by status
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    statusCounts.forEach((stat) => {
      console.log(`   - ${stat._id}: ${stat.count} orders`);
    });

    return createdOrders;
  } catch (error) {
    console.error('❌ Lỗi seed orders:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedOrders()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedOrders;
