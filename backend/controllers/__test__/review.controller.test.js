import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
} from '../review.controller.js';
import reviewService from '../../services/review.service.js';

// Mock the review service
jest.mock('../../services/review.service.js');

describe('Review Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset all mocks
    jest.resetAllMocks();

    // Setup mock implementations
    reviewService.getProductReviews = jest.fn();
    reviewService.addReview = jest.fn();
    reviewService.updateReview = jest.fn();
    reviewService.deleteReview = jest.fn();
    reviewService.markReviewHelpful = jest.fn();

    // Mock request object
    req = {
      query: {},
      params: {},
      body: {},
      user: { _id: 'user123' },
    };

    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getProductReviews', () => {
    it('should return product reviews with default pagination', async () => {
      // Arrange
      const mockResult = {
        reviews: [
          {
            _id: 'review1',
            rating: 5,
            title: 'Tuyệt vời!',
            comment: 'Sản phẩm rất tốt',
            user_id: { fullName: 'Test User', avatar: 'avatar.jpg' },
          },
        ],
        statistics: {
          averageRating: 4.5,
          totalReviews: 10,
          ratingDistribution: { 5: 5, 4: 3, 3: 1, 2: 1, 1: 0 },
        },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 10,
          itemsPerPage: 10,
        },
      };

      req.params = { slug: 'laptop-dell-xps-15' };
      req.query = {};
      reviewService.getProductReviews.mockResolvedValue(mockResult);

      // Act
      await getProductReviews(req, res);

      // Assert
      expect(reviewService.getProductReviews).toHaveBeenCalledWith('laptop-dell-xps-15', {
        rating: undefined,
        verified_only: undefined,
        sort_by: 'newest',
        page: 1,
        limit: 10,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult,
      });
    });

    it('should return reviews with custom filters', async () => {
      // Arrange
      const mockResult = {
        reviews: [],
        statistics: {
          averageRating: 5,
          totalReviews: 3,
          ratingDistribution: { 5: 3, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 3,
          itemsPerPage: 10,
        },
      };

      req.params = { slug: 'laptop-dell-xps-15' };
      req.query = {
        rating: '5',
        verified_only: 'true',
        sort_by: 'helpful',
        page: '1',
        limit: '10',
      };
      reviewService.getProductReviews.mockResolvedValue(mockResult);

      // Act
      await getProductReviews(req, res);

      // Assert
      expect(reviewService.getProductReviews).toHaveBeenCalledWith('laptop-dell-xps-15', {
        rating: '5',
        verified_only: 'true',
        sort_by: 'helpful',
        page: '1',
        limit: '10',
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Không tìm thấy sản phẩm';
      req.params = { slug: 'non-existent' };
      reviewService.getProductReviews.mockRejectedValue(new Error(errorMessage));

      // Act
      await getProductReviews(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe('addReview', () => {
    it('should add a review successfully', async () => {
      // Arrange
      const mockReview = {
        _id: 'review1',
        product_id: 'product1',
        user_id: { _id: 'user123', fullName: 'Test User', avatar: 'avatar.jpg' },
        rating: 5,
        title: 'Tuyệt vời!',
        comment: 'Sản phẩm rất tốt',
        verified_purchase: true,
      };

      req.params = { slug: 'laptop-dell-xps-15' };
      req.body = {
        rating: 5,
        title: 'Tuyệt vời!',
        comment: 'Sản phẩm rất tốt',
        images: [],
      };
      reviewService.addReview.mockResolvedValue(mockReview);

      // Act
      await addReview(req, res);

      // Assert
      expect(reviewService.addReview).toHaveBeenCalledWith('laptop-dell-xps-15', 'user123', {
        rating: 5,
        title: 'Tuyệt vời!',
        comment: 'Sản phẩm rất tốt',
        images: [],
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đã thêm đánh giá thành công',
        data: { review: mockReview },
      });
    });

    it('should return 400 if rating is missing', async () => {
      // Arrange
      req.params = { slug: 'laptop-dell-xps-15' };
      req.body = {
        comment: 'Sản phẩm rất tốt',
      };

      // Act
      await addReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Rating và comment là bắt buộc',
      });
      expect(reviewService.addReview).not.toHaveBeenCalled();
    });

    it('should return 400 if comment is missing', async () => {
      // Arrange
      req.params = { slug: 'laptop-dell-xps-15' };
      req.body = {
        rating: 5,
      };

      // Act
      await addReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Rating và comment là bắt buộc',
      });
    });

    it('should return 400 if rating is out of range (too low)', async () => {
      // Arrange
      req.params = { slug: 'laptop-dell-xps-15' };
      req.body = {
        rating: 0,
        comment: 'Test comment',
      };

      // Act
      await addReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Rating phải từ 1 đến 5',
      });
    });

    it('should return 400 if rating is out of range (too high)', async () => {
      // Arrange
      req.params = { slug: 'laptop-dell-xps-15' };
      req.body = {
        rating: 6,
        comment: 'Test comment',
      };

      // Act
      await addReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Rating phải từ 1 đến 5',
      });
    });

    it('should return 400 if user already reviewed', async () => {
      // Arrange
      const errorMessage = 'Bạn đã đánh giá sản phẩm này rồi';
      req.params = { slug: 'laptop-dell-xps-15' };
      req.body = {
        rating: 5,
        comment: 'Test comment',
      };
      reviewService.addReview.mockRejectedValue(new Error(errorMessage));

      // Act
      await addReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe('updateReview', () => {
    it('should update a review successfully', async () => {
      // Arrange
      const mockReview = {
        _id: 'review1',
        rating: 4,
        title: 'Updated title',
        comment: 'Updated comment',
      };

      req.params = { id: 'review1' };
      req.body = {
        rating: 4,
        title: 'Updated title',
        comment: 'Updated comment',
      };
      reviewService.updateReview.mockResolvedValue(mockReview);

      // Act
      await updateReview(req, res);

      // Assert
      expect(reviewService.updateReview).toHaveBeenCalledWith('review1', 'user123', {
        rating: 4,
        title: 'Updated title',
        comment: 'Updated comment',
        images: undefined,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đã cập nhật đánh giá thành công',
        data: { review: mockReview },
      });
    });

    it('should return 400 if rating is invalid', async () => {
      // Arrange
      req.params = { id: 'review1' };
      req.body = {
        rating: 10,
      };

      // Act
      await updateReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Rating phải từ 1 đến 5',
      });
    });

    it('should return 403 if user is not the owner', async () => {
      // Arrange
      const errorMessage = 'Bạn không có quyền chỉnh sửa đánh giá này';
      req.params = { id: 'review1' };
      req.body = { comment: 'Updated comment' };
      reviewService.updateReview.mockRejectedValue(new Error(errorMessage));

      // Act
      await updateReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it('should return 403 if review not found', async () => {
      // Arrange
      const errorMessage = 'Không tìm thấy đánh giá';
      req.params = { id: 'non-existent' };
      req.body = { comment: 'Updated comment' };
      reviewService.updateReview.mockRejectedValue(new Error(errorMessage));

      // Act
      await updateReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });

  describe('deleteReview', () => {
    it('should delete a review successfully', async () => {
      // Arrange
      const mockResult = { message: 'Đã xóa đánh giá thành công' };
      req.params = { id: 'review1' };
      reviewService.deleteReview.mockResolvedValue(mockResult);

      // Act
      await deleteReview(req, res);

      // Assert
      expect(reviewService.deleteReview).toHaveBeenCalledWith('review1', 'user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: mockResult.message,
      });
    });

    it('should return 403 if user is not the owner', async () => {
      // Arrange
      const errorMessage = 'Bạn không có quyền xóa đánh giá này';
      req.params = { id: 'review1' };
      reviewService.deleteReview.mockRejectedValue(new Error(errorMessage));

      // Act
      await deleteReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it('should return 403 if review not found', async () => {
      // Arrange
      const errorMessage = 'Không tìm thấy đánh giá';
      req.params = { id: 'non-existent' };
      reviewService.deleteReview.mockRejectedValue(new Error(errorMessage));

      // Act
      await deleteReview(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('markReviewHelpful', () => {
    it('should mark a review as helpful', async () => {
      // Arrange
      const mockResult = {
        helpful_count: 5,
        is_helpful: true,
      };
      req.params = { id: 'review1' };
      reviewService.markReviewHelpful.mockResolvedValue(mockResult);

      // Act
      await markReviewHelpful(req, res);

      // Assert
      expect(reviewService.markReviewHelpful).toHaveBeenCalledWith('review1', 'user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đã đánh dấu hữu ích',
        data: mockResult,
      });
    });

    it('should unmark a review as helpful (toggle)', async () => {
      // Arrange
      const mockResult = {
        helpful_count: 4,
        is_helpful: false,
      };
      req.params = { id: 'review1' };
      reviewService.markReviewHelpful.mockResolvedValue(mockResult);

      // Act
      await markReviewHelpful(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Đã bỏ đánh dấu hữu ích',
        data: mockResult,
      });
    });

    it('should return 404 if review not found', async () => {
      // Arrange
      const errorMessage = 'Không tìm thấy đánh giá';
      req.params = { id: 'non-existent' };
      reviewService.markReviewHelpful.mockRejectedValue(new Error(errorMessage));

      // Act
      await markReviewHelpful(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Database error';
      req.params = { id: 'review1' };
      reviewService.markReviewHelpful.mockRejectedValue(new Error(errorMessage));

      // Act
      await markReviewHelpful(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: errorMessage,
      });
    });
  });
});
