import { create } from 'zustand';
import { getProfile } from '../services/userServices';

export const useUserStore = create((set) => ({
  data: null,
  isLoading: false,
  loadUserData: async () => {
    set({ isLoading: true });
    try {
      const data = await getProfile();
      set({ data: data });
    } finally {
      set({ isLoading: false });
    }
  },
}));
