import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant,
} from '../admin.product.controller.js';
import adminProductService from '../../services/admin.product.service.js';

// Mock the admin product service
jest.mock('../../services/admin.product.service.js');

describe('Admin Product Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup mock implementations
    adminProductService.createProduct = jest.fn();
    adminProductService.updateProduct = jest.fn();
    adminProductService.deleteProduct = jest.fn();
    adminProductService.createVariant = jest.fn();
    adminProductService.updateVariant = jest.fn();
    adminProductService.deleteVariant = jest.fn();

    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createProduct', () => {
    it('should create product successfully', async () => {
      // Arrange
      const mockProduct = {
        _id: '1',
        name: 'Laptop Dell XPS 15',
        slug: 'laptop-dell-xps-15',
        description: 'High-performance laptop',
        category_id: 'cat1',
        brand_id: 'brand1',
      };

      req.body = {
        name: 'Laptop Dell XPS 15',
        slug: 'laptop-dell-xps-15',
        description: 'High-performance laptop',
        category_id: 'cat1',
        brand_id: 'brand1',
      };

      adminProductService.createProduct.mockResolvedValue(mockProduct);

      // Act
      await createProduct(req, res);

      // Assert
      expect(adminProductService.createProduct).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tạo sản phẩm thành công!',
        data: { product: mockProduct },
      });
    });

    it('should return 400 when required fields are missing', async () => {
      // Arrange
      req.body = {
        name: 'Laptop Dell XPS 15',
        // missing slug, category_id, brand_id
      };

      // Act
      await createProduct(req, res);

      // Assert
      expect(adminProductService.createProduct).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (name, slug, category_id, brand_id)',
      });
    });

    it('should handle duplicate slug error', async () => {
      // Arrange
      req.body = {
        name: 'Laptop Dell XPS 15',
        slug: 'laptop-dell-xps-15',
        category_id: 'cat1',
        brand_id: 'brand1',
      };

      adminProductService.createProduct.mockRejectedValue(new Error('Slug đã tồn tại!'));

      // Act
      await createProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Slug đã tồn tại!',
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      // Arrange
      const mockProduct = {
        _id: '1',
        name: 'Updated Product Name',
        slug: 'laptop-dell-xps-15',
      };

      req.params = { id: '1' };
      req.body = { name: 'Updated Product Name' };

      adminProductService.updateProduct.mockResolvedValue(mockProduct);

      // Act
      await updateProduct(req, res);

      // Assert
      expect(adminProductService.updateProduct).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Cập nhật sản phẩm thành công!',
        data: { product: mockProduct },
      });
    });

    it('should return 404 when product not found', async () => {
      // Arrange
      req.params = { id: '999' };
      req.body = { name: 'Updated Name' };

      adminProductService.updateProduct.mockResolvedValue(null);

      // Act
      await updateProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    });

    it('should handle update errors', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = { name: 'Updated Name' };

      adminProductService.updateProduct.mockRejectedValue(new Error('Update failed'));

      // Act
      await updateProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Update failed',
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      // Arrange
      req.params = { id: '1' };
      adminProductService.deleteProduct.mockResolvedValue(true);

      // Act
      await deleteProduct(req, res);

      // Assert
      expect(adminProductService.deleteProduct).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Xóa sản phẩm thành công!',
      });
    });

    it('should return 404 when product not found', async () => {
      // Arrange
      req.params = { id: '999' };
      adminProductService.deleteProduct.mockResolvedValue(null);

      // Act
      await deleteProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    });

    it('should handle delete errors', async () => {
      // Arrange
      req.params = { id: '1' };
      adminProductService.deleteProduct.mockRejectedValue(new Error('Delete failed'));

      // Act
      await deleteProduct(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Delete failed',
      });
    });
  });

  describe('createVariant', () => {
    it('should create variant successfully', async () => {
      // Arrange
      const mockVariant = {
        _id: 'var1',
        product_id: 'prod1',
        sku: 'DELL-XPS-512',
        price: 1500,
        stock_quantity: 10,
        main_image_url: 'image.jpg',
        attributes: { RAM: '16GB' },
      };

      req.params = { id: 'prod1' };
      req.body = {
        sku: 'DELL-XPS-512',
        price: 1500,
        stock_quantity: 10,
        main_image_url: 'image.jpg',
        attributes: { RAM: '16GB' },
      };

      adminProductService.createVariant.mockResolvedValue(mockVariant);

      // Act
      await createVariant(req, res);

      // Assert
      expect(adminProductService.createVariant).toHaveBeenCalledWith({
        product_id: 'prod1',
        ...req.body,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tạo biến thể thành công!',
        data: { variant: mockVariant },
      });
    });

    it('should return 400 when required fields are missing', async () => {
      // Arrange
      req.params = { id: 'prod1' };
      req.body = {
        sku: 'DELL-XPS-512',
        // missing price and main_image_url
      };

      // Act
      await createVariant(req, res);

      // Assert
      expect(adminProductService.createVariant).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (sku, price, main_image_url)',
      });
    });
  });

  describe('updateVariant', () => {
    it('should update variant successfully', async () => {
      // Arrange
      const mockVariant = {
        _id: 'var1',
        price: 1600,
        stock_quantity: 15,
      };

      req.params = { variant_id: 'var1' };
      req.body = { price: 1600, stock_quantity: 15 };

      adminProductService.updateVariant.mockResolvedValue(mockVariant);

      // Act
      await updateVariant(req, res);

      // Assert
      expect(adminProductService.updateVariant).toHaveBeenCalledWith('var1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Cập nhật biến thể thành công!',
        data: { variant: mockVariant },
      });
    });

    it('should return 404 when variant not found', async () => {
      // Arrange
      req.params = { variant_id: '999' };
      req.body = { price: 1600 };

      adminProductService.updateVariant.mockResolvedValue(null);

      // Act
      await updateVariant(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy biến thể',
      });
    });
  });

  describe('deleteVariant', () => {
    it('should delete variant successfully', async () => {
      // Arrange
      req.params = { variant_id: 'var1' };
      adminProductService.deleteVariant.mockResolvedValue(true);

      // Act
      await deleteVariant(req, res);

      // Assert
      expect(adminProductService.deleteVariant).toHaveBeenCalledWith('var1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Xóa biến thể thành công!',
      });
    });

    it('should return 404 when variant not found', async () => {
      // Arrange
      req.params = { variant_id: '999' };
      adminProductService.deleteVariant.mockResolvedValue(null);

      // Act
      await deleteVariant(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy biến thể',
      });
    });
  });
});
