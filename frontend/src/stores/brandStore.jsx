import { create } from 'zustand';
import { getBrandByID, getBrands } from '../services/brandServices';

export const useBrandStore = create((set) => ({
  data: [],
  isLoading: false,
  loadBrands: async () => {
    set({ isLoading: true });
    try {
      const res = await getBrands();
      set({ data: res.data.brands });
      return res;
    } finally {
      set({ isLoading: false });
    }
  },
  getBrandByID: async (id) => {
    set({ isLoading: true });
    try {
      await getBrandByID(id);
      const res = await getBrands();
      set({ data: res.data.brands });
      return res;
    } finally {
      set({ isLoading: false });
    }
  },
}));
