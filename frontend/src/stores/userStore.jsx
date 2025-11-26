import { create } from 'zustand';
import { changePassword, getProfile, updateUser } from '../services/userServices';

export const useUserStore = create((set) => ({
  data: null,
  isLoading: false,
  loadUserData: async () => {
    set({ isLoading: true });
    try {
      const res = await getProfile();
      set({ data: res.data.user });
      return res;
    } finally {
      set({ isLoading: false });
    }
  },
  resetUser: () => set({ data: null }),
  updateUser: async (user) => {
    set({ isLoading: true });
    try {
      await updateUser(user);
      const res = await getProfile();
      set({ data: res.data.user });
      return res;
    } finally {
      set({ isLoading: false });
    }
  },
  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true });
    try {
      return await changePassword(currentPassword, newPassword);
    } finally {
      set({ isLoading: false });
    }
  },
}));
