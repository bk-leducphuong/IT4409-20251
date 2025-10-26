import Brand from '../models/brand.js';

// Tạo thương hiệu mới
export const createBrand = async (brandData) => {
  try {
    const { name, logo_url } = brandData;

    // Kiểm tra tên thương hiệu đã tồn tại
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      throw new Error('Tên thương hiệu đã tồn tại!');
    }

    // Tạo thương hiệu
    const brand = await Brand.create({
      name,
      logo_url: logo_url || null,
    });

    return brand;
  } catch (error) {
    throw new Error(`Không thể tạo thương hiệu: ${error.message}`);
  }
};

// Cập nhật thương hiệu
export const updateBrand = async (brandId, updateData) => {
  try {
    // Nếu có tên mới, kiểm tra trùng lặp
    if (updateData.name) {
      const existingBrand = await Brand.findOne({
        name: updateData.name,
        _id: { $ne: brandId },
      });
      if (existingBrand) {
        throw new Error('Tên thương hiệu đã tồn tại!');
      }
    }

    const brand = await Brand.findByIdAndUpdate(
      brandId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return brand;
  } catch (error) {
    throw new Error(`Không thể cập nhật thương hiệu: ${error.message}`);
  }
};

// Xóa thương hiệu
export const deleteBrand = async (brandId) => {
  try {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return null;
    }

    // Note: Nếu muốn kiểm tra xem có sản phẩm nào đang dùng brand này không,
    // cần import Product model và thêm logic kiểm tra

    // Xóa thương hiệu
    await Brand.findByIdAndDelete(brandId);

    return true;
  } catch (error) {
    throw new Error(`Không thể xóa thương hiệu: ${error.message}`);
  }
};

export default {
  createBrand,
  updateBrand,
  deleteBrand,
};
