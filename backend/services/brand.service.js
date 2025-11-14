import Brand from '../models/brand.js';

// Lấy danh sách tất cả thương hiệu
export const getBrands = async () => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    return brands;
  } catch (error) {
    throw new Error(`Không thể lấy danh sách thương hiệu: ${error.message}`);
  }
};

// Lấy chi tiết thương hiệu theo ID
export const getBrandById = async (id) => {
  try {
    const brand = await Brand.findById(id);
    return brand;
  } catch (error) {
    throw new Error(`Không thể lấy chi tiết thương hiệu: ${error.message}`);
  }
};

export default {
  getBrands,
  getBrandById,
};
