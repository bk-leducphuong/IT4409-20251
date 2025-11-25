import { create } from 'zustand';
import { login, signUp, getToken, resetToken, logout } from '../services/authServices';

export const useAuthStore = create((set) => ({
  token: getToken(),
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await login(email, password);
    } finally {
      set({ isLoading: false });
    }
  },
  signUp: async (fullName, email, password, phone) => {
    set({ isLoading: true });
    try {
      await signUp(fullName, email, password, phone);
      set({ token: getToken() });
    } finally {
      set({ isLoading: false });
    }
  },
  resetToken: () => {
    resetToken();
    set({ token: null });
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));
