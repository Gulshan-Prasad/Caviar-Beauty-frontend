import { create } from 'zustand';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export const useWishlistStore = create((set, get) => ({
  items: [],
  fetchWishlist: async () => {
    try { const { data } = await api.get('/wishlist'); set({ items: data.items.map((i) => i.productId) }); } catch {}
  },
  toggleItem: async (productId) => {
    try {
      const isIn = get().items.includes(productId);
      if (isIn) {
        const { data } = await api.get('/wishlist');
        const item = data.items.find((i) => i.productId === productId);
        if (item) await api.delete(`/wishlist/${item.id}`);
        set((s) => ({ items: s.items.filter((id) => id !== productId) }));
      } else {
        await api.post('/wishlist', { productId });
        set((s) => ({ items: [...s.items, productId] }));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please sign in to save items to your wishlist');
        window.location.href = '/login';
      }
    }
  },
  isInWishlist: (productId) => get().items.includes(productId),
}));
