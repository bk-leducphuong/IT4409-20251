import Cart from '../models/cart.js';
import ProductVariant from '../models/productVariant.js';

// Calculate cart totals including coupon discount
export const calculateCartTotals = (cart) => {
  let subtotal = 0;
  
  // Calculate subtotal from items
  if (cart.items && cart.items.length > 0) {
    cart.items.forEach((item) => {
      if (item.product_variant_id && item.product_variant_id.price) {
        subtotal += item.product_variant_id.price * item.quantity;
      }
    });
  }
  
  // Calculate discount from applied coupon
  let discount = 0;
  if (cart.applied_coupon && cart.applied_coupon.discount_amount) {
    discount = cart.applied_coupon.discount_amount;
  }
  
  // Assume flat shipping fee (can be customized)
  const shipping_fee = subtotal > 0 ? 30000 : 0; // 30,000 VND flat rate
  
  // Calculate total
  const total = Math.max(0, subtotal + shipping_fee - discount);
  
  return {
    subtotal,
    discount,
    shipping_fee,
    total,
  };
};

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
    
    // Calculate totals
    const totals = calculateCartTotals(cart);
    
    // Return cart with totals as plain object
    const cartObj = cart.toObject();
    cartObj.subtotal = totals.subtotal;
    cartObj.discount = totals.discount;
    cartObj.shipping_fee = totals.shipping_fee;
    cartObj.total = totals.total;

    return cartObj;
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
    
    // Calculate totals
    const totals = calculateCartTotals(cart);
    const cartObj = cart.toObject();
    cartObj.subtotal = totals.subtotal;
    cartObj.discount = totals.discount;
    cartObj.shipping_fee = totals.shipping_fee;
    cartObj.total = totals.total;

    return cartObj;
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
    
    // Calculate totals
    const totals = calculateCartTotals(updatedCart);
    const cartObj = updatedCart.toObject();
    cartObj.subtotal = totals.subtotal;
    cartObj.discount = totals.discount;
    cartObj.shipping_fee = totals.shipping_fee;
    cartObj.total = totals.total;

    return cartObj;
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
    
    // Calculate totals
    const totals = calculateCartTotals(updatedCart);
    const cartObj = updatedCart.toObject();
    cartObj.subtotal = totals.subtotal;
    cartObj.discount = totals.discount;
    cartObj.shipping_fee = totals.shipping_fee;
    cartObj.total = totals.total;

    return cartObj;
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

    // Clear all items and coupon
    cart.items = [];
    cart.applied_coupon = undefined;
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
  calculateCartTotals,
};
