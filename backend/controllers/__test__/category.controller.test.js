import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getCategories, getCategoryBySlug } from '../category.controller.js';
import categoryService from '../../services/category.service.js';

// Mock the category service
jest.mock('../../services/category.service.js');

describe('Category Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup mock implementations
    categoryService.getCategories = jest.fn();
    categoryService.getCategoryBySlug = jest.fn();

    req = {
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getCategories', () => {
    it('should return all categories successfully', async () => {
      // Arrange
      const mockCategories = [
        {
          _id: '1',
          name: 'Laptop',
          slug: 'laptop',
          parent_category_id: null,
        },
        {
          _id: '2',
          name: 'Gaming Laptop',
          slug: 'gaming-laptop',
          parent_category_id: '1',
        },
      ];

      categoryService.getCategories.mockResolvedValue(mockCategories);

      // Act
      await getCategories(req, res);

      // Assert
      expect(categoryService.getCategories).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { categories: mockCategories },
      });
    });

    it('should return empty array when no categories exist', async () => {
      // Arrange
      categoryService.getCategories.mockResolvedValue([]);

      // Act
      await getCategories(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { categories: [] },
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Database error';
      categoryService.getCategories.mockRejectedValue(new Error(errorMessage));

      // Act
      await getCategories(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe('getCategoryBySlug', () => {
    it('should return category with subcategories', async () => {
      // Arrange
      const mockCategory = {
        _id: '1',
        name: 'Laptop',
        slug: 'laptop',
        parent_category_id: null,
        subCategories: [
          {
            _id: '2',
            name: 'Gaming Laptop',
            slug: 'gaming-laptop',
          },
        ],
      };

      req.params = { slug: 'laptop' };
      categoryService.getCategoryBySlug.mockResolvedValue(mockCategory);

      // Act
      await getCategoryBySlug(req, res);

      // Assert
      expect(categoryService.getCategoryBySlug).toHaveBeenCalledWith('laptop');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { category: mockCategory },
      });
    });

    it('should return 404 when category not found', async () => {
      // Arrange
      req.params = { slug: 'non-existent' };
      categoryService.getCategoryBySlug.mockResolvedValue(null);

      // Act
      await getCategoryBySlug(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      req.params = { slug: 'laptop' };
      categoryService.getCategoryBySlug.mockRejectedValue(new Error(errorMessage));

      // Act
      await getCategoryBySlug(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});
