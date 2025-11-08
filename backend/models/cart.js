import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product_variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    _id: false, // Don't create _id for subdocuments
  },
);

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
cartSchema.index({ user_id: 1 });

const Cart = mongoose.model('Cart', cartSchema, 'carts');

export default Cart;
