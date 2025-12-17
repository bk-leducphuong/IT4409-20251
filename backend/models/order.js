import mongoose from 'mongoose';

// Order Item Schema - stores snapshot of product at time of order
const orderItemSchema = new mongoose.Schema({
  product_variant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: true,
  },
  // Snapshot of product details at time of order
  product_name: {
    type: String,
    required: true,
  },
  product_slug: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
  attributes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Example: { "RAM": "16GB", "Storage": "512GB SSD", "Color": "Silver" }
  },
  // Price at time of order (historical price)
  unit_price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  // Calculated field: unit_price * quantity
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  _id: false, // Don't create _id for subdocuments
});

// Order Schema
const orderSchema = new mongoose.Schema({
  // Order identification
  order_number: {
    type: String,
    unique: true,
    // Format: ORD-YYYYMMDD-XXXXX
    // Auto-generated in pre-save hook
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Order items
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function (items) {
        return items && items.length > 0;
      },
      message: 'Order must have at least one item',
    },
  },

  // Order status
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    required: true,
  },

  // Status history for tracking
  status_history: [{
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      required: true,
    },
    changed_at: {
      type: Date,
      default: Date.now,
    },
    note: String,
  }],

  // Shipping information
  shipping_address: {
    full_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address_line: {
      type: String,
      required: true,
    },
    city: String,
    province: String,
    postal_code: String,
    country: {
      type: String,
      default: 'Vietnam',
    },
  },

  // Pricing breakdown
  subtotal: {
    type: Number,
    required: true,
    min: 0,
    // Sum of all item subtotals
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
    // Tax amount (e.g., VAT)
  },
  shipping_fee: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    // Discount amount (from coupons, promotions, etc.)
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    // subtotal + tax + shipping_fee - discount
  },

  // Payment information
  payment_method: {
    type: String,
    enum: ['cod', 'credit_card', 'bank_transfer', 'momo', 'zalopay'],
    default: 'cod',
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'expired'],  
    default: 'pending',
  },
  paid_at: Date,

  // 🆕 Bank transfer information 
  bank_transfer: {
    bank_name: String,
    account_name: String,
    account_number: String,
    amount: Number,
    transfer_date: Date,
    reference: String,
    receipt_url: String,
    transaction_id: String,      // Mã giao dịch từ bank
    paid_at: Date,                // Thời gian thanh toán
    paid_amount: Number,          // Số tiền thực tế nhận
    bank_code: String,            // Mã ngân hàng (VD: MB, VCB)
  },
  
  // 🆕 Thời hạn thanh toán cho bank_transfer
  reserved_until: { 
    type: Date 
  },

  // Shipping tracking
  tracking_number: String,
  carrier: String,
  shipped_at: Date,
  delivered_at: Date,

  // Additional notes
  customer_note: String,
  admin_note: String,

  // Cancellation
  cancelled_at: Date,
  cancellation_reason: String,
}, {
  timestamps: true,
});

// Indexes for faster queries
orderSchema.index({
  user_id: 1,
  createdAt: -1
});
orderSchema.index({
  order_number: 1
});
orderSchema.index({
  status: 1
});
orderSchema.index({
  createdAt: -1
});
// 🆕 Index cho auto payment confirmation
orderSchema.index({
  payment_method: 1,
  payment_status: 1,
  reserved_until: 1
});
orderSchema.index({
  'bank_transfer.reference': 1
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.order_number) {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

    // Get start and end of today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Count orders created today
    const count = await mongoose.model('Order').countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const orderNum = String(count + 1).padStart(5, '0');
    this.order_number = `ORD-${dateStr}-${orderNum}`;
  }

  // Initialize status history if not exists
  if (this.isNew && (!this.status_history || this.status_history.length === 0)) {
    this.status_history = [{
      status: this.status,
      changed_at: new Date(),
      note: 'Order created',
    }];
  }

  next();
});

// Method to update status with history tracking
orderSchema.methods.updateStatus = function (newStatus, note = '') {
  this.status = newStatus;
  this.status_history.push({
    status: newStatus,
    changed_at: new Date(),
    note: note,
  });

  // Update timestamps based on status
  if (newStatus === 'shipped' && !this.shipped_at) {
    this.shipped_at = new Date();
  } else if (newStatus === 'delivered' && !this.delivered_at) {
    this.delivered_at = new Date();
  } else if (newStatus === 'cancelled' && !this.cancelled_at) {
    this.cancelled_at = new Date();
  }
};

// Virtual for checking if order can be cancelled
orderSchema.virtual('can_cancel').get(function () {
  return ['pending', 'processing'].includes(this.status);
});

// Virtual for checking if order is modifiable
orderSchema.virtual('is_modifiable').get(function () {
  return ['pending'].includes(this.status);
});

// 🆕 Virtual for checking if payment is expired
orderSchema.virtual('is_payment_expired').get(function () {
  if (!this.reserved_until) return false;
  return this.payment_status === 'pending' && new Date() > this.reserved_until;
});

const Order = mongoose.model('Order', orderSchema, 'orders');

export default Order;