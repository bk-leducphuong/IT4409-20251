import Order from '../models/order.js';
import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';
import redis from '../configs/redis.js';
import logger from '../logger.js';

const TRENDING_CACHE_KEY = 'trending:products';
const TRENDING_CACHE_TTL_SECONDS = 60 * 20; // 20 minutes
const DEFAULT_LIMIT = 20;
const ORDER_STATUSES = ['delivered', 'shipped', 'processing'];

const getDateHoursAgo = (hours) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
};

const calculateScores = async (limit = 50) => {
  const now = new Date();
  const oneHourAgo = getDateHoursAgo(1);
  const sixHoursAgo = getDateHoursAgo(6);
  const twentyFourHoursAgo = getDateHoursAgo(24);

  const sales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: twentyFourHoursAgo, $lte: now },
        status: { $in: ORDER_STATUSES },
        payment_status: { $ne: 'failed' },
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product_slug',
        product_name: { $first: '$items.product_name' },
        product_variant_id: { $first: '$items.product_variant_id' },
        fallback_image: { $first: '$items.image_url' },
        sales_last_24h: { $sum: '$items.quantity' },
        sales_last_6h: {
          $sum: {
            $cond: [{ $gte: ['$createdAt', sixHoursAgo] }, '$items.quantity', 0],
          },
        },
        sales_last_1h: {
          $sum: {
            $cond: [{ $gte: ['$createdAt', oneHourAgo] }, '$items.quantity', 0],
          },
        },
        last_order_at: { $max: '$createdAt' },
      },
    },
    {
      $project: {
        _id: 0,
        product_slug: '$_id',
        product_name: 1,
        product_variant_id: 1,
        fallback_image: 1,
        sales_last_24h: 1,
        sales_last_6h: 1,
        sales_last_1h: 1,
        last_order_at: 1,
        score: {
          $add: [
            { $multiply: ['$sales_last_1h', 0.6] },
            { $multiply: ['$sales_last_6h', 0.3] },
            { $multiply: ['$sales_last_24h', 0.1] },
          ],
        },
      },
    },
    { $sort: { score: -1 } },
    { $limit: limit },
  ]);

  if (!sales.length) {
    return [];
  }

  const slugs = sales.map((item) => item.product_slug);
  const products = await Product.find({ slug: { $in: slugs } })
    .populate('category_id', 'name slug')
    .populate('brand_id', 'name logo_url');
  const productBySlug = products.reduce((map, product) => {
    map[product.slug] = product;
    return map;
  }, {});

  const productIds = products.map((p) => p._id);
  const variants = await ProductVariant.find({
    product_id: { $in: productIds },
  }).select('product_id main_image_url price');
  const variantByProductId = variants.reduce((map, variant) => {
    const productIdStr = variant.product_id.toString();
    if (!map[productIdStr]) {
      map[productIdStr] = variant;
    }
    return map;
  }, {});

  return sales.map((item) => {
    const product = productBySlug[item.product_slug];
    const variant = product ? variantByProductId[product._id.toString()] : null;

    return {
      product_id: product?._id || null,
      product_slug: item.product_slug,
      product_name: product?.name || item.product_name,
      category: product?.category_id?.name || null,
      brand: product?.brand_id?.name || null,
      main_image_url: variant?.main_image_url || item.fallback_image || '',
      sales_last_1h: item.sales_last_1h,
      sales_last_6h: item.sales_last_6h,
      sales_last_24h: item.sales_last_24h,
      score: Number(item.score.toFixed(2)),
      last_order_at: item.last_order_at,
    };
  });
};

const cacheTrendingProducts = async (products) => {
  try {
    await redis.set(
      TRENDING_CACHE_KEY,
      JSON.stringify({
        generatedAt: new Date().toISOString(),
        products,
      }),
      'EX',
      TRENDING_CACHE_TTL_SECONDS,
    );
  } catch (error) {
    logger.error(`Failed to cache trending products: ${error.message}`);
  }
};

export const refreshTrendingProducts = async (limit = 50) => {
  const products = await calculateScores(limit);
  await cacheTrendingProducts(products);
  return {
    source: 'recomputed',
    generatedAt: new Date().toISOString(),
    products,
  };
};

export const getTrendingProducts = async (limit = DEFAULT_LIMIT) => {
  try {
    const cached = await redis.get(TRENDING_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return {
        source: 'cache',
        generatedAt: parsed.generatedAt,
        products: parsed.products.slice(0, limit),
      };
    }
  } catch (error) {
    logger.warn(`Redis unavailable, fallback to MongoDB: ${error.message}`);
  }

  const refreshed = await refreshTrendingProducts(limit);
  refreshed.products = refreshed.products.slice(0, limit);
  return refreshed;
};

export default {
  getTrendingProducts,
  refreshTrendingProducts,
};
