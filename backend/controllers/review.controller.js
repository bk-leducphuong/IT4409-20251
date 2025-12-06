import reviewService from '../services/review.service.js';

// GET /api/products/:slug/reviews - Lấy danh sách reviews của sản phẩm
export const getProductReviews = async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating, verified_only, sort_by = 'newest', page = 1, limit = 10 } = req.query;

    const filters = { rating, verified_only, sort_by, page, limit };
    const result = await reviewService.getProductReviews(slug, filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/products/:slug/reviews - Thêm review cho sản phẩm
export const addReview = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user._id;
    const { rating, title, comment, images } = req.body;

    // Validate required fields
    if (rating === undefined || rating === null || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating và comment là bắt buộc',
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating phải từ 1 đến 5',
      });
    }

    const reviewData = { rating, title, comment, images };
    const review = await reviewService.addReview(slug, userId, reviewData);

    res.status(201).json({
      success: true,
      message: 'Đã thêm đánh giá thành công',
      data: { review },
    });
  } catch (error) {
    if (error.message.includes('đã đánh giá')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/reviews/:id - Cập nhật review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { rating, title, comment, images } = req.body;

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating phải từ 1 đến 5',
      });
    }

    const updateData = { rating, title, comment, images };
    const review = await reviewService.updateReview(id, userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Đã cập nhật đánh giá thành công',
      data: { review },
    });
  } catch (error) {
    if (error.message.includes('không có quyền') || error.message.includes('Không tìm thấy')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/reviews/:id - Xóa review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await reviewService.deleteReview(id, userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    if (error.message.includes('không có quyền') || error.message.includes('Không tìm thấy')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/reviews/:id/helpful - Đánh dấu review hữu ích
export const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await reviewService.markReviewHelpful(id, userId);

    res.status(200).json({
      success: true,
      message: result.is_helpful ? 'Đã đánh dấu hữu ích' : 'Đã bỏ đánh dấu hữu ích',
      data: result,
    });
  } catch (error) {
    if (error.message.includes('Không tìm thấy')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
};
