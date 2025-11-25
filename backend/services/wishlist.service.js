import Wishlist from '../models/wishlist.js';
import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';

// Get user's wishlist
export const getUserWishlist = async (userId) => {
  try {
    let wishlist = await Wishlist.findOne({ user_id: userId }).populate({
      path: 'items.product_id',
      populate: [
        { path: 'category_id', select: 'name slug' },
        { path: 'brand_id', select: 'name slug' },
      ],
    });

    // If wishlist doesn't exist, create a new one
    if (!wishlist) {
      wishlist = await Wishlist.create({ user_id: userId, items: [] });
    }

    // Get product variants for each product to show pricing info
    const wishlistWithVariants = {
      ...wishlist.toObject(),
      items: await Promise.all(
        wishlist.items.map(async (item) => {
          if (!item.product_id) {
            return item;
          }

          // Get the first variant or cheapest variant for display
          const variants = await ProductVariant.find({
            product_id: item.product_id._id,
          })
            .sort({ price: 1 })
            .limit(5);

          return {
            ...item.toObject(),
            product_id: {
              ...item.product_id.toObject(),
              variants: variants,
              min_price: variants.length > 0 ? variants[0].price : null,
              max_price: variants.length > 0 ? variants[variants.length - 1].price : null,
            },
          };
        }),
      ),
    };

    return wishlistWithVariants;
  } catch (error) {
    throw new Error('Không thể lấy danh sách yêu thích: ' + error.message);
  }
};

// Add item to wishlist
export const addItemToWishlist = async (userId, productId) => {
  try {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    // Get or create wishlist
    let wishlist = await Wishlist.findOne({ user_id: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user_id: userId, items: [] });
    }

    // Check if product already exists in wishlist
    const existingItem = wishlist.items.find((item) => item.product_id.toString() === productId);

    if (existingItem) {
      throw new Error('Sản phẩm đã có trong danh sách yêu thích');
    }

    // Add new item
    wishlist.items.push({
      product_id: productId,
      added_at: new Date(),
    });

    await wishlist.save();

    // Return wishlist with populated data
    const updatedWishlist = await getUserWishlist(userId);
    return updatedWishlist;
  } catch (error) {
    throw new Error(error.message || 'Không thể thêm sản phẩm vào danh sách yêu thích');
  }
};

// Remove item from wishlist
export const removeItemFromWishlist = async (userId, productId) => {
  try {
    const wishlist = await Wishlist.findOne({ user_id: userId });
    if (!wishlist) {
      throw new Error('Danh sách yêu thích không tồn tại');
    }

    const itemIndex = wishlist.items.findIndex((item) => item.product_id.toString() === productId);

    if (itemIndex === -1) {
      throw new Error('Sản phẩm không có trong danh sách yêu thích');
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    // Return wishlist with populated data
    const updatedWishlist = await getUserWishlist(userId);
    return updatedWishlist;
  } catch (error) {
    throw new Error(error.message || 'Không thể xóa sản phẩm khỏi danh sách yêu thích');
  }
};

// Check if product is in wishlist
export const isProductInWishlist = async (userId, productId) => {
  try {
    const wishlist = await Wishlist.findOne({ user_id: userId });
    if (!wishlist) {
      return false;
    }

    return wishlist.items.some((item) => item.product_id.toString() === productId);
  } catch (error) {
    throw new Error('Không thể kiểm tra sản phẩm trong danh sách yêu thích');
  }
};

export default {
  getUserWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  isProductInWishlist,
};
