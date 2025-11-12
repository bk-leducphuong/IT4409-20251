import productService from '../services/product.service.js';

// GET /api/products - Lấy danh sách sản phẩm với filters và pagination
export const getProducts = async (req, res) => {
  try {
    const { category, brand, search, sort_by = 'newest', page = 1, limit = 20 } = req.query;

    const filters = { category, brand, search, sort_by, page, limit };
    const result = await productService.getProducts(filters);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/products/:slug - Lấy chi tiết sản phẩm (bao gồm tất cả variants)
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await productService.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getProducts,
  getProductBySlug,
};
