import { create } from 'zustand';
import { getCategories, getCategoryBySlug } from '../services/categoryServices';

export const useCategoryStore = create((set) => ({
  data: null,
  isLoading: false,
  loadCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await getCategories();
      set({ data: res.data.categories });
      return res;
    } finally {
      set({ isLoading: false });
    }
  },
  getCategoryBySlug: async (slug) => {
    set({ isLoading: true });
    try {
      await getCategoryBySlug(slug);
      const res = await getCategories();
      set({ data: res.data.categories });
      return res;
    } finally {
      set({ isLoading: false });
    }
  },
}));
