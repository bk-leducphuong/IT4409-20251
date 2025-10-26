import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    original_price: {
      type: Number,
      default: null,
      min: 0,
    },
    stock_quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    main_image_url: {
      type: String,
      required: true,
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Example: { "RAM": "16GB", "Storage": "512GB SSD", "Color": "Silver" }
    },
  },
  {
    timestamps: true,
  },
);

const ProductVariant = mongoose.model('ProductVariant', productVariantSchema, 'product_variants');

export default ProductVariant;
