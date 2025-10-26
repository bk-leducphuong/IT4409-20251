import adminBrandService from '../services/admin.brand.service.js';

// POST /api/admin/brands - Tạo thương hiệu mới
export const createBrand = async (req, res) => {
  try {
    const { name, logo_url } = req.body;

    // Validate đầu vào
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền tên thương hiệu',
      });
    }

    const brand = await adminBrandService.createBrand({
      name,
      logo_url,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo thương hiệu thành công!',
      data: { brand },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/admin/brands/:id - Cập nhật thương hiệu
export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const brand = await adminBrandService.updateBrand(id, updateData);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thương hiệu',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thương hiệu thành công!',
      data: { brand },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/admin/brands/:id - Xóa thương hiệu
export const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await adminBrandService.deleteBrand(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thương hiệu',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa thương hiệu thành công!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createBrand,
  updateBrand,
  deleteBrand,
};
