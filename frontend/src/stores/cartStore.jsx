import { create } from 'zustand';
import { addItem, deleteItem, getCart, updateQuantity } from '../services/cartServices';

export const useCartStore = create((set) => ({
  data: [],
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
      await addItem(itemId, quantity);
      const newCard = await getCart();
      set({ data: newCard.data.cart.items });
      return newCard;
    } finally {
      set({ isLoading: false });
    }
  },
  updateItemQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      await updateQuantity(itemId, quantity);
      const newCard = await getCart();
      set({ data: newCard.data.cart.items });
      return newCard;
    } finally {
      set({ isLoading: false });
    }
  },
  removeItemFromCart: async (itemId) => {
    set({ isLoading: true });
    try {
      await deleteItem(itemId);
      const newCard = await getCart();
      set({ data: newCard.data.cart.items });
      return newCard;
    } finally {
      set({ isLoading: false });
    }
  },
  resetCart: () => set({ data: [] }),
}));
