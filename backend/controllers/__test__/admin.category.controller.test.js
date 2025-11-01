import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { createCategory, updateCategory, deleteCategory } from '../admin.category.controller.js';
import adminCategoryService from '../../services/admin.category.service.js';

// Mock the admin category service
jest.mock('../../services/admin.category.service.js');

describe('Admin Category Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup mock implementations
    adminCategoryService.createCategory = jest.fn();
    adminCategoryService.updateCategory = jest.fn();
    adminCategoryService.deleteCategory = jest.fn();

    req = {
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createCategory', () => {
    it('should create category successfully', async () => {
      // Arrange
      const mockCategory = {
        _id: '1',
        name: 'Laptop',
        slug: 'laptop',
        parent_category_id: null,
      };

      req.body = {
        name: 'Laptop',
        slug: 'laptop',
      };

      adminCategoryService.createCategory.mockResolvedValue(mockCategory);

      // Act
      await createCategory(req, res);

      // Assert
      expect(adminCategoryService.createCategory).toHaveBeenCalledWith({
        name: 'Laptop',
        slug: 'laptop',
        parent_category_id: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tạo danh mục thành công!',
        data: { category: mockCategory },
      });
    });

    it('should create category with parent category', async () => {
      // Arrange
      const mockCategory = {
        _id: '2',
        name: 'Gaming Laptop',
        slug: 'gaming-laptop',
        parent_category_id: '1',
      };

      req.body = {
        name: 'Gaming Laptop',
        slug: 'gaming-laptop',
        parent_category_id: '1',
      };

      adminCategoryService.createCategory.mockResolvedValue(mockCategory);

      // Act
      await createCategory(req, res);

      // Assert
      expect(adminCategoryService.createCategory).toHaveBeenCalledWith({
        name: 'Gaming Laptop',
        slug: 'gaming-laptop',
        parent_category_id: '1',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tạo danh mục thành công!',
        data: { category: mockCategory },
      });
    });

    it('should return 400 when name is missing', async () => {
      // Arrange
      req.body = {
        slug: 'laptop',
        // name is missing
      };

      // Act
      await createCategory(req, res);

      // Assert
      expect(adminCategoryService.createCategory).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (name, slug)',
      });
    });

    it('should return 400 when slug is missing', async () => {
      // Arrange
      req.body = {
        name: 'Laptop',
        // slug is missing
      };

      // Act
      await createCategory(req, res);

      // Assert
      expect(adminCategoryService.createCategory).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (name, slug)',
      });
    });

    it('should return 400 when both name and slug are missing', async () => {
      // Arrange
      req.body = {};

      // Act
      await createCategory(req, res);

      // Assert
      expect(adminCategoryService.createCategory).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle duplicate slug error', async () => {
      // Arrange
      req.body = {
        name: 'Laptop',
        slug: 'laptop',
      };

      adminCategoryService.createCategory.mockRejectedValue(new Error('Slug đã tồn tại!'));

      // Act
      await createCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Slug đã tồn tại!',
      });
    });

    it('should handle invalid parent category error', async () => {
      // Arrange
      req.body = {
        name: 'Gaming Laptop',
        slug: 'gaming-laptop',
        parent_category_id: '999',
      };

      adminCategoryService.createCategory.mockRejectedValue(
        new Error('Danh mục cha không tồn tại!'),
      );

      // Act
      await createCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Danh mục cha không tồn tại!',
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      req.body = {
        name: 'Laptop',
        slug: 'laptop',
      };

      adminCategoryService.createCategory.mockRejectedValue(new Error('Database error'));

      // Act
      await createCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error',
      });
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      // Arrange
      const mockCategory = {
        _id: '1',
        name: 'Laptops & Notebooks',
        slug: 'laptops-notebooks',
        parent_category_id: null,
      };

      req.params = { id: '1' };
      req.body = {
        name: 'Laptops & Notebooks',
        slug: 'laptops-notebooks',
      };

      adminCategoryService.updateCategory.mockResolvedValue(mockCategory);

      // Act
      await updateCategory(req, res);

      // Assert
      expect(adminCategoryService.updateCategory).toHaveBeenCalledWith('1', {
        name: 'Laptops & Notebooks',
        slug: 'laptops-notebooks',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Cập nhật danh mục thành công!',
        data: { category: mockCategory },
      });
    });

    it('should update only name', async () => {
      // Arrange
      const mockCategory = {
        _id: '1',
        name: 'Updated Name',
        slug: 'laptop',
        parent_category_id: null,
      };

      req.params = { id: '1' };
      req.body = {
        name: 'Updated Name',
      };

      adminCategoryService.updateCategory.mockResolvedValue(mockCategory);

      // Act
      await updateCategory(req, res);

      // Assert
      expect(adminCategoryService.updateCategory).toHaveBeenCalledWith('1', {
        name: 'Updated Name',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update only slug', async () => {
      // Arrange
      const mockCategory = {
        _id: '1',
        name: 'Laptop',
        slug: 'new-laptop-slug',
        parent_category_id: null,
      };

      req.params = { id: '1' };
      req.body = {
        slug: 'new-laptop-slug',
      };

      adminCategoryService.updateCategory.mockResolvedValue(mockCategory);

      // Act
      await updateCategory(req, res);

      // Assert
      expect(adminCategoryService.updateCategory).toHaveBeenCalledWith('1', {
        slug: 'new-laptop-slug',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update parent_category_id', async () => {
      // Arrange
      const mockCategory = {
        _id: '2',
        name: 'Gaming Laptop',
        slug: 'gaming-laptop',
        parent_category_id: '1',
      };

      req.params = { id: '2' };
      req.body = {
        parent_category_id: '1',
      };

      adminCategoryService.updateCategory.mockResolvedValue(mockCategory);

      // Act
      await updateCategory(req, res);

      // Assert
      expect(adminCategoryService.updateCategory).toHaveBeenCalledWith('2', {
        parent_category_id: '1',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when category not found', async () => {
      // Arrange
      req.params = { id: '999' };
      req.body = {
        name: 'Updated Name',
      };

      adminCategoryService.updateCategory.mockResolvedValue(null);

      // Act
      await updateCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    });

    it('should handle duplicate slug error', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        slug: 'existing-slug',
      };

      adminCategoryService.updateCategory.mockRejectedValue(new Error('Slug đã tồn tại!'));

      // Act
      await updateCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Slug đã tồn tại!',
      });
    });

    it('should handle self-reference error', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        parent_category_id: '1', // Same as category id
      };

      adminCategoryService.updateCategory.mockRejectedValue(
        new Error('Danh mục không thể là danh mục cha của chính nó!'),
      );

      // Act
      await updateCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Danh mục không thể là danh mục cha của chính nó!',
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      req.params = { id: '1' };
      req.body = {
        name: 'Updated Name',
      };

      adminCategoryService.updateCategory.mockRejectedValue(new Error('Update failed'));

      // Act
      await updateCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Update failed',
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      // Arrange
      req.params = { id: '1' };
      adminCategoryService.deleteCategory.mockResolvedValue(true);

      // Act
      await deleteCategory(req, res);

      // Assert
      expect(adminCategoryService.deleteCategory).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Xóa danh mục thành công!',
      });
    });

    it('should return 404 when category not found', async () => {
      // Arrange
      req.params = { id: '999' };
      adminCategoryService.deleteCategory.mockResolvedValue(null);

      // Act
      await deleteCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    });

    it('should handle deletion with child categories error', async () => {
      // Arrange
      req.params = { id: '1' };
      adminCategoryService.deleteCategory.mockRejectedValue(
        new Error('Không thể xóa danh mục có danh mục con! Vui lòng xóa danh mục con trước.'),
      );

      // Act
      await deleteCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không thể xóa danh mục có danh mục con! Vui lòng xóa danh mục con trước.',
      });
    });

    it('should handle invalid ObjectId format', async () => {
      // Arrange
      req.params = { id: 'invalid-id' };
      adminCategoryService.deleteCategory.mockRejectedValue(new Error('Invalid ObjectId'));

      // Act
      await deleteCategory(req, res);

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
      adminCategoryService.deleteCategory.mockRejectedValue(new Error('Delete failed'));

      // Act
      await deleteCategory(req, res);

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
      adminCategoryService.deleteCategory.mockResolvedValue(null);

      // Act
      await deleteCategory(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    });
  });
});
