import Cart from '../models/cart.js';
import ProductVariant from '../models/productVariant.js';

// Get user's current cart
export const getUserCart = async (userId) => {
  try {
    let cart = await Cart.findOne({ user_id: userId }).populate({
      path: 'items.product_variant_id',
      populate: {
        path: 'product_id',
        populate: [
          { path: 'category_id', select: 'name slug' },
          { path: 'brand_id', select: 'name slug' },
        ],
      },
    });

    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
    }

    return cart;
  } catch (error) {
    throw new Error('Không thể lấy giỏ hàng: ' + error.message);
  }
};

// Add item to cart
export const addItemToCart = async (userId, productVariantId, quantity = 1) => {
  try {
    // Check if product variant exists and has enough stock
    const productVariant = await ProductVariant.findById(productVariantId);
    if (!productVariant) {
      throw new Error('Sản phẩm không tồn tại');
    }

    if (productVariant.stock_quantity < quantity) {
      throw new Error('Không đủ số lượng trong kho');
    }

    // Get or create cart
    let cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      cart = await Cart.create({ user_id: userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product_variant_id.toString() === productVariantId,
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      // Check stock again for new quantity
      if (productVariant.stock_quantity < newQuantity) {
        throw new Error('Không đủ số lượng trong kho');
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product_variant_id: productVariantId,
        quantity: quantity,
      });
    }

    await cart.save();

    // Return cart with populated data
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product_variant_id',
      populate: {
        path: 'product_id',
        populate: [
          { path: 'category_id', select: 'name slug' },
          { path: 'brand_id', select: 'name slug' },
        ],
      },
    });

    return cart;
  } catch (error) {
    throw new Error(error.message || 'Không thể thêm sản phẩm vào giỏ hàng');
  }
};

// Update item quantity in cart
export const updateItemQuantity = async (userId, productVariantId, quantity) => {
  try {
    if (quantity < 1) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    // Check if product variant exists and has enough stock
    const productVariant = await ProductVariant.findById(productVariantId);
    if (!productVariant) {
      throw new Error('Sản phẩm không tồn tại');
    }

    if (productVariant.stock_quantity < quantity) {
      throw new Error('Không đủ số lượng trong kho');
    }

    // Find cart and update item quantity
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      throw new Error('Giỏ hàng không tồn tại');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product_variant_id.toString() === productVariantId,
    );

    if (itemIndex === -1) {
      throw new Error('Sản phẩm không có trong giỏ hàng');
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Return cart with populated data
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product_variant_id',
      populate: {
        path: 'product_id',
        populate: [
          { path: 'category_id', select: 'name slug' },
          { path: 'brand_id', select: 'name slug' },
        ],
      },
    });

    return updatedCart;
  } catch (error) {
    throw new Error(error.message || 'Không thể cập nhật số lượng sản phẩm');
  }
};

// Remove item from cart
export const removeItemFromCart = async (userId, productVariantId) => {
  try {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      throw new Error('Giỏ hàng không tồn tại');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product_variant_id.toString() === productVariantId,
    );

    if (itemIndex === -1) {
      throw new Error('Sản phẩm không có trong giỏ hàng');
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    // Return cart with populated data
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product_variant_id',
      populate: {
        path: 'product_id',
        populate: [
          { path: 'category_id', select: 'name slug' },
          { path: 'brand_id', select: 'name slug' },
        ],
      },
    });

    return updatedCart;
  } catch (error) {
    throw new Error(error.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
  }
};

// Clear entire cart
export const clearCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) {
      throw new Error('Giỏ hàng không tồn tại');
    }

    // Clear all items
    cart.items = [];
    await cart.save();

    return cart;
  } catch (error) {
    throw new Error(error.message || 'Không thể xóa toàn bộ giỏ hàng');
  }
};

export default {
  getUserCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
