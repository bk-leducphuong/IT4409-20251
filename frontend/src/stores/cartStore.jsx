import { create } from 'zustand';
import { addItem, deleteItem, getCart, updateQuantity } from '../services/cartServices';

export const useCartStore = create((set) => ({
  isLoading: false,
  getCart: async () => {
    set({ isLoading: true });
    try {
      return await getCart();
    } finally {
      set({ isLoading: false });
    }
  },
  addItemToCart: async (itemId, quantity = 1) => {
    set({ isLoading: true });
    try {
      return await addItem(itemId, quantity);
    } finally {
      set({ isLoading: false });
    }
  },
  updateItemQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      return await updateQuantity(itemId, quantity);
    } finally {
      set({ isLoading: false });
    }
  },
  removeItemFromCart: async (itemId) => {
    set({ isLoading: true });
    try {
      return await deleteItem(itemId);
    } finally {
      set({ isLoading: false });
    }
  },
}));
