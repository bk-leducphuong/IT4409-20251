import { create } from 'zustand';
import {
  createUser,
  deleteUser,
  getAdmins,
  getUserById,
  getUsers,
  updateUser,
  createProduct,
  createProductVariant,
  deleteProduct,
  deleteVariant,
  updateProduct,
  updateVariant,
  createBrand,
  deleteBrand,
  updateBrand,
  createCategory,
  deleteCategory,
  updateCategory,
  getOrders,
  getOrderById,
  getOrdersStatistics,
  updateOrderStatus,
} from '../services/adminServices';

export const useAdminStore = create((set) => ({
  isLoading: false,

  /* USER MANAGEMENT */

  getUsers: async (page = 1, limit = 20) => {
    set({ isLoading: true });
    try {
      return await getUsers(page, limit);
    } finally {
      set({ isLoading: false });
    }
  },
  createUser: async (fullName, email, password, phone, address, status = 'active') => {
    set({ isLoading: true });
    try {
      return await createUser(fullName, email, password, phone, address, status);
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

  /* PRODUCT */

  createProduct: async (name, slug, description, category_id, brand_id) => {
    set({ isLoading: true });
    try {
      return await createProduct(name, slug, description, category_id, brand_id);
    } finally {
      set({ isLoading: false });
    }
  },
  updateProduct: async (id, name, slug, description, category_id, brand_id) => {
    set({ isLoading: true });
    try {
      return await updateProduct(id, name, slug, description, category_id, brand_id);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      return await deleteProduct(id);
    } finally {
      set({ isLoading: false });
    }
  },

  /* PRODUCT VARIANTS */

  createProductVariant: async (productID, variantObject) => {
    set({ isLoading: true });
    try {
      return await createProductVariant(productID, variantObject);
    } finally {
      set({ isLoading: false });
    }
  },
  updateVariant: async (productID, variantObject) => {
    set({ isLoading: true });
    try {
      return await updateVariant(productID, variantObject);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteVariant: async (id) => {
    set({ isLoading: true });
    try {
      return await deleteVariant(id);
    } finally {
      set({ isLoading: false });
    }
  },

  /* BRAND */

  createBrand: async (name, logoURL) => {
    set({ isLoading: true });
    try {
      return await createBrand(name, logoURL);
    } finally {
      set({ isLoading: false });
    }
  },
  updateBrand: async (id, name, logoURL) => {
    set({ isLoading: true });
    try {
      return await updateBrand(id, name, logoURL);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteBrand: async (id) => {
    set({ isLoading: true });
    try {
      return await deleteBrand(id);
    } finally {
      set({ isLoading: false });
    }
  },

  /* CATEGORY */

  createCategory: async (name, slug, parent_category_id = null) => {
    set({ isLoading: true });
    try {
      return await createCategory(name, slug, parent_category_id);
    } finally {
      set({ isLoading: false });
    }
  },
  updateCategory: async (id, name, slug, parent_category_id = null) => {
    set({ isLoading: true });
    try {
      return await updateCategory(id, name, slug, parent_category_id);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      return await deleteCategory(id);
    } finally {
      set({ isLoading: false });
    }
  },

  /* ORDER */
  getOrders: async (queryObject) => {
    set({ isLoading: true });
    try {
      return await getOrders(queryObject);
    } finally {
      set({ isLoading: false });
    }
  },
  getOrderById: async (id) => {
    set({ isLoading: true });
    try {
      return await getOrderById(id);
    } finally {
      set({ isLoading: false });
    }
  },
  getOrdersStatistics: async () => {
    set({ isLoading: true });
    try {
      return await getOrdersStatistics();
    } finally {
      set({ isLoading: false });
    }
  },
  updateOrderStatus: async (id, status) => {
    set({ isLoading: true });
    try {
      return await updateOrderStatus(id, status);
    } finally {
      set({ isLoading: false });
    }
  },
}));
