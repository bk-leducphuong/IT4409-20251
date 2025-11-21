import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    added_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false, // Don't create _id for subdocuments
  },
);

const wishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One wishlist per user
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
wishlistSchema.index({ user_id: 1 });
wishlistSchema.index({ 'items.product_id': 1 });

const Wishlist = mongoose.model('Wishlist', wishlistSchema, 'wishlists');

export default Wishlist;
