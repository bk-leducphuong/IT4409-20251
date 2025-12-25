import { create } from 'zustand';
import {
  addItem,
  deleteItem,
  getCart,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
} from '../services/cartServices';

export const useCartStore = create((set) => ({
  data: null,
  appliedCoupon: null,
  subTotal: 0,
  discount: 0,
  shippingFee: 0,
  total: 0,
  isLoading: false,
  loadCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await getCart();
      set({ data: cart.data.cart.items });
      set({ appliedCoupon: cart.data.cart.applied_coupon });
      set({ subTotal: cart.data.cart.subtotal });
      set({ discount: cart.data.cart.discount });
      set({ shippingFee: cart.data.cart.shipping_fee });
      set({ total: cart.data.cart.total });
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
  addItemToCart: async (itemId, quantity = 1) => {
    set({ isLoading: true });
    try {
      const cart = await addItem(itemId, quantity);
      set({ data: cart.data.cart.items });
      set({ appliedCoupon: cart.data.cart.applied_coupon });
      set({ subTotal: cart.data.cart.subtotal });
      set({ discount: cart.data.cart.discount });
      set({ shippingFee: cart.data.cart.shipping_fee });
      set({ total: cart.data.cart.total });
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
  updateItemQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const cart = await updateQuantity(itemId, quantity);
      set({ data: cart.data.cart.items });
      set({ appliedCoupon: cart.data.cart.applied_coupon });
      set({ subTotal: cart.data.cart.subtotal });
      set({ discount: cart.data.cart.discount });
      set({ shippingFee: cart.data.cart.shipping_fee });
      set({ total: cart.data.cart.total });
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
  removeItemFromCart: async (itemId) => {
    set({ isLoading: true });
    try {
      const cart = await deleteItem(itemId);
      set({ data: cart.data.cart.items });
      set({ appliedCoupon: cart.data.cart.applied_coupon });
      set({ subTotal: cart.data.cart.subtotal });
      set({ discount: cart.data.cart.discount });
      set({ shippingFee: cart.data.cart.shipping_fee });
      set({ total: cart.data.cart.total });
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
  clearCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await clearCart();
      set({ data: cart.data.cart.items });
      set({ appliedCoupon: cart.data.cart.applied_coupon });
      set({ subTotal: cart.data.cart.subtotal });
      set({ discount: cart.data.cart.discount });
      set({ shippingFee: cart.data.cart.shipping_fee });
      set({ total: cart.data.cart.total });
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
  applyCoupon: async (code) => {
    set({ isLoading: true });
    try {
      const cart = await applyCoupon(code);
      set({ appliedCoupon: cart.data.cart.applied_coupon });
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
  removeCoupon: async () => {
    set({ isLoading: true });
    try {
      const cart = await removeCoupon();
      set({ appliedCoupon: null });
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
}));
