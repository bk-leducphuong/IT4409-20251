import { create } from 'zustand';
import { changePassword, getProfile, updateUser } from '../services/userServices';

export const useUserStore = create((set) => ({
  data: null,
  isLoading: false,
  loadUserData: async () => {
    set({ isLoading: true });
    try {
      const data = await getProfile();
      set({ data: data.data.user });
    } finally {
      set({ isLoading: false });
    }
  },
  resetUser: () => set({ data: null }),
  updateUser: async (user) => {
    set({ isLoading: true });
    try {
      return await updateUser(user);
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
