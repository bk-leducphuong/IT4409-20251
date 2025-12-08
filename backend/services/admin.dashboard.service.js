import Order from '../models/order.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';

/**
 * Get comprehensive dashboard statistics
 * Includes: sales, revenue, user stats, order analytics
 */
export const getDashboardStats = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;

    // Build date filter if provided
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Total Revenue (from completed/delivered orders)
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'shipped', 'processing'] },
          payment_status: { $ne: 'failed' },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          total_revenue: { $sum: '$total' },
          total_orders: { $sum: 1 },
          average_order_value: { $avg: '$total' },
        },
      },
    ]);

    const revenue = revenueData[0] || {
      total_revenue: 0,
      total_orders: 0,
      average_order_value: 0,
    };

    // Order Statistics by Status
    const ordersByStatus = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total_amount: { $sum: '$total' },
        },
      },
    ]);

    // User Statistics
    const totalUsers = await User.countDocuments({
      deleted: false,
      ...dateFilter,
    });

    const activeCustomers = await User.countDocuments({
      deleted: false,
      status: 'active',
      role: 'customer',
      ...dateFilter,
    });

    const newUsersThisMonth = await User.countDocuments({
      deleted: false,
      createdAt: {
        $gte: new Date(new Date().setDate(1)), // First day of current month
      },
    });

    // Product Statistics
    const totalProducts = await Product.countDocuments();
    const totalVariants = await ProductVariant.countDocuments();

    const lowStockVariants = await ProductVariant.countDocuments({
      stock_quantity: { $lt: 10, $gt: 0 },
    });

    const outOfStockVariants = await ProductVariant.countDocuments({
      stock_quantity: 0,
    });

    // Recent Orders Count (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrdersCount = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Pending Orders (need attention)
    const pendingOrdersCount = await Order.countDocuments({
      status: 'pending',
    });

    return {
      revenue: {
        total: Math.round(revenue.total_revenue),
        orders_count: revenue.total_orders,
        average_order_value: Math.round(revenue.average_order_value),
      },
      orders: {
        total: await Order.countDocuments(dateFilter),
        by_status: ordersByStatus.map((item) => ({
          status: item._id,
          count: item.count,
          total_amount: Math.round(item.total_amount),
        })),
        pending: pendingOrdersCount,
        recent_7_days: recentOrdersCount,
      },
      users: {
        total: totalUsers,
        active_customers: activeCustomers,
        new_this_month: newUsersThisMonth,
      },
      products: {
        total_products: totalProducts,
        total_variants: totalVariants,
        low_stock: lowStockVariants,
        out_of_stock: outOfStockVariants,
      },
    };
  } catch (error) {
    throw new Error(`Không thể lấy thống kê dashboard: ${error.message}`);
  }
};

/**
 * Get sales analytics with time-based grouping
 * Supports daily, weekly, monthly grouping
 */
export const getSalesAnalytics = async (filters = {}) => {
  try {
    const { startDate, endDate, groupBy = 'daily' } = filters;

    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Set end date to end of day
    end.setHours(23, 59, 59, 999);

    // Define grouping format based on groupBy parameter
    let groupFormat;
    let sortField;

    switch (groupBy) {
      case 'monthly':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        };
        sortField = { '_id.year': 1, '_id.month': 1 };
        break;
      case 'weekly':
        groupFormat = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' },
        };
        sortField = { '_id.year': 1, '_id.week': 1 };
        break;
      case 'daily':
      default:
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        };
        sortField = { '_id.year': 1, '_id.month': 1, '_id.day': 1 };
        break;
    }

    // Aggregate sales data
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ['delivered', 'shipped', 'processing'] },
          payment_status: { $ne: 'failed' },
        },
      },
      {
        $group: {
          _id: groupFormat,
          total_sales: { $sum: '$total' },
          order_count: { $sum: 1 },
          average_order_value: { $avg: '$total' },
          total_items_sold: {
            $sum: {
              $sum: '$items.quantity',
            },
          },
        },
      },
      { $sort: sortField },
    ]);

    // Calculate totals
    const totals = salesData.reduce(
      (acc, curr) => ({
        total_sales: acc.total_sales + curr.total_sales,
        total_orders: acc.total_orders + curr.order_count,
        total_items_sold: acc.total_items_sold + curr.total_items_sold,
      }),
      { total_sales: 0, total_orders: 0, total_items_sold: 0 },
    );

    // Get payment method breakdown
    const paymentMethods = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ['delivered', 'shipped', 'processing'] },
        },
      },
      {
        $group: {
          _id: '$payment_method',
          count: { $sum: 1 },
          total_amount: { $sum: '$total' },
        },
      },
    ]);

    // Format response
    return {
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        groupBy,
      },
      summary: {
        total_sales: Math.round(totals.total_sales),
        total_orders: totals.total_orders,
        total_items_sold: totals.total_items_sold,
        average_order_value:
          totals.total_orders > 0
            ? Math.round(totals.total_sales / totals.total_orders)
            : 0,
      },
      sales_data: salesData.map((item) => ({
        date: item._id,
        total_sales: Math.round(item.total_sales),
        order_count: item.order_count,
        average_order_value: Math.round(item.average_order_value),
        total_items_sold: item.total_items_sold,
      })),
      payment_methods: paymentMethods.map((pm) => ({
        method: pm._id,
        count: pm.count,
        total_amount: Math.round(pm.total_amount),
      })),
    };
  } catch (error) {
    throw new Error(`Không thể lấy phân tích doanh số: ${error.message}`);
  }
};

/**
 * Get top selling products with detailed analytics
 */
export const getTopProducts = async (filters = {}) => {
  try {
    const { startDate, endDate, limit = 10, sortBy = 'revenue' } = filters;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Aggregate product sales from order items
    const topProducts = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'shipped', 'processing'] },
          payment_status: { $ne: 'failed' },
          ...dateFilter,
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            product_slug: '$items.product_slug',
            product_name: '$items.product_name',
          },
          total_quantity_sold: { $sum: '$items.quantity' },
          total_revenue: { $sum: '$items.subtotal' },
          order_count: { $sum: 1 },
          average_price: { $avg: '$items.unit_price' },
        },
      },
      {
        $project: {
          _id: 0,
          product_slug: '$_id.product_slug',
          product_name: '$_id.product_name',
          total_quantity_sold: 1,
          total_revenue: { $round: ['$total_revenue', 0] },
          order_count: 1,
          average_price: { $round: ['$average_price', 0] },
        },
      },
      {
        $sort:
          sortBy === 'quantity'
            ? { total_quantity_sold: -1 }
            : { total_revenue: -1 },
      },
      { $limit: parseInt(limit) },
    ]);

    // Get product details for top products
    const enrichedProducts = await Promise.all(
      topProducts.map(async (item) => {
        const product = await Product.findOne({ slug: item.product_slug })
          .populate('category_id', 'name')
          .populate('brand_id', 'name');

        // Get a sample variant for the main image
        const variant = await ProductVariant.findOne({
          product_id: product?._id,
        }).select('main_image_url');

        return {
          ...item,
          product_id: product?._id,
          category: product?.category_id?.name || 'N/A',
          brand: product?.brand_id?.name || 'N/A',
          image_url: variant?.main_image_url || '',
        };
      }),
    );

    // Get best selling variants (with specific attributes)
    const topVariants = await Order.aggregate([
      {
        $match: {
          status: { $in: ['delivered', 'shipped', 'processing'] },
          payment_status: { $ne: 'failed' },
          ...dateFilter,
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product_variant_id',
          product_name: { $first: '$items.product_name' },
          sku: { $first: '$items.sku' },
          attributes: { $first: '$items.attributes' },
          image_url: { $first: '$items.image_url' },
          total_quantity_sold: { $sum: '$items.quantity' },
          total_revenue: { $sum: '$items.subtotal' },
        },
      },
      {
        $project: {
          variant_id: '$_id',
          product_name: 1,
          sku: 1,
          attributes: 1,
          image_url: 1,
          total_quantity_sold: 1,
          total_revenue: { $round: ['$total_revenue', 0] },
        },
      },
      { $sort: { total_quantity_sold: -1 } },
      { $limit: parseInt(limit) },
    ]);

    return {
      top_products: enrichedProducts,
      top_variants: topVariants,
    };
  } catch (error) {
    throw new Error(`Không thể lấy sản phẩm bán chạy: ${error.message}`);
  }
};

export default {
  getDashboardStats,
  getSalesAnalytics,
  getTopProducts,
};
