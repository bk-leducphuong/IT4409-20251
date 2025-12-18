import meiliClient, { client } from '../configs/meilisearch.js';
import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import logger from '../logger.js';

/**
 * Configure Meilisearch index settings
 */
export const configureIndex = async () => {
  try {
    // Configure searchable attributes
    await meiliClient.updateSearchableAttributes([
      'name',
      'description',
      'brand_name',
      'category_name',
      'sku',
    ]);

    // Configure filterable attributes
    await meiliClient.updateFilterableAttributes([
      'category_id',
      'brand_id',
      'price',
      'stock_quantity',
      'category_slug',
      'brand_name',
    ]);

    // Configure sortable attributes
    await meiliClient.updateSortableAttributes(['price', 'createdAt', 'name']);

    // Configure ranking rules (Meilisearch default + custom)
    await meiliClient.updateRankingRules([
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
      'price:asc',
    ]);

    logger.info('Meilisearch index configuration tasks queued successfully');
  } catch (error) {
    logger.error(`Failed to configure Meilisearch index: ${error.message}`);
    throw error;
  }
};

/**
 * Format product data for Meilisearch indexing
 * @param {Object} product - MongoDB product document
 * @returns {Object} - Formatted product for Meilisearch
 */
const formatProductForIndex = async (product) => {
  try {
    // Populate references if needed
    let populatedProduct = product;
    if (!product.category_id?.name) {
      populatedProduct = await Product.findById(product._id)
        .populate('category_id', 'name slug')
        .populate('brand_id', 'name logo_url');
    }

    // Get variants for this product
    const variants = await ProductVariant.find({ product_id: populatedProduct._id });

    // Calculate price range and total stock
    const prices = variants.map((v) => v.price).filter((p) => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const totalStock = variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);

    // Get main image (first variant's main image)
    const mainImageUrl = variants[0]?.main_image_url || '';

    return {
      id: populatedProduct._id.toString(),
      name: populatedProduct.name,
      slug: populatedProduct.slug,
      description: populatedProduct.description,
      category_id: populatedProduct.category_id?._id?.toString() || '',
      category_name: populatedProduct.category_id?.name || '',
      category_slug: populatedProduct.category_id?.slug || '',
      brand_id: populatedProduct.brand_id?._id?.toString() || '',
      brand_name: populatedProduct.brand_id?.name || '',
      brand_logo_url: populatedProduct.brand_id?.logo_url || '',
      price: minPrice,
      min_price: minPrice,
      max_price: maxPrice,
      stock_quantity: totalStock,
      main_image_url: mainImageUrl,
      variants_count: variants.length,
      sku: variants.map((v) => v.sku).join(' '), // For search purposes
      createdAt: populatedProduct.createdAt
        ? new Date(populatedProduct.createdAt).getTime()
        : Date.now(),
      updatedAt: populatedProduct.updatedAt
        ? new Date(populatedProduct.updatedAt).getTime()
        : Date.now(),
    };
  } catch (error) {
    logger.error(`Failed to format product ${product._id}: ${error.message}`);
    throw error;
  }
};

/**
 * Add a single product to Meilisearch index
 * @param {String} productId - MongoDB product ID
 */
export const addProductToIndex = async (productId) => {
  try {
    const product = await Product.findById(productId)
      .populate('category_id', 'name slug')
      .populate('brand_id', 'name logo_url');

    if (!product) {
      throw new Error('Product not found');
    }

    const formattedProduct = await formatProductForIndex(product);
    await meiliClient.addDocuments([formattedProduct]);

    logger.info(`Product ${productId} added to Meilisearch index`);
    return formattedProduct;
  } catch (error) {
    logger.error(`Failed to add product ${productId} to index: ${error.message}`);
    throw error;
  }
};

/**
 * Update a product in Meilisearch index
 * @param {String} productId - MongoDB product ID
 */
export const updateProductInIndex = async (productId) => {
  try {
    const product = await Product.findById(productId)
      .populate('category_id', 'name slug')
      .populate('brand_id', 'name logo_url');

    if (!product) {
      // If product doesn't exist, remove it from index
      await deleteProductFromIndex(productId);
      return;
    }

    const formattedProduct = await formatProductForIndex(product);
    await meiliClient.updateDocuments([formattedProduct]);

    logger.info(`Product ${productId} updated in Meilisearch index`);
    return formattedProduct;
  } catch (error) {
    logger.error(`Failed to update product ${productId} in index: ${error.message}`);
    throw error;
  }
};

/**
 * Delete a product from Meilisearch index
 * @param {String} productId - MongoDB product ID
 */
export const deleteProductFromIndex = async (productId) => {
  try {
    await meiliClient.deleteDocument(productId.toString());
    logger.info(`Product ${productId} deleted from Meilisearch index`);
  } catch (error) {
    logger.error(`Failed to delete product ${productId} from index: ${error.message}`);
    throw error;
  }
};

/**
 * Sync all products from MongoDB to Meilisearch
 * This should be run once to populate the index
 */
export const syncAllProducts = async () => {
  try {
    logger.info('Starting full product sync to Meilisearch...');

    // Get all products
    const products = await Product.find()
      .populate('category_id', 'name slug')
      .populate('brand_id', 'name logo_url');

    logger.info(`Found ${products.length} products to sync`);

    // Format all products
    const formattedProducts = await Promise.all(
      products.map((product) => formatProductForIndex(product)),
    );

    // Add to Meilisearch in batches
    const batchSize = 100;
    for (let i = 0; i < formattedProducts.length; i += batchSize) {
      const batch = formattedProducts.slice(i, i + batchSize);
      await meiliClient.addDocuments(batch);
      logger.info(
        `Synced batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(formattedProducts.length / batchSize)}`,
      );
    }

    logger.info(`Successfully synced ${formattedProducts.length} products to Meilisearch`);
    return { success: true, count: formattedProducts.length };
  } catch (error) {
    logger.error(`Failed to sync products: ${error.message}`);
    throw error;
  }
};

/**
 * Search products using Meilisearch
 * @param {String} query - Search query
 * @param {Object} options - Search options (filters, sort, pagination)
 * @returns {Object} - Search results with pagination
 */
export const searchProducts = async (query = '', options = {}) => {
  try {
    const {
      category,
      brand,
      sort_by = 'newest',
      page = 1,
      limit = 20,
      minPrice,
      maxPrice,
    } = options;

    // Build filters
    const filters = [];

    if (category) {
      filters.push(`category_slug = "${category}"`);
    }

    if (brand) {
      filters.push(`brand_name = "${brand}"`);
    }

    if (minPrice !== undefined) {
      filters.push(`price >= ${minPrice}`);
    }

    if (maxPrice !== undefined) {
      filters.push(`price <= ${maxPrice}`);
    }

    // Build sort
    let sort = [];
    switch (sort_by) {
      case 'price_asc':
        sort = ['price:asc'];
        break;
      case 'price_desc':
        sort = ['price:desc'];
        break;
      case 'name_asc':
        sort = ['name:asc'];
        break;
      case 'name_desc':
        sort = ['name:desc'];
        break;
      case 'newest':
      default:
        sort = ['createdAt:desc'];
        break;
    }

    // Execute search
    const searchOptions = {
      filter: filters.length > 0 ? filters : undefined,
      sort: sort,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      attributesToRetrieve: [
        'id',
        'name',
        'slug',
        'description',
        'category_id',
        'category_name',
        'category_slug',
        'brand_id',
        'brand_name',
        'brand_logo_url',
        'min_price',
        'max_price',
        'stock_quantity',
        'main_image_url',
        'variants_count',
      ],
    };

    const results = await meiliClient.search(query, searchOptions);

    return {
      products: results.hits,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(results.estimatedTotalHits / limit),
        totalItems: results.estimatedTotalHits,
        itemsPerPage: parseInt(limit),
      },
      processingTimeMs: results.processingTimeMs,
    };
  } catch (error) {
    logger.error(`Search failed: ${error.message}`);
    throw error;
  }
};

/**
 * Clear all documents from the index
 */
export const clearIndex = async () => {
  try {
    await meiliClient.deleteAllDocuments();
    logger.info('Meilisearch index cleared');
  } catch (error) {
    logger.error(`Failed to clear index: ${error.message}`);
    throw error;
  }
};

/**
 * Get index stats
 */
export const getIndexStats = async () => {
  try {
    const stats = await meiliClient.getStats();
    return stats;
  } catch (error) {
    logger.error(`Failed to get index stats: ${error.message}`);
    throw error;
  }
};

export default {
  configureIndex,
  addProductToIndex,
  updateProductInIndex,
  deleteProductFromIndex,
  syncAllProducts,
  searchProducts,
  clearIndex,
  getIndexStats,
};
