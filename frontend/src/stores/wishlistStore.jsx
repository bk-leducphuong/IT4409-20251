import { create } from 'zustand';
import {
  addItemToWishlist,
  deleteItemFromWishlist,
  getWishlist,
  itemInWishList,
} from '../services/wishlistServices';

export const useWishlistStore = create((set) => ({
  data: null,
  isLoading: false,
  loadWishlist: async () => {
    set({ isLoading: true });
    try {
      const res = await getWishlist();
      set({ data: res.data.wishlist.items });
    } finally {
      set({ isLoading: false });
    }
  },
  addItemToWishlist: async (productId) => {
    set({ isLoading: true });
    try {
      const res = await addItemToWishlist(productId);
      set({ data: res.data.wishlist.items });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteItemFromWishlist: async (productId) => {
    set({ isLoading: true });
    try {
      const res = await deleteItemFromWishlist(productId);
      set({ data: res.data.wishlist.items });
    } finally {
      set({ isLoading: false });
    }
  },
  itemInWishList: async (productId) => {
    set({ isLoading: true });
    try {
      return await itemInWishList(productId);
    } finally {
      set({ isLoading: false });
    }
  },
}));
