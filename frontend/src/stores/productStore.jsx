import { create } from 'zustand';
import {
  getProductBySlug,
  getTrendingProducts,
  getProducts,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleHeplful,
} from '../services/productServices';

export const useProductStore = create((set) => ({
  isLoading: false,
  getProducts: async (queryObject) => {
    set({ isLoading: true });
    try {
      return await getProducts(queryObject);
    } finally {
      set({ isLoading: false });
    }
  },
  getTrendingProducts: async () => {
    set({ isLoading: true });
    try {
      return await getTrendingProducts();
    } finally {
      set({ isLoading: false });
    }
  },
  getProductBySlug: async (slug) => {
    set({ isLoading: true });
    try {
      return await getProductBySlug(slug);
    } finally {
      set({ isLoading: false });
    }
  },
  getReviews: async (slug, queryObject) => {
    set({ isLoading: true });
    try {
      return await getReviews(slug, queryObject);
    } finally {
      set({ isLoading: false });
    }
  },
  createReview: async (slug, rating, title, comment, images = []) => {
    set({ isLoading: true });
    try {
      return await createReview(slug, rating, title, comment, images);
    } finally {
      set({ isLoading: false });
    }
  },
  updateReview: async (id, rating, title, comment, images = []) => {
    set({ isLoading: true });
    try {
      return await updateReview(id, rating, title, comment, images);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteReview: async (id) => {
    set({ isLoading: true });
    try {
      return await deleteReview(id);
    } finally {
      set({ isLoading: false });
    }
  },
  toggleHelpful: async (id) => {
    set({ isLoading: true });
    try {
      return await toggleHeplful(id);
    } finally {
      set({ isLoading: false });
    }
  },
}));
