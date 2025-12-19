import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import meilisearchService from './meilisearch.service.js';
import logger from '../logger.js';

// Lấy danh sách sản phẩm với filters và pagination
export const getProducts = async (filters) => {
  try {
    const { category, brand, search, sort_by = 'newest', page = 1, limit = 20 } = filters;

    // If there's a search query, use Meilisearch
    if (search && search.trim() !== '') {
      logger.info(`Using Meilisearch for search query: "${search}"`);
      try {
        const results = await meilisearchService.searchProducts(search, {
          category,
          brand,
          sort_by,
          page,
          limit,
        });

        // Fetch full product details with variants from MongoDB
        const productIds = results.products.map((p) => p.id);
        const products = await Product.find({ _id: { $in: productIds } })
          .populate('category_id', 'name slug')
          .populate('brand_id', 'name logo_url');

        // Get variants for each product and maintain Meilisearch order
        const productsMap = {};
        await Promise.all(
          products.map(async (product) => {
            const variants = await ProductVariant.find({ product_id: product._id });
            productsMap[product._id.toString()] = {
              ...product.toJSON(),
              variants,
            };
          }),
        );

        // Maintain the order from Meilisearch results
        const productsWithVariants = productIds
          .map((id) => productsMap[id])
          .filter((p) => p !== undefined);

        return {
          products: productsWithVariants,
          pagination: results.pagination,
          searchTimeMs: results.processingTimeMs,
        };
      } catch (meiliError) {
        logger.error(`Meilisearch error: ${meiliError.message}, falling back to MongoDB`);
        // Fall through to MongoDB search if Meilisearch fails
      }
    }

    // Use MongoDB for filtering without search or as fallback
    logger.info('Using MongoDB for product filtering');

    // Build query
    const query = {};

    // Filter by category slug
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category_id = categoryDoc._id;
      }
    }

    // Filter by brand name
    if (brand) {
      const brandDoc = await Brand.findOne({ name: brand });
      if (brandDoc) {
        query.brand_id = brandDoc._id;
      }
    }

    // Search by product name (MongoDB fallback)
    if (search && search.trim() !== '') {
      query.name = { $regex: search, $options: 'i' };
    }

    // Sorting
    let sort = {};
    switch (sort_by) {
      case 'price_asc':
        sort = { 'variants.price': 1 };
        break;
      case 'price_desc':
        sort = { 'variants.price': -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get products
    const products = await Product.find(query)
      .populate('category_id', 'name slug')
      .populate('brand_id', 'name logo_url')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get variants for each product
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        const variants = await ProductVariant.find({ product_id: product._id });
        return {
          ...product.toJSON(),
          variants,
        };
      }),
    );

    // Get total count
    const total = await Product.countDocuments(query);

    return {
      products: productsWithVariants,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  } catch (error) {
    throw new Error(`Không thể lấy danh sách sản phẩm: ${error.message}`);
  }
};

// Lấy chi tiết sản phẩm theo slug (bao gồm tất cả variants)
export const getProductBySlug = async (slug) => {
  try {
    const product = await Product.findOne({ slug })
      .populate('category_id', 'name slug')
      .populate('brand_id', 'name logo_url');

    if (!product) {
      return null;
    }

    // Get all variants for this product
    const variants = await ProductVariant.find({ product_id: product._id });

    return {
      ...product.toJSON(),
      variants,
    };
  } catch (error) {
    throw new Error(`Không thể lấy chi tiết sản phẩm: ${error.message}`);
  }
};

export default {
  getProducts,
  getProductBySlug,
};
