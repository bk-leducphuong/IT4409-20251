import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      maxlength: 200,
      default: '',
    },
    comment: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 5;
        },
        message: 'Maximum 5 images allowed per review',
      },
    },
    helpful_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    helpful_users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    verified_purchase: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index để đảm bảo 1 user chỉ review 1 product 1 lần
reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

// Index cho query theo product và rating
reviewSchema.index({ product_id: 1, rating: 1 });

// Index cho query những review có verified purchase
reviewSchema.index({ product_id: 1, verified_purchase: 1 });

const Review = mongoose.model('Review', reviewSchema, 'reviews');

export default Review;
