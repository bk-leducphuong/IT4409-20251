import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { getBrands, getBrandById } from '../brand.controller.js';
import brandService from '../../services/brand.service.js';

// Mock the brand service
jest.mock('../../services/brand.service.js');

describe('Brand Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup mock implementations
    brandService.getBrands = jest.fn();
    brandService.getBrandById = jest.fn();

    req = {
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getBrands', () => {
    it('should return all brands successfully', async () => {
      // Arrange
      const mockBrands = [
        {
          _id: '1',
          name: 'Dell',
          logo_url: 'dell-logo.png',
        },
        {
          _id: '2',
          name: 'HP',
          logo_url: 'hp-logo.png',
        },
      ];

      brandService.getBrands.mockResolvedValue(mockBrands);

      // Act
      await getBrands(req, res);

      // Assert
      expect(brandService.getBrands).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { brands: mockBrands },
      });
    });

    it('should return empty array when no brands exist', async () => {
      // Arrange
      brandService.getBrands.mockResolvedValue([]);

      // Act
      await getBrands(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { brands: [] },
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Database error';
      brandService.getBrands.mockRejectedValue(new Error(errorMessage));

      // Act
      await getBrands(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe('getBrandById', () => {
    it('should return brand by ID successfully', async () => {
      // Arrange
      const mockBrand = {
        _id: '1',
        name: 'Dell',
        logo_url: 'dell-logo.png',
      };

      req.params = { id: '1' };
      brandService.getBrandById.mockResolvedValue(mockBrand);

      // Act
      await getBrandById(req, res);

      // Assert
      expect(brandService.getBrandById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { brand: mockBrand },
      });
    });

    it('should return 404 when brand not found', async () => {
      // Arrange
      req.params = { id: '999' };
      brandService.getBrandById.mockResolvedValue(null);

      // Act
      await getBrandById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Không tìm thấy thương hiệu',
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Invalid ObjectId';
      req.params = { id: 'invalid-id' };
      brandService.getBrandById.mockRejectedValue(new Error(errorMessage));

      // Act
      await getBrandById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});
