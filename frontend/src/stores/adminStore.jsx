import { create } from 'zustand';
import {
  createUser,
  deleteUser,
  getAdmins,
  getUserById,
  getUsers,
  updateUser,
} from '../services/adminServices';

export const useAdminStore = create((set) => ({
  isLoading: false,
  getUsers: async () => {
    set({ isLoading: true });
    try {
      return await getUsers();
    } finally {
      set({ isLoading: false });
    }
  },
  createUser: async (user) => {
    set({ isLoading: true });
    try {
      return await createUser(user);
    } finally {
      set({ isLoading: false });
    }
  },
  getAdmins: async () => {
    set({ isLoading: true });
    try {
      return await getAdmins();
    } finally {
      set({ isLoading: false });
    }
  },
  getUserById: async (id) => {
    set({ isLoading: true });
    try {
      return await getUserById(id);
    } finally {
      set({ isLoading: false });
    }
  },
  updateUser: async (id, user) => {
    set({ isLoading: true });
    try {
      return await updateUser(id, user);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      return await deleteUser(id);
    } finally {
      set({ isLoading: false });
    }
  },
}));
