import adminProductService from '../services/admin.product.service.js';

// ============ Product Controllers ============

// POST /api/admin/products - Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, slug, description, category_id, brand_id } = req.body;

    // Validate đầu vào
    if (!name || !slug || !category_id || !brand_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (name, slug, category_id, brand_id)',
      });
    }

    const product = await adminProductService.createProduct({
      name,
      slug,
      description,
      category_id,
      brand_id,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công!',
      data: { product },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/admin/products/:id - Cập nhật sản phẩm gốc
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await adminProductService.updateProduct(id, updateData);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công!',
      data: { product },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/admin/products/:id - Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await adminProductService.deleteProduct(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============ Variant Controllers ============

// POST /api/admin/products/:id/variants - Thêm biến thể mới
export const createVariant = async (req, res) => {
  try {
    const { id: product_id } = req.params;
    const { sku, price, original_price, stock_quantity, main_image_url, attributes } = req.body;

    // Validate đầu vào
    if (!sku || !price || !main_image_url) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (sku, price, main_image_url)',
      });
    }

    const variant = await adminProductService.createVariant({
      product_id,
      sku,
      price,
      original_price,
      stock_quantity,
      main_image_url,
      attributes,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo biến thể thành công!',
      data: { variant },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/admin/variants/:variant_id - Cập nhật biến thể
export const updateVariant = async (req, res) => {
  try {
    const { variant_id } = req.params;
    const updateData = req.body;

    const variant = await adminProductService.updateVariant(variant_id, updateData);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật biến thể thành công!',
      data: { variant },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/admin/variants/:variant_id - Xóa biến thể
export const deleteVariant = async (req, res) => {
  try {
    const { variant_id } = req.params;

    const result = await adminProductService.deleteVariant(variant_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biến thể',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa biến thể thành công!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  createVariant,
  updateVariant,
  deleteVariant,
};
