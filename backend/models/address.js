import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Vui lòng nhập họ tên'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Vui lòng nhập số điện thoại'],
      trim: true,
    },
    addressLine1: {
      type: String,
      required: [true, 'Vui lòng nhập địa chỉ'],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Vui lòng nhập thành phố'],
      trim: true,
    },
    province: {
      type: String,
      required: [true, 'Vui lòng nhập tỉnh/thành phố'],
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Vui lòng nhập quốc gia'],
      default: 'Vietnam',
      trim: true,
    },
    addressType: {
      type: String,
      enum: ['shipping', 'billing', 'both'],
      default: 'both',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
addressSchema.index({ user: 1, deleted: 0 });
addressSchema.index({ user: 1, isDefault: 1 });

// Virtual for full address
addressSchema.virtual('fullAddress').get(function () {
  let address = this.addressLine1;
  if (this.addressLine2) {
    address += ', ' + this.addressLine2;
  }
  address += ', ' + this.city;
  address += ', ' + this.province;
  if (this.postalCode) {
    address += ', ' + this.postalCode;
  }
  address += ', ' + this.country;
  return address;
});

// Ensure only one default address per user
addressSchema.pre('save', async function (next) {
  if (this.isDefault && this.isModified('isDefault')) {
    // Remove default flag from other addresses of this user
    await mongoose.model('Address').updateMany(
      {
        user: this.user,
        _id: { $ne: this._id },
        deleted: false,
      },
      { isDefault: false },
    );
  }
  next();
});

// Enable virtuals in JSON
addressSchema.set('toJSON', { virtuals: true });
addressSchema.set('toObject', { virtuals: true });

const Address = mongoose.model('Address', addressSchema, 'addresses');

export default Address;
