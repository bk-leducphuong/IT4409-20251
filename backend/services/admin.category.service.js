import Category from '../models/category.js';

// Tạo danh mục mới
export const createCategory = async (categoryData) => {
  try {
    const { name, slug, parent_category_id } = categoryData;

    // Kiểm tra slug đã tồn tại
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      throw new Error('Slug đã tồn tại!');
    }

    // Nếu có parent_category_id, kiểm tra có tồn tại không
    if (parent_category_id) {
      const parentCategory = await Category.findById(parent_category_id);
      if (!parentCategory) {
        throw new Error('Danh mục cha không tồn tại!');
      }
    }

    // Tạo danh mục
    const category = await Category.create({
      name,
      slug,
      parent_category_id: parent_category_id || null,
    });

    return category;
  } catch (error) {
    throw new Error(`Không thể tạo danh mục: ${error.message}`);
  }
};

// Cập nhật danh mục
export const updateCategory = async (categoryId, updateData) => {
  try {
    // Nếu có slug mới, kiểm tra trùng lặp
    if (updateData.slug) {
      const existingCategory = await Category.findOne({
        slug: updateData.slug,
        _id: { $ne: categoryId },
      });
      if (existingCategory) {
        throw new Error('Slug đã tồn tại!');
      }
    }

    // Nếu có parent_category_id mới, kiểm tra tồn tại và không tự tham chiếu
    if (updateData.parent_category_id) {
      if (updateData.parent_category_id.toString() === categoryId.toString()) {
        throw new Error('Danh mục không thể là danh mục cha của chính nó!');
      }

      const parentCategory = await Category.findById(updateData.parent_category_id);
      if (!parentCategory) {
        throw new Error('Danh mục cha không tồn tại!');
      }
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate('parent_category_id', 'name slug');

    return category;
  } catch (error) {
    throw new Error(`Không thể cập nhật danh mục: ${error.message}`);
  }
};

// Xóa danh mục
export const deleteCategory = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return null;
    }

    // Kiểm tra xem có danh mục con nào không
    const childCategories = await Category.find({ parent_category_id: categoryId });
    if (childCategories.length > 0) {
      throw new Error('Không thể xóa danh mục có danh mục con! Vui lòng xóa danh mục con trước.');
    }

    // Xóa danh mục
    await Category.findByIdAndDelete(categoryId);

    return true;
  } catch (error) {
    throw new Error(`Không thể xóa danh mục: ${error.message}`);
  }
};

export default {
  createCategory,
  updateCategory,
  deleteCategory,
};
