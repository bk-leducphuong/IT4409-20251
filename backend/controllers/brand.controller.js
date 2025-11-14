import brandService from '../services/brand.service.js';

// GET /api/brands - Lấy danh sách tất cả thương hiệu
export const getBrands = async (req, res) => {
  try {
    const brands = await brandService.getBrands();

    res.status(200).json({
      success: true,
      data: { brands },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/brands/:id - Lấy chi tiết thương hiệu
export const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await brandService.getBrandById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thương hiệu',
      });
    }

    res.status(200).json({
      success: true,
      data: { brand },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getBrands,
  getBrandById,
};
