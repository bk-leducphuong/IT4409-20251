import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductVariant',
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    alt_text: {
      type: String,
      maxlength: 255,
      default: null,
    },
    sort_order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient sorting by variant_id and sort_order
productImageSchema.index({ variant_id: 1, sort_order: 1 });

const ProductImage = mongoose.model('ProductImage', productImageSchema, 'product_images');

export default ProductImage;
