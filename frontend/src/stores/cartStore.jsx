import { create } from 'zustand';
import {
  addItem,
  deleteItem,
  getCart,
  updateQuantity,
  clearCart,
  applyCoupon,
} from '../services/cartServices';

export const useCartStore = create((set) => ({
  data: null,
  isLoading: false,
  loadCart: async () => {
    set({ isLoading: true });
    try {
      const cart = await getCart();
      set({ data: cart.data.cart.items });
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
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
  applyCoupon: async (code) => {
    set({ isLoading: true });
    try {
      const cart = await applyCoupon(code);
      set({ data: cart.data.cart.items });
      return cart;
    } finally {
      set({ isLoading: false });
    }
  },
}));
