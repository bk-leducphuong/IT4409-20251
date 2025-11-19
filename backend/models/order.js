import mongoose from "mongoose";
const orderItemSchema = new mongoose.Schema(
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
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
  },
  {
    _id: false, // Don't create _id for subdocuments
  },
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    total_amount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    shipping_address: {
        type: String,
        required: true,
    },
    payment_method: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model('Order', orderSchema, 'orders');

export default Order;