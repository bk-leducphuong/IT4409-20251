import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    logo_url: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Brand = mongoose.model('Brand', brandSchema, 'brands');

export default Brand;
