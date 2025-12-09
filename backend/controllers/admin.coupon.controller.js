import couponService from '../services/coupon.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// POST /api/admin/coupons - Create new coupon
export const createCoupon = async (req, res) => {
  try {
    const adminUserId = req.user._id;
    const couponData = req.body;

    // Validation
    const requiredFields = ['code', 'description', 'discount_type', 'valid_until'];
    const missingFields = requiredFields.filter((field) => !couponData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Thiếu các trường bắt buộc: ${missingFields.join(', ')}`,
      });
    }

    // Validate discount_value for non-free_shipping types
    if (
      couponData.discount_type !== 'free_shipping' &&
      (couponData.discount_value === undefined || couponData.discount_value === null)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp giá trị giảm giá (discount_value)',
      });
    }

    // Validate percentage discount
    if (couponData.discount_type === 'percentage') {
      const value = parseFloat(couponData.discount_value);
      if (isNaN(value) || value < 0 || value > 100) {
        return res.status(400).json({
          success: false,
          message: 'Giá trị giảm giá theo phần trăm phải từ 0 đến 100',
        });
      }
    }

    // Validate fixed_amount discount
    if (couponData.discount_type === 'fixed_amount') {
      const value = parseFloat(couponData.discount_value);
      if (isNaN(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá trị giảm giá cố định phải lớn hơn 0',
        });
      }
    }

    const result = await couponService.createCoupon(couponData, adminUserId);

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        coupon: result.coupon,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/admin/coupons - Get all coupons with filters
export const getCoupons = async (req, res) => {
  try {
    const filters = {
      page: req.query.page || 1,
      limit: req.query.limit || 20,
      is_active: req.query.is_active,
      discount_type: req.query.discount_type,
      search: req.query.search,
      sort: req.query.sort || '-createdAt',
    };

    const result = await couponService.getAllCoupons(filters);

    res.status(200).json({
      success: true,
      data: {
        coupons: result.coupons,
        pagination: result.pagination,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/admin/coupons/:id - Get coupon by ID
export const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp ID mã giảm giá',
      });
    }

    const coupon = await couponService.getCouponById(id);

    res.status(200).json({
      success: true,
      data: {
        coupon,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// PUT /api/admin/coupons/:id - Update coupon
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp ID mã giảm giá',
      });
    }

    // Validate percentage discount if provided
    if (
      updateData.discount_type === 'percentage' &&
      updateData.discount_value !== undefined
    ) {
      const value = parseFloat(updateData.discount_value);
      if (isNaN(value) || value < 0 || value > 100) {
        return res.status(400).json({
          success: false,
          message: 'Giá trị giảm giá theo phần trăm phải từ 0 đến 100',
        });
      }
    }

    // Validate fixed_amount discount if provided
    if (
      updateData.discount_type === 'fixed_amount' &&
      updateData.discount_value !== undefined
    ) {
      const value = parseFloat(updateData.discount_value);
      if (isNaN(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: 'Giá trị giảm giá cố định phải lớn hơn 0',
        });
      }
    }

    const result = await couponService.updateCoupon(id, updateData);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        coupon: result.coupon,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// DELETE /api/admin/coupons/:id - Delete coupon
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp ID mã giảm giá',
      });
    }

    const result = await couponService.deleteCoupon(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/admin/coupons/:id/stats - Get coupon statistics
export const getCouponStats = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp ID mã giảm giá',
      });
    }

    const stats = await couponService.getCouponStats(id);

    res.status(200).json({
      success: true,
      data: {
        stats,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  getCouponStats,
};
