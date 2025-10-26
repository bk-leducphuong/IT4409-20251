import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';
import ProductImage from '../models/productImage.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';

// ============ Product Services ============

// Tạo sản phẩm mới
export const createProduct = async (productData) => {
  try {
    const { name, slug, description, category_id, brand_id } = productData;

    // Kiểm tra slug đã tồn tại
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      throw new Error('Slug đã tồn tại!');
    }

    // Kiểm tra category_id có tồn tại
    const category = await Category.findById(category_id);
    if (!category) {
      throw new Error('Danh mục không tồn tại!');
    }

    // Kiểm tra brand_id có tồn tại
    const brand = await Brand.findById(brand_id);
    if (!brand) {
      throw new Error('Thương hiệu không tồn tại!');
    }

    // Tạo sản phẩm
    const product = await Product.create({
      name,
      slug,
      description,
      category_id,
      brand_id,
    });

    return product;
  } catch (error) {
    throw new Error(`Không thể tạo sản phẩm: ${error.message}`);
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (productId, updateData) => {
  try {
    // Nếu có slug mới, kiểm tra trùng lặp
    if (updateData.slug) {
      const existingProduct = await Product.findOne({
        slug: updateData.slug,
        _id: { $ne: productId },
      });
      if (existingProduct) {
        throw new Error('Slug đã tồn tại!');
      }
    }

    // Nếu có category_id mới, kiểm tra tồn tại
    if (updateData.category_id) {
      const category = await Category.findById(updateData.category_id);
      if (!category) {
        throw new Error('Danh mục không tồn tại!');
      }
    }

    // Nếu có brand_id mới, kiểm tra tồn tại
    if (updateData.brand_id) {
      const brand = await Brand.findById(updateData.brand_id);
      if (!brand) {
        throw new Error('Thương hiệu không tồn tại!');
      }
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate('category_id brand_id');

    return product;
  } catch (error) {
    throw new Error(`Không thể cập nhật sản phẩm: ${error.message}`);
  }
};

// Xóa sản phẩm (cascade xóa variants và images)
export const deleteProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return null;
    }

    // Lấy tất cả variants của sản phẩm
    const variants = await ProductVariant.find({ product_id: productId });

    // Xóa tất cả images của các variants
    const variantIds = variants.map((v) => v._id);
    await ProductImage.deleteMany({ variant_id: { $in: variantIds } });

    // Xóa tất cả variants
    await ProductVariant.deleteMany({ product_id: productId });

    // Xóa sản phẩm
    await Product.findByIdAndDelete(productId);

    return true;
  } catch (error) {
    throw new Error(`Không thể xóa sản phẩm: ${error.message}`);
  }
};

// ============ Variant Services ============

// Tạo biến thể mới
export const createVariant = async (variantData) => {
  try {
    const { product_id, sku, price, original_price, stock_quantity, main_image_url, attributes } =
      variantData;

    // Kiểm tra product_id có tồn tại
    const product = await Product.findById(product_id);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại!');
    }

    // Kiểm tra SKU đã tồn tại
    const existingSku = await ProductVariant.findOne({ sku });
    if (existingSku) {
      throw new Error('SKU đã tồn tại!');
    }

    // Tạo variant
    const variant = await ProductVariant.create({
      product_id,
      sku,
      price,
      original_price,
      stock_quantity: stock_quantity || 0,
      main_image_url,
      attributes: attributes || {},
    });

    return variant;
  } catch (error) {
    throw new Error(`Không thể tạo biến thể: ${error.message}`);
  }
};

// Cập nhật biến thể
export const updateVariant = async (variantId, updateData) => {
  try {
    // Nếu có SKU mới, kiểm tra trùng lặp
    if (updateData.sku) {
      const existingVariant = await ProductVariant.findOne({
        sku: updateData.sku,
        _id: { $ne: variantId },
      });
      if (existingVariant) {
        throw new Error('SKU đã tồn tại!');
      }
    }

    const variant = await ProductVariant.findByIdAndUpdate(
      variantId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return variant;
  } catch (error) {
    throw new Error(`Không thể cập nhật biến thể: ${error.message}`);
  }
};

// Xóa biến thể
export const deleteVariant = async (variantId) => {
  try {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) {
      return null;
    }

    // Xóa tất cả images của variant này
    await ProductImage.deleteMany({ variant_id: variantId });

    // Xóa variant
    await ProductVariant.findByIdAndDelete(variantId);

    return true;
  } catch (error) {
    throw new Error(`Không thể xóa biến thể: ${error.message}`);
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
