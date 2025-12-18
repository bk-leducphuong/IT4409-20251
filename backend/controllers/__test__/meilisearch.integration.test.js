import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import meilisearchService from '../../services/meilisearch.service.js';
import Product from '../../models/product.js';
import ProductVariant from '../../models/productVariant.js';
import Category from '../../models/category.js';
import Brand from '../../models/brand.js';
import mongoose from 'mongoose';

describe('Meilisearch Integration Tests', () => {
  let testCategory;
  let testBrand;
  let testProduct;
  let testVariant;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_test');
    }

    // Create test data
    testCategory = await Category.create({
      name: 'Test Electronics',
      slug: 'test-electronics',
      description: 'Test category for electronics',
    });

    testBrand = await Brand.create({
      name: 'Test Brand',
      slug: 'test-brand',
      logo_url: 'https://example.com/logo.png',
    });

    testProduct = await Product.create({
      name: 'Test Laptop Computer',
      slug: 'test-laptop-computer',
      description: 'A high-quality test laptop for testing',
      category_id: testCategory._id,
      brand_id: testBrand._id,
    });

    testVariant = await ProductVariant.create({
      product_id: testProduct._id,
      sku: 'TEST-LAPTOP-001',
      price: 999,
      original_price: 1299,
      stock_quantity: 10,
      main_image_url: 'https://example.com/laptop.jpg',
      attributes: {
        color: 'Silver',
        ram: '16GB',
      },
    });

    // Configure and sync
    await meilisearchService.configureIndex();
  });

  afterAll(async () => {
    // Clean up test data
    if (testProduct) {
      await ProductVariant.deleteMany({ product_id: testProduct._id });
      await Product.findByIdAndDelete(testProduct._id);
    }
    if (testCategory) await Category.findByIdAndDelete(testCategory._id);
    if (testBrand) await Brand.findByIdAndDelete(testBrand._id);

    // Clear Meilisearch test data
    try {
      await meilisearchService.deleteProductFromIndex(testProduct._id);
    } catch (error) {
      // Ignore if already deleted
    }

    await mongoose.disconnect();
  });

  describe('Index Management', () => {
    it('should configure index successfully', async () => {
      await expect(meilisearchService.configureIndex()).resolves.not.toThrow();
    });

    it('should get index stats', async () => {
      const stats = await meilisearchService.getIndexStats();
      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('numberOfDocuments');
    });
  });

  describe('Product Indexing', () => {
    it('should add product to index', async () => {
      const result = await meilisearchService.addProductToIndex(testProduct._id);

      expect(result).toBeDefined();
      expect(result.id).toBe(testProduct._id.toString());
      expect(result.name).toBe(testProduct.name);
      expect(result.price).toBe(999);
      expect(result.stock_quantity).toBe(10);
    });

    it('should update product in index', async () => {
      // Update the product
      testProduct.name = 'Updated Test Laptop';
      await testProduct.save();

      const result = await meilisearchService.updateProductInIndex(testProduct._id);

      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Test Laptop');
    });

    it('should delete product from index', async () => {
      await expect(
        meilisearchService.deleteProductFromIndex(testProduct._id),
      ).resolves.not.toThrow();
    });
  });

  describe('Product Search', () => {
    beforeAll(async () => {
      // Re-add product for search tests
      await meilisearchService.addProductToIndex(testProduct._id);
      // Wait for indexing to complete
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    it('should search products by name', async () => {
      const results = await meilisearchService.searchProducts('laptop', {
        page: 1,
        limit: 10,
      });

      expect(results).toBeDefined();
      expect(results.products).toBeDefined();
      expect(Array.isArray(results.products)).toBe(true);
      expect(results.pagination).toBeDefined();
    });

    it('should search with typo tolerance', async () => {
      const results = await meilisearchService.searchProducts('lapto', {
        page: 1,
        limit: 10,
      });

      expect(results).toBeDefined();
      expect(results.products).toBeDefined();
    });

    it('should filter by category', async () => {
      const results = await meilisearchService.searchProducts('', {
        category: 'test-electronics',
        page: 1,
        limit: 10,
      });

      expect(results).toBeDefined();
      expect(results.products).toBeDefined();
    });

    it('should filter by brand', async () => {
      const results = await meilisearchService.searchProducts('', {
        brand: 'Test Brand',
        page: 1,
        limit: 10,
      });

      expect(results).toBeDefined();
      expect(results.products).toBeDefined();
    });

    it('should sort by price ascending', async () => {
      const results = await meilisearchService.searchProducts('', {
        sort_by: 'price_asc',
        page: 1,
        limit: 10,
      });

      expect(results).toBeDefined();
      expect(results.products).toBeDefined();

      // Check if sorted (if multiple results)
      if (results.products.length > 1) {
        for (let i = 1; i < results.products.length; i++) {
          expect(results.products[i].price).toBeGreaterThanOrEqual(
            results.products[i - 1].price,
          );
        }
      }
    });

    it('should sort by price descending', async () => {
      const results = await meilisearchService.searchProducts('', {
        sort_by: 'price_desc',
        page: 1,
        limit: 10,
      });

      expect(results).toBeDefined();
      expect(results.products).toBeDefined();

      // Check if sorted (if multiple results)
      if (results.products.length > 1) {
        for (let i = 1; i < results.products.length; i++) {
          expect(results.products[i].price).toBeLessThanOrEqual(results.products[i - 1].price);
        }
      }
    });

    it('should paginate results', async () => {
      const page1 = await meilisearchService.searchProducts('', {
        page: 1,
        limit: 5,
      });

      expect(page1.pagination.currentPage).toBe(1);
      expect(page1.pagination.itemsPerPage).toBe(5);
    });
  });

  describe('Bulk Operations', () => {
    it('should sync all products', async () => {
      const result = await meilisearchService.syncAllProducts();

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(typeof result.count).toBe('number');
    });
  });
});
