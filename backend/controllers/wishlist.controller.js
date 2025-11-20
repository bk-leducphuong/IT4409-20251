import wishlistService from '../services/wishlist.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// GET /api/wishlist - Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await wishlistService.getUserWishlist(userId);

    res.status(200).json({
      success: true,
      data: { wishlist },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// POST /api/wishlist/items - Add item to wishlist
export const addItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id } = req.body;

    // Validation
    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product_id',
      });
    }

    const wishlist = await wishlistService.addItemToWishlist(userId, product_id);

    res.status(200).json({
      success: true,
      message: 'Đã thêm sản phẩm vào danh sách yêu thích',
      data: { wishlist },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// DELETE /api/wishlist/items/:productId - Remove item from wishlist
export const removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const wishlist = await wishlistService.removeItemFromWishlist(userId, productId);

    res.status(200).json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
      data: { wishlist },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// GET /api/wishlist/check/:productId - Check if product is in wishlist
export const checkItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const isInWishlist = await wishlistService.isProductInWishlist(userId, productId);

    res.status(200).json({
      success: true,
      data: { isInWishlist },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  getWishlist,
  addItem,
  removeItem,
  checkItem,
};
