import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      maxlength: 100,
    },
    parent_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model('Category', categorySchema, 'categories');

export default Category;
