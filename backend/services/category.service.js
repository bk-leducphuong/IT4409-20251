import Category from '../models/category.js';

// Lấy danh sách tất cả danh mục (bao gồm danh mục cha-con)
export const getCategories = async () => {
  try {
    const categories = await Category.find()
      .populate('parent_category_id', 'name slug')
      .sort({ createdAt: -1 });

    return categories;
  } catch (error) {
    throw new Error(`Không thể lấy danh sách danh mục: ${error.message}`);
  }
};

// Lấy chi tiết danh mục theo slug
export const getCategoryBySlug = async (slug) => {
  try {
    const category = await Category.findOne({ slug }).populate('parent_category_id', 'name slug');

    if (!category) {
      return null;
    }

    // Lấy các danh mục con (nếu có)
    const subCategories = await Category.find({ parent_category_id: category._id });

    return {
      ...category.toJSON(),
      subCategories,
    };
  } catch (error) {
    throw new Error(`Không thể lấy chi tiết danh mục: ${error.message}`);
  }
};

export default {
  getCategories,
  getCategoryBySlug,
};
