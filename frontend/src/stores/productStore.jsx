import { create } from 'zustand';
import { getProductBySlug, getProducts } from '../services/productServices';

export const useProductStore = create((set) => ({
  isLoading: false,
  getProducts: async (category, brand, search, sort_by, page, limit) => {
    set({ isLoading: true });
    try {
      return await getProducts(category, brand, search, sort_by, page, limit);
    } finally {
      set({ isLoading: false });
    }
  },
  getProductBySlug: async (slug) => {
    set({ isLoading: true });
    try {
      return await getProductBySlug(slug);
    } finally {
      set({ isLoading: false });
    }
  },
}));
