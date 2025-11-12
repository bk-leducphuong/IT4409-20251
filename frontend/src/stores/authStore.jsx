import { create } from 'zustand';
import { login, signUp, validateToken, getToken } from '../services/authServices';

export const useAuthStore = create((set) => ({
  token: getToken(),
  user: null,
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
  validateToken: async () => {
    set({ isLoading: true });
    try {
      await validateToken();
    } finally {
      set({ isLoading: false });
    }
  },
}));
