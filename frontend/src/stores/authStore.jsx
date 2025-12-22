import { create } from 'zustand';
import {
  login,
  signUp,
  getToken,
  resetToken,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from '../services/authServices';

export const useAuthStore = create((set) => ({
  token: getToken(),
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      await login(email, password);
      set({ token: getToken() });
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
  logout: async () => {
    set({ isLoading: true });
    try {
      await logout();
      resetToken();
      set({ token: null });
    } finally {
      set({ isLoading: false });
    }
  },
  sendOtp: async (email) => {
    set({ isLoading: true });
    try {
      return await forgotPassword(email);
    } finally {
      set({ isLoading: false });
    }
  },
  verifyOtp: async (email, otp) => {
    set({ isLoading: true });
    try {
      return await verifyOtp(email, otp);
    } finally {
      set({ isLoading: false });
    }
  },
  resetPassword: async (token, newPassword, confirmPassword) => {
    set({ isLoading: true });
    try {
      return await resetPassword(token, newPassword, confirmPassword);
    } finally {
      set({ isLoading: false });
    }
  },
}));
