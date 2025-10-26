import adminCategoryService from '../services/admin.category.service.js';

// POST /api/admin/categories - Tạo danh mục mới
export const createCategory = async (req, res) => {
  try {
    const { name, slug, parent_category_id } = req.body;

    // Validate đầu vào
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (name, slug)',
      });
    }

    const category = await adminCategoryService.createCategory({
      name,
      slug,
      parent_category_id,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công!',
      data: { category },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/admin/categories/:id - Cập nhật danh mục
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await adminCategoryService.updateCategory(id, updateData);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công!',
      data: { category },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/admin/categories/:id - Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await adminCategoryService.deleteCategory(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createCategory,
  updateCategory,
  deleteCategory,
};
