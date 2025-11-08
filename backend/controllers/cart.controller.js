import cartService from '../services/cart.service.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// GET /api/cart - Get user's current cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.getUserCart(userId);

    res.status(200).json({
      success: true,
      data: { cart },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// POST /api/cart/items - Add item to cart
export const addItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_variant_id, quantity } = req.body;

    // Validation
    if (!product_variant_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp product_variant_id',
      });
    }

    const quantityValue = parseInt(quantity) || 1;
    if (quantityValue < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0',
      });
    }

    const cart = await cartService.addItemToCart(userId, product_variant_id, quantityValue);

    res.status(200).json({
      success: true,
      message: 'Đã thêm sản phẩm vào giỏ hàng',
      data: { cart },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// PUT /api/cart/items/:productVariantId - Update item quantity
export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productVariantId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp số lượng',
      });
    }

    const quantityValue = parseInt(quantity);
    if (isNaN(quantityValue) || quantityValue < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải là số nguyên dương',
      });
    }

    const cart = await cartService.updateItemQuantity(userId, productVariantId, quantityValue);

    res.status(200).json({
      success: true,
      message: 'Đã cập nhật số lượng sản phẩm',
      data: { cart },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// DELETE /api/cart/items/:productVariantId - Remove item from cart
export const removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productVariantId } = req.params;

    const cart = await cartService.removeItemFromCart(userId, productVariantId);

    res.status(200).json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
      data: { cart },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

export default {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
};
