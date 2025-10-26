import categoryService from '../services/category.service.js';

// GET /api/categories - Lấy danh sách tất cả danh mục
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();

    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/categories/:slug - Lấy chi tiết danh mục theo slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục',
      });
    }

    res.status(200).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getCategories,
  getCategoryBySlug,
};
