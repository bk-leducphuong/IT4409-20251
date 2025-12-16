import { create } from 'zustand';
import { cancelOrder, createOrder, getOrder, getOrderById } from '../services/orderServices';

export const useOrderStore = create((set) => ({
  data: null,
  isLoading: false,
  createOrder: async (
    full_name,
    phone,
    address_line,
    city,
    postal_code,
    country,
    payment_method,
    customer_note = '',
  ) => {
    set({ isLoading: true });
    try {
      return await createOrder(
        full_name,
        phone,
        address_line,
        city,
        postal_code,
        country,
        payment_method,
        customer_note,
      );
    } finally {
      set({ isLoading: false });
    }
  },
  getOrder: async (status = '', page = 1, limit = 10) => {
    set({ isLoading: true });
    try {
      return await getOrder(status, page, limit);
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
  cancelOrder: async (id, reason) => {
    set({ isLoading: true });
    try {
      return await cancelOrder(id, reason);
    } finally {
      set({ isLoading: false });
    }
  },
}));
