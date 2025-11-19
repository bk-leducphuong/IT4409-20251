import Order from "../models/order.js";
import Cart from "../models/cart.js";
import ProductVariant from "../models/productVariant.js";
import mongoose from "mongoose";

// Create a new order
export const createOrder = async (userId, cartId, shippingAddress, paymentMethod) => {
  const session = await mongoose.startSession();
  session.startTransaction();   
    try {
        // Get the cart
        const cart = await Cart.findById(cartId).populate('items.product_variant_id').session(session);
        if (!cart || cart.user_id.toString() !== userId.toString()) {
            throw new Error('Giỏ hàng không tồn tại hoặc không hợp lệ');
        }
        if (cart.items.length === 0) {
            throw new Error('Giỏ hàng trống');
        }
        // Calculate total amount
        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.quantity * item.product_variant_id.price;
        });

        // Create order items
        const orderItems = cart.items.map(item => ({
            product_variant_id: item.product_variant_id._id,
            quantity: item.quantity,
            price: item.product_variant_id.price,
        }));
        // Create the order
        const order = new Order({
            user_id: userId,
            items: orderItems,
            total_amount: totalAmount,
            shipping_address: shippingAddress,
            payment_method: paymentMethod,
        });
        await order.save({ session });
        // Clear the cart
        cart.items = [];
        await cart.save({ session });
        await session.commitTransaction();
        session.endSession();
        return order;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(error.message || 'Không thể tạo đơn hàng');
    }
};

export default {
    createOrder,
};
