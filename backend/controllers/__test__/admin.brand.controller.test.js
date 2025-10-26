import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { createBrand, updateBrand, deleteBrand } from '../admin.brand.controller.js';
import adminBrandService from '../../services/admin.brand.service.js';

// Mock the admin brand service
jest.mock('../../services/admin.brand.service.js');

describe('Admin Brand Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup mock implementations
    adminBrandService.createBrand = jest.fn();
    adminBrandService.updateBrand = jest.fn();
    adminBrandService.deleteBrand = jest.fn();

    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createBrand', () => {
    it('should create brand successfully', async () => {
      // Arrange
      const mockBrand = {
        _id: '1',
        name: 'Dell',
        logo_url: 'https://example.com/dell-logo.png',
      };

      req.body = {
        name: 'Dell',
        logo_url: 'https://example.com/dell-logo.png',
      };

      adminBrandService.createBrand.mockResolvedValue(mockBrand);

      // Act
      await createBrand(req, res);

      // Assert
      expect(adminBrandService.createBrand).toHaveBeenCalledWith({
        name: 'Dell',
        logo_url: 'https://example.com/dell-logo.png',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tạo thương hiệu thành công!',
        data: { brand: mockBrand },
      });
    });

    it('should create brand without logo_url', async () => {
      // Arrange
      const mockBrand = {
        _id: '1',
        name: 'HP',
        logo_url: null,
      };

      req.body = {
        name: 'HP',
      };

      adminBrandService.createBrand.mockResolvedValue(mockBrand);

      // Act
      await createBrand(req, res);

      // Assert
      expect(adminBrandService.createBrand).toHaveBeenCalledWith({
        name: 'HP',
        logo_url: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tạo thương hiệu thành công!',
        data: { brand: mockBrand },
      });
    });

    it('should return 400 when name is missing', async () => {
      // Arrange
      req.body = {
        logo_url: 'https://example.com/logo.png',
        // name is missing
      };

      // Act
      await createBrand(req, res);

      // Assert
      expect(adminBrandService.createBrand).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vui lòng điền tên thương hiệu',
      });
    });

    it('should handle duplicate name error', async () => {
      // Arrange
      req.body = {
        name: 'Dell',
        logo_url: 'https://example.com/dell-logo.png',
      };

      adminBrandService.createBrand.mockRejectedValue(new Error('Tên thương hiệu đã tồn tại!'));

      // Act
      await createBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tên thương hiệu đã tồn tại!',
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      req.body = {
        name: 'Dell',
      };

      adminBrandService.createBrand.mockRejectedValue(new Error('Database connection failed'));

      // Act
      await createBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database connection failed',
      });
    });
  });

  describe('updateBrand', () => {
    it('should update brand successfully', async () => {
      // Arrange
      const mockBrand = {
        _id: '1',
        name: 'Dell Inc.',
        logo_url: 'https://example.com/new-dell-logo.png',
      };

      req.params = { id: '1' };
      req.body = {
        name: 'Dell Inc.',
        logo_url: 'https://example.com/new-dell-logo.png',
      };

      adminBrandService.updateBrand.mockResolvedValue(mockBrand);

      // Act
      await updateBrand(req, res);

      // Assert
      expect(adminBrandService.updateBrand).toHaveBeenCalledWith('1', {
        name: 'Dell Inc.',
        logo_url: 'https://example.com/new-dell-logo.png',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Cập nhật thương hiệu thành công!',
        data: { brand: mockBrand },
      });
    });

    it('should update only name', async () => {
      // Arrange
      const mockBrand = {
        _id: '1',
        name: 'Updated Name',
        logo_url: 'https://example.com/old-logo.png',
      };

      req.params = { id: '1' };
      req.body = {
        name: 'Updated Name',
      };

      adminBrandService.updateBrand.mockResolvedValue(mockBrand);

      // Act
      await updateBrand(req, res);

      // Assert
      expect(adminBrandService.updateBrand).toHaveBeenCalledWith('1', {
        name: 'Updated Name',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update only logo_url', async () => {
      // Arrange
      const mockBrand = {
        _id: '1',
        name: 'Dell',
        logo_url: 'https://example.com/new-logo.png',
      };

      req.params = { id: '1' };
      req.body = {
        logo_url: 'https://example.com/new-logo.png',
      };

      adminBrandService.updateBrand.mockResolvedValue(mockBrand);

      // Act
      await updateBrand(req, res);

      // Assert
      expect(adminBrandService.updateBrand).toHaveBeenCalledWith('1', {
        logo_url: 'https://example.com/new-logo.png',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when brand not found', async () => {
      // Arrange
      req.params = { id: '999' };
      req.body = {
        name: 'Updated Name',
      };

      adminBrandService.updateBrand.mockResolvedValue(null);

      // Act
      await updateBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy thương hiệu',
      });
    });

    it('should handle duplicate name error', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        name: 'Existing Brand Name',
      };

      adminBrandService.updateBrand.mockRejectedValue(new Error('Tên thương hiệu đã tồn tại!'));

      // Act
      await updateBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Tên thương hiệu đã tồn tại!',
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        name: 'Updated Name',
      };

      adminBrandService.updateBrand.mockRejectedValue(new Error('Update failed'));

      // Act
      await updateBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Update failed',
      });
    });
  });

  describe('deleteBrand', () => {
    it('should delete brand successfully', async () => {
      // Arrange
      req.params = { id: '1' };
      adminBrandService.deleteBrand.mockResolvedValue(true);

      // Act
      await deleteBrand(req, res);

      // Assert
      expect(adminBrandService.deleteBrand).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Xóa thương hiệu thành công!',
      });
    });

    it('should return 404 when brand not found', async () => {
      // Arrange
      req.params = { id: '999' };
      adminBrandService.deleteBrand.mockResolvedValue(null);

      // Act
      await deleteBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy thương hiệu',
      });
    });

    it('should handle invalid ObjectId format', async () => {
      // Arrange
      req.params = { id: 'invalid-id' };
      adminBrandService.deleteBrand.mockRejectedValue(new Error('Invalid ObjectId'));

      // Act
      await deleteBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid ObjectId',
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      req.params = { id: '1' };
      adminBrandService.deleteBrand.mockRejectedValue(new Error('Delete failed'));

      // Act
      await deleteBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Delete failed',
      });
    });

    it('should handle deletion with empty id', async () => {
      // Arrange
      req.params = { id: '' };
      adminBrandService.deleteBrand.mockResolvedValue(null);

      // Act
      await deleteBrand(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy thương hiệu',
      });
    });
  });
});
