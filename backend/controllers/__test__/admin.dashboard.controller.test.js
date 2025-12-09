import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  getDashboardStats,
  getSalesAnalytics,
  getTopProducts,
} from '../admin.dashboard.controller.js';
import dashboardService from '../../services/admin.dashboard.service.js';

// Mock the dashboard service
jest.mock('../../services/admin.dashboard.service.js');

describe('Admin Dashboard Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup mock implementations
    dashboardService.getDashboardStats = jest.fn();
    dashboardService.getSalesAnalytics = jest.fn();
    dashboardService.getTopProducts = jest.fn();

    req = {
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getDashboardStats', () => {
    it('should get dashboard statistics successfully', async () => {
      // Arrange
      const mockStats = {
        revenue: {
          total: 15000000,
          orders_count: 150,
          average_order_value: 100000,
        },
        orders: {
          total: 200,
          by_status: [
            { status: 'delivered', count: 100, total_amount: 10000000 },
            { status: 'pending', count: 25, total_amount: 2500000 },
          ],
          pending: 25,
          recent_7_days: 45,
        },
        users: {
          total: 500,
          active_customers: 450,
          new_this_month: 50,
        },
        products: {
          total_products: 100,
          total_variants: 250,
          low_stock: 15,
          out_of_stock: 5,
        },
      };

      dashboardService.getDashboardStats.mockResolvedValue(mockStats);

      // Act
      await getDashboardStats(req, res);

      // Assert
      expect(dashboardService.getDashboardStats).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockStats,
      });
    });

    it('should get dashboard statistics with date filters', async () => {
      // Arrange
      req.query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockStats = {
        revenue: { total: 10000000, orders_count: 100, average_order_value: 100000 },
        orders: { total: 100 },
        users: { total: 300 },
        products: { total_products: 50 },
      };

      dashboardService.getDashboardStats.mockResolvedValue(mockStats);

      // Act
      await getDashboardStats(req, res);

      // Assert
      expect(dashboardService.getDashboardStats).toHaveBeenCalledWith({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      dashboardService.getDashboardStats.mockRejectedValue(error);

      // Act
      await getDashboardStats(req, res);

      // Assert
      expect(res.status).toHaveBeenCalled();
    });
  });

  describe('getSalesAnalytics', () => {
    it('should get sales analytics successfully', async () => {
      // Arrange
      const mockAnalytics = {
        period: {
          start: '2024-11-01T00:00:00.000Z',
          end: '2024-12-01T23:59:59.999Z',
          groupBy: 'daily',
        },
        summary: {
          total_sales: 10000000,
          total_orders: 100,
          total_items_sold: 250,
          average_order_value: 100000,
        },
        sales_data: [
          {
            date: { year: 2024, month: 11, day: 1 },
            total_sales: 500000,
            order_count: 5,
            average_order_value: 100000,
            total_items_sold: 12,
          },
        ],
        payment_methods: [
          { method: 'cod', count: 60, total_amount: 6000000 },
        ],
      };

      dashboardService.getSalesAnalytics.mockResolvedValue(mockAnalytics);

      // Act
      await getSalesAnalytics(req, res);

      // Assert
      expect(dashboardService.getSalesAnalytics).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
        groupBy: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockAnalytics,
      });
    });

    it('should get sales analytics with groupBy parameter', async () => {
      // Arrange
      req.query = { groupBy: 'monthly' };
      const mockAnalytics = {
        period: { groupBy: 'monthly' },
        summary: {},
        sales_data: [],
        payment_methods: [],
      };

      dashboardService.getSalesAnalytics.mockResolvedValue(mockAnalytics);

      // Act
      await getSalesAnalytics(req, res);

      // Assert
      expect(dashboardService.getSalesAnalytics).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
        groupBy: 'monthly',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should reject invalid groupBy parameter', async () => {
      // Arrange
      req.query = { groupBy: 'invalid' };

      // Act
      await getSalesAnalytics(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid groupBy parameter. Must be one of: daily, weekly, monthly',
      });
      expect(dashboardService.getSalesAnalytics).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Aggregation error');
      dashboardService.getSalesAnalytics.mockRejectedValue(error);

      // Act
      await getSalesAnalytics(req, res);

      // Assert
      expect(res.status).toHaveBeenCalled();
    });
  });

  describe('getTopProducts', () => {
    it('should get top products successfully', async () => {
      // Arrange
      const mockTopProducts = {
        top_products: [
          {
            product_id: '507f1f77bcf86cd799439011',
            product_slug: 'macbook-pro-14',
            product_name: 'MacBook Pro 14-inch',
            category: 'Laptops',
            brand: 'Apple',
            total_quantity_sold: 50,
            total_revenue: 5000000,
            order_count: 45,
            average_price: 100000,
            image_url: 'https://example.com/image.jpg',
          },
        ],
        top_variants: [
          {
            variant_id: '507f1f77bcf86cd799439012',
            product_name: 'MacBook Pro 14-inch',
            sku: 'MBP14-16-512-SLV',
            attributes: { RAM: '16GB', Storage: '512GB SSD' },
            total_quantity_sold: 25,
            total_revenue: 2500000,
            image_url: 'https://example.com/image.jpg',
          },
        ],
      };

      dashboardService.getTopProducts.mockResolvedValue(mockTopProducts);

      // Act
      await getTopProducts(req, res);

      // Assert
      expect(dashboardService.getTopProducts).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
        limit: undefined,
        sortBy: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTopProducts,
      });
    });

    it('should get top products with custom limit and sortBy', async () => {
      // Arrange
      req.query = { limit: '20', sortBy: 'quantity' };
      const mockTopProducts = { top_products: [], top_variants: [] };

      dashboardService.getTopProducts.mockResolvedValue(mockTopProducts);

      // Act
      await getTopProducts(req, res);

      // Assert
      expect(dashboardService.getTopProducts).toHaveBeenCalledWith({
        startDate: undefined,
        endDate: undefined,
        limit: '20',
        sortBy: 'quantity',
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should reject invalid sortBy parameter', async () => {
      // Arrange
      req.query = { sortBy: 'invalid' };

      // Act
      await getTopProducts(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid sortBy parameter. Must be one of: revenue, quantity',
      });
      expect(dashboardService.getTopProducts).not.toHaveBeenCalled();
    });

    it('should reject invalid limit parameter', async () => {
      // Arrange
      req.query = { limit: 'abc' };

      // Act
      await getTopProducts(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Limit must be a number between 1 and 100',
      });
      expect(dashboardService.getTopProducts).not.toHaveBeenCalled();
    });

    it('should reject limit out of range', async () => {
      // Arrange
      req.query = { limit: '150' };

      // Act
      await getTopProducts(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(dashboardService.getTopProducts).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      // Arrange
      const error = new Error('Database error');
      dashboardService.getTopProducts.mockRejectedValue(error);

      // Act
      await getTopProducts(req, res);

      // Assert
      expect(res.status).toHaveBeenCalled();
    });
  });
});
