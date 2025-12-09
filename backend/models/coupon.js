import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    // Coupon code (e.g., "SUMMER2024", "SAVE20")
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    
    // Description of the coupon
    description: {
      type: String,
      required: true,
    },
    
    // Discount type: percentage, fixed_amount, free_shipping
    discount_type: {
      type: String,
      enum: ['percentage', 'fixed_amount', 'free_shipping'],
      required: true,
    },
    
    // Discount value
    // - For percentage: value between 0-100 (e.g., 20 for 20%)
    // - For fixed_amount: amount in currency (e.g., 50000 for 50,000 VND)
    // - For free_shipping: not used (set to 0)
    discount_value: {
      type: Number,
      required: function() {
        return this.discount_type !== 'free_shipping';
      },
      min: 0,
      validate: {
        validator: function(value) {
          if (this.discount_type === 'percentage') {
            return value >= 0 && value <= 100;
          }
          return value >= 0;
        },
        message: 'Percentage discount must be between 0 and 100',
      },
    },
    
    // Maximum discount amount (only for percentage discounts)
    // Example: 20% off with max discount of 100,000 VND
    max_discount_amount: {
      type: Number,
      min: 0,
      default: null,
    },
    
    // Minimum order value required to use this coupon
    min_order_value: {
      type: Number,
      min: 0,
      default: 0,
    },
    
    // Usage limits
    // Total number of times this coupon can be used (across all users)
    usage_limit: {
      type: Number,
      min: 0,
      default: null, // null means unlimited
    },
    
    // Number of times this coupon can be used per user
    usage_limit_per_user: {
      type: Number,
      min: 0,
      default: 1,
    },
    
    // Current usage count
    usage_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Track which users have used this coupon and how many times
    used_by: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        usage_count: {
          type: Number,
          default: 1,
          min: 1,
        },
        last_used_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    // Active status
    is_active: {
      type: Boolean,
      default: true,
    },
    
    // Valid from date
    valid_from: {
      type: Date,
      required: true,
      default: Date.now,
    },
    
    // Valid until date (expiration)
    valid_until: {
      type: Date,
      required: true,
    },
    
    // Created by admin
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ is_active: 1, valid_from: 1, valid_until: 1 });
couponSchema.index({ valid_until: 1 });

// Virtual to check if coupon is currently valid
couponSchema.virtual('is_valid').get(function() {
  const now = new Date();
  return (
    this.is_active &&
    this.valid_from <= now &&
    this.valid_until >= now &&
    (this.usage_limit === null || this.usage_count < this.usage_limit)
  );
});

// Virtual to check if coupon is expired
couponSchema.virtual('is_expired').get(function() {
  return new Date() > this.valid_until;
});

// Method to check if user can use this coupon
couponSchema.methods.canBeUsedBy = function(userId) {
  if (!this.is_valid) {
    return { valid: false, reason: 'Coupon is not valid or has expired' };
  }
  
  const userUsage = this.used_by.find(
    (usage) => usage.user_id.toString() === userId.toString()
  );
  
  if (userUsage && userUsage.usage_count >= this.usage_limit_per_user) {
    return { 
      valid: false, 
      reason: `You have already used this coupon the maximum number of times (${this.usage_limit_per_user})` 
    };
  }
  
  return { valid: true };
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(subtotal, shippingFee = 0) {
  if (!this.is_valid) {
    return 0;
  }
  
  // Check minimum order value
  if (subtotal < this.min_order_value) {
    return 0;
  }
  
  let discountAmount = 0;
  
  switch (this.discount_type) {
    case 'percentage':
      discountAmount = (subtotal * this.discount_value) / 100;
      // Apply max discount limit if set
      if (this.max_discount_amount && discountAmount > this.max_discount_amount) {
        discountAmount = this.max_discount_amount;
      }
      break;
      
    case 'fixed_amount':
      discountAmount = this.discount_value;
      // Don't allow discount to exceed subtotal
      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }
      break;
      
    case 'free_shipping':
      discountAmount = shippingFee;
      break;
      
    default:
      discountAmount = 0;
  }
  
  return Math.round(discountAmount);
};

// Method to record usage
couponSchema.methods.recordUsage = async function(userId) {
  const userUsage = this.used_by.find(
    (usage) => usage.user_id.toString() === userId.toString()
  );
  
  if (userUsage) {
    userUsage.usage_count += 1;
    userUsage.last_used_at = new Date();
  } else {
    this.used_by.push({
      user_id: userId,
      usage_count: 1,
      last_used_at: new Date(),
    });
  }
  
  this.usage_count += 1;
  await this.save();
};

// Ensure virtuals are included in JSON
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

const Coupon = mongoose.model('Coupon', couponSchema, 'coupons');

export default Coupon;
