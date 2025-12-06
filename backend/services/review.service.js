import Review from '../models/review.js';
import Product from '../models/product.js';
import Order from '../models/order.js';
import mongoose from 'mongoose';

// Lấy danh sách reviews của sản phẩm với filters và pagination
export const getProductReviews = async (slug, filters) => {
  try {
    const { rating, verified_only = false, sort_by = 'newest', page = 1, limit = 10 } = filters;

    // Tìm product theo slug
    const product = await Product.findOne({ slug });
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }

    // Build query
    const query = {
      product_id: product._id,
      deleted: false,
    };

    // Filter by rating
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Filter by verified purchase
    if (verified_only === 'true' || verified_only === true) {
      query.verified_purchase = true;
    }

    // Sorting
    let sort = {};
    switch (sort_by) {
      case 'helpful':
        sort = { helpful_count: -1, createdAt: -1 };
        break;
      case 'rating_high':
        sort = { rating: -1, createdAt: -1 };
        break;
      case 'rating_low':
        sort = { rating: 1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sort = { createdAt: -1 };
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get reviews
    const reviews = await Review.find(query)
      .populate('user_id', 'fullName avatar')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await Review.countDocuments(query);

    // Get rating statistics
    const ratingStats = await Review.aggregate([
      { $match: { product_id: product._id, deleted: false } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ]);

    const stats = ratingStats[0] || {
      averageRating: 0,
      totalReviews: 0,
      rating5: 0,
      rating4: 0,
      rating3: 0,
      rating2: 0,
      rating1: 0,
    };

    return {
      reviews,
      statistics: {
        averageRating: stats.averageRating ? parseFloat(stats.averageRating.toFixed(1)) : 0,
        totalReviews: stats.totalReviews,
        ratingDistribution: {
          5: stats.rating5,
          4: stats.rating4,
          3: stats.rating3,
          2: stats.rating2,
          1: stats.rating1,
        },
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  } catch (error) {
    throw new Error(`Không thể lấy danh sách đánh giá: ${error.message}`);
  }
};

// Thêm review mới
export const addReview = async (slug, userId, reviewData) => {
  try {
    const { rating, title, comment, images } = reviewData;

    // Tìm product theo slug
    const product = await Product.findOne({ slug });
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }

    // Kiểm tra user đã review sản phẩm này chưa
    const existingReview = await Review.findOne({
      product_id: product._id,
      user_id: userId,
      deleted: false,
    });

    if (existingReview) {
      throw new Error('Bạn đã đánh giá sản phẩm này rồi');
    }

    // Kiểm tra xem user đã mua sản phẩm này chưa
    const hasOrder = await Order.findOne({
      user_id: userId,
      'items.product_id': product._id,
      status: 'delivered',
    });

    // Tạo review mới
    const review = new Review({
      product_id: product._id,
      user_id: userId,
      rating,
      title: title || '',
      comment,
      images: images || [],
      verified_purchase: !!hasOrder,
    });

    await review.save();

    // Populate user info
    await review.populate('user_id', 'fullName avatar');

    return review;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Bạn đã đánh giá sản phẩm này rồi');
    }
    throw new Error(`Không thể tạo đánh giá: ${error.message}`);
  }
};

// Cập nhật review
export const updateReview = async (reviewId, userId, updateData) => {
  try {
    const { rating, title, comment, images } = updateData;

    // Tìm review
    const review = await Review.findOne({
      _id: reviewId,
      deleted: false,
    });

    if (!review) {
      throw new Error('Không tìm thấy đánh giá');
    }

    // Kiểm tra quyền sở hữu
    if (review.user_id.toString() !== userId.toString()) {
      throw new Error('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    // Update fields
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();

    // Populate user info
    await review.populate('user_id', 'fullName avatar');

    return review;
  } catch (error) {
    throw new Error(`Không thể cập nhật đánh giá: ${error.message}`);
  }
};

// Xóa review (soft delete)
export const deleteReview = async (reviewId, userId) => {
  try {
    // Tìm review
    const review = await Review.findOne({
      _id: reviewId,
      deleted: false,
    });

    if (!review) {
      throw new Error('Không tìm thấy đánh giá');
    }

    // Kiểm tra quyền sở hữu
    if (review.user_id.toString() !== userId.toString()) {
      throw new Error('Bạn không có quyền xóa đánh giá này');
    }

    // Soft delete
    review.deleted = true;
    await review.save();

    return { message: 'Đã xóa đánh giá thành công' };
  } catch (error) {
    throw new Error(`Không thể xóa đánh giá: ${error.message}`);
  }
};

// Đánh dấu review hữu ích
export const markReviewHelpful = async (reviewId, userId) => {
  try {
    // Tìm review
    const review = await Review.findOne({
      _id: reviewId,
      deleted: false,
    });

    if (!review) {
      throw new Error('Không tìm thấy đánh giá');
    }

    // Kiểm tra user đã đánh dấu helpful chưa
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const hasMarked = review.helpful_users.some((id) => id.equals(userIdObj));

    if (hasMarked) {
      // Nếu đã đánh dấu thì bỏ đánh dấu (toggle)
      review.helpful_users = review.helpful_users.filter((id) => !id.equals(userIdObj));
      review.helpful_count = Math.max(0, review.helpful_count - 1);
    } else {
      // Thêm đánh dấu helpful
      review.helpful_users.push(userIdObj);
      review.helpful_count += 1;
    }

    await review.save();

    return {
      helpful_count: review.helpful_count,
      is_helpful: !hasMarked,
    };
  } catch (error) {
    throw new Error(`Không thể đánh dấu đánh giá hữu ích: ${error.message}`);
  }
};

export default {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
};
