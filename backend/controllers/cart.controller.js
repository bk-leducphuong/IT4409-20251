import cartService from '../services/cart.service.js';
import couponService from '../services/coupon.service.js';
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

// DELETE /api/cart - Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.clearCart(userId);

    res.status(200).json({
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng',
      data: { cart },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// POST /api/cart/apply-coupon - Apply coupon to cart
export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user._id;
    const { code } = req.body;

    // Validation
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mã giảm giá',
      });
    }

    // Get current cart to calculate subtotal
    const cart = await cartService.getUserCart(userId);

    const result = await couponService.applyCouponToCart(userId, code, {
      subtotal: cart.subtotal,
      shipping_fee: cart.shipping_fee || 0,
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        coupon: result.coupon,
        cart: result.cart,
      },
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

// DELETE /api/cart/remove-coupon - Remove coupon from cart
export const removeCoupon = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await couponService.removeCouponFromCart(userId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        cart: result.cart,
      },
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
  clearCart,
  applyCoupon,
  removeCoupon,
};
