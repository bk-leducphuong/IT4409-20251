import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getProducts, getProductBySlug } from '../product.controller.js';
import productService from '../../services/product.service.js';

// Mock the product service
jest.mock('../../services/product.service.js');

describe('Product Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup mock implementations
    productService.getProducts = jest.fn();
    productService.getProductBySlug = jest.fn();

    // Mock request object
    req = {
      query: {},
      params: {},
    };

    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getProducts', () => {
    it('should return products with default pagination and filters', async () => {
      // Arrange
      const mockResult = {
        products: [
          {
            _id: '1',
            name: 'Laptop Dell XPS 15',
            slug: 'laptop-dell-xps-15',
            variants: [],
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 20,
        },
      };

      req.query = {};
      productService.getProducts.mockResolvedValue(mockResult);

      // Act
      await getProducts(req, res);

      // Assert
      expect(productService.getProducts).toHaveBeenCalledWith({
        category: undefined,
        brand: undefined,
        search: undefined,
        sort_by: 'newest',
        page: 1,
        limit: 20,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      });
    });

    it('should return products with custom filters', async () => {
      // Arrange
      const mockResult = {
        products: [
          {
            _id: '1',
            name: 'Laptop Dell XPS 15',
            slug: 'laptop-dell-xps-15',
            variants: [],
          },
        ],
        pagination: {
          currentPage: 2,
          totalPages: 5,
          totalItems: 50,
          itemsPerPage: 10,
        },
      };

      req.query = {
        category: 'laptop',
        brand: 'Dell',
        search: 'XPS',
        sort_by: 'price_asc',
        page: '2',
        limit: '10',
      };

      productService.getProducts.mockResolvedValue(mockResult);

      // Act
      await getProducts(req, res);

      // Assert
      expect(productService.getProducts).toHaveBeenCalledWith({
        category: 'laptop',
        brand: 'Dell',
        search: 'XPS',
        sort_by: 'price_asc',
        page: '2',
        limit: '10',
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      });
    });

    it('should return products with sort_by price_desc', async () => {
      // Arrange
      const mockResult = {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 20,
        },
      };

      req.query = {
        sort_by: 'price_desc',
      };

      productService.getProducts.mockResolvedValue(mockResult);

      // Act
      await getProducts(req, res);

      // Assert
      expect(productService.getProducts).toHaveBeenCalledWith({
        category: undefined,
        brand: undefined,
        search: undefined,
        sort_by: 'price_desc',
        page: 1,
        limit: 20,
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Database connection error';
      req.query = {};
      productService.getProducts.mockRejectedValue(new Error(errorMessage));

      // Act
      await getProducts(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it('should handle empty results', async () => {
      // Arrange
      const mockResult = {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 20,
        },
      };

      req.query = { search: 'nonexistent-product' };
      productService.getProducts.mockResolvedValue(mockResult);

      // Act
      await getProducts(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      });
    });
  });

  describe('getProductBySlug', () => {
    it('should return product details with variants', async () => {
      // Arrange
      const mockProduct = {
        _id: '1',
        name: 'Laptop Dell XPS 15',
        slug: 'laptop-dell-xps-15',
        description: 'High-performance laptop',
        category_id: {
          _id: 'cat1',
          name: 'Laptop',
          slug: 'laptop',
        },
        brand_id: {
          _id: 'brand1',
          name: 'Dell',
          logo_url: 'dell-logo.png',
        },
        variants: [
          {
            _id: 'var1',
            sku: 'DELL-XPS-15-512',
            price: 1500,
            stock_quantity: 10,
            attributes: { RAM: '16GB', Storage: '512GB SSD' },
          },
        ],
      };

      req.params = { slug: 'laptop-dell-xps-15' };
      productService.getProductBySlug.mockResolvedValue(mockProduct);

      // Act
      await getProductBySlug(req, res);

      // Assert
      expect(productService.getProductBySlug).toHaveBeenCalledWith('laptop-dell-xps-15');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { product: mockProduct },
      });
    });

    it('should return 404 when product not found', async () => {
      // Arrange
      req.params = { slug: 'non-existent-product' };
      productService.getProductBySlug.mockResolvedValue(null);

      // Act
      await getProductBySlug(req, res);

      // Assert
      expect(productService.getProductBySlug).toHaveBeenCalledWith('non-existent-product');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Database query failed';
      req.params = { slug: 'laptop-dell-xps-15' };
      productService.getProductBySlug.mockRejectedValue(new Error(errorMessage));

      // Act
      await getProductBySlug(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it('should handle invalid slug format', async () => {
      // Arrange
      req.params = { slug: '' };
      productService.getProductBySlug.mockResolvedValue(null);

      // Act
      await getProductBySlug(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    });

    it('should return product with multiple variants', async () => {
      // Arrange
      const mockProduct = {
        _id: '1',
        name: 'Laptop Dell XPS 15',
        slug: 'laptop-dell-xps-15',
        variants: [
          {
            _id: 'var1',
            sku: 'DELL-XPS-15-512',
            price: 1500,
            attributes: { RAM: '16GB', Storage: '512GB SSD' },
          },
          {
            _id: 'var2',
            sku: 'DELL-XPS-15-1TB',
            price: 1800,
            attributes: { RAM: '32GB', Storage: '1TB SSD' },
          },
        ],
      };

      req.params = { slug: 'laptop-dell-xps-15' };
      productService.getProductBySlug.mockResolvedValue(mockProduct);

      // Act
      await getProductBySlug(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { product: mockProduct },
      });
      expect(mockProduct.variants).toHaveLength(2);
    });
  });
});
