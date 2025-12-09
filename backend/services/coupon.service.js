import Coupon from '../models/coupon.js';
import Cart from '../models/cart.js';

class CouponService {
  /**
   * Validate and apply coupon to cart
   */
  async applyCouponToCart(userId, couponCode, cartData) {
    // Find the coupon by code
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase() 
    });

    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    // Check if coupon is valid
    if (!coupon.is_valid) {
      if (coupon.is_expired) {
        throw new Error('This coupon has expired');
      }
      if (!coupon.is_active) {
        throw new Error('This coupon is no longer active');
      }
      if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
        throw new Error('This coupon has reached its usage limit');
      }
      throw new Error('This coupon is not valid');
    }

    // Check if user can use this coupon
    const canUse = coupon.canBeUsedBy(userId);
    if (!canUse.valid) {
      throw new Error(canUse.reason);
    }

    // Calculate cart subtotal
    const subtotal = cartData.subtotal || 0;
    const shippingFee = cartData.shipping_fee || 0;

    // Check minimum order value
    if (subtotal < coupon.min_order_value) {
      throw new Error(
        `Minimum order value of ${coupon.min_order_value.toLocaleString()} VND is required to use this coupon`
      );
    }

    // Calculate discount
    const discountAmount = coupon.calculateDiscount(subtotal, shippingFee);

    if (discountAmount === 0) {
      throw new Error('This coupon cannot be applied to your order');
    }

    // Update cart with applied coupon
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      throw new Error('Cart not found');
    }

    cart.applied_coupon = {
      coupon_id: coupon._id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: discountAmount,
    };

    await cart.save();

    return {
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: discountAmount,
      },
      cart: cart,
    };
  }

  /**
   * Remove coupon from cart
   */
  async removeCouponFromCart(userId) {
    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      throw new Error('Cart not found');
    }

    if (!cart.applied_coupon || !cart.applied_coupon.coupon_id) {
      throw new Error('No coupon applied to cart');
    }

    cart.applied_coupon = undefined;
    await cart.save();

    return {
      success: true,
      message: 'Coupon removed successfully',
      cart: cart,
    };
  }

  /**
   * Validate coupon code without applying
   */
  async validateCoupon(userId, couponCode, subtotal = 0) {
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase() 
    });

    if (!coupon) {
      return {
        valid: false,
        message: 'Invalid coupon code',
      };
    }

    if (!coupon.is_valid) {
      return {
        valid: false,
        message: coupon.is_expired 
          ? 'This coupon has expired' 
          : 'This coupon is not valid',
      };
    }

    const canUse = coupon.canBeUsedBy(userId);
    if (!canUse.valid) {
      return {
        valid: false,
        message: canUse.reason,
      };
    }

    if (subtotal > 0 && subtotal < coupon.min_order_value) {
      return {
        valid: false,
        message: `Minimum order value of ${coupon.min_order_value.toLocaleString()} VND is required`,
      };
    }

    return {
      valid: true,
      message: 'Coupon is valid',
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_value: coupon.min_order_value,
      },
    };
  }

  /**
   * Create a new coupon (admin)
   */
  async createCoupon(couponData, adminUserId) {
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ 
      code: couponData.code.toUpperCase() 
    });

    if (existingCoupon) {
      throw new Error('Coupon code already exists');
    }

    // Validate dates
    const validFrom = new Date(couponData.valid_from);
    const validUntil = new Date(couponData.valid_until);

    if (validUntil <= validFrom) {
      throw new Error('Expiration date must be after start date');
    }

    // Create coupon
    const coupon = new Coupon({
      ...couponData,
      code: couponData.code.toUpperCase(),
      created_by: adminUserId,
      valid_from: validFrom,
      valid_until: validUntil,
    });

    await coupon.save();

    return {
      success: true,
      message: 'Coupon created successfully',
      coupon: coupon,
    };
  }

  /**
   * Update coupon (admin)
   */
  async updateCoupon(couponId, updateData) {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    // If updating code, check for duplicates
    if (updateData.code && updateData.code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: updateData.code.toUpperCase(),
        _id: { $ne: couponId },
      });

      if (existingCoupon) {
        throw new Error('Coupon code already exists');
      }
      updateData.code = updateData.code.toUpperCase();
    }

    // Validate dates if provided
    if (updateData.valid_from || updateData.valid_until) {
      const validFrom = updateData.valid_from 
        ? new Date(updateData.valid_from) 
        : coupon.valid_from;
      const validUntil = updateData.valid_until 
        ? new Date(updateData.valid_until) 
        : coupon.valid_until;

      if (validUntil <= validFrom) {
        throw new Error('Expiration date must be after start date');
      }
    }

    // Update coupon
    Object.assign(coupon, updateData);
    await coupon.save();

    return {
      success: true,
      message: 'Coupon updated successfully',
      coupon: coupon,
    };
  }

  /**
   * Delete coupon (admin)
   */
  async deleteCoupon(couponId) {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    await Coupon.deleteOne({ _id: couponId });

    return {
      success: true,
      message: 'Coupon deleted successfully',
    };
  }

  /**
   * Get coupon by ID (admin)
   */
  async getCouponById(couponId) {
    const coupon = await Coupon.findById(couponId)
      .populate('created_by', 'full_name email');

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    return coupon;
  }

  /**
   * Get all coupons with filters (admin)
   */
  async getAllCoupons(filters = {}) {
    const {
      page = 1,
      limit = 20,
      is_active,
      discount_type,
      search,
      sort = '-createdAt',
    } = filters;

    const query = {};

    // Filter by active status
    if (is_active !== undefined) {
      query.is_active = is_active === 'true' || is_active === true;
    }

    // Filter by discount type
    if (discount_type) {
      query.discount_type = discount_type;
    }

    // Search by code or description
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [coupons, total] = await Promise.all([
      Coupon.find(query)
        .populate('created_by', 'full_name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Coupon.countDocuments(query),
    ]);

    return {
      coupons,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get coupon statistics (admin)
   */
  async getCouponStats(couponId) {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    const stats = {
      code: coupon.code,
      total_usage: coupon.usage_count,
      unique_users: coupon.used_by.length,
      usage_limit: coupon.usage_limit,
      usage_remaining: coupon.usage_limit 
        ? coupon.usage_limit - coupon.usage_count 
        : 'Unlimited',
      is_active: coupon.is_active,
      is_expired: coupon.is_expired,
      is_valid: coupon.is_valid,
      valid_from: coupon.valid_from,
      valid_until: coupon.valid_until,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
    };

    return stats;
  }

  /**
   * Record coupon usage when order is placed
   */
  async recordCouponUsage(couponId, userId) {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      throw new Error('Coupon not found');
    }

    await coupon.recordUsage(userId);

    return {
      success: true,
      message: 'Coupon usage recorded',
    };
  }
}

export default new CouponService();
