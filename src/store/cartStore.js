import { create } from 'zustand';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import { trackEcommerceEvent } from '@/utils/analytics';

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  isOpen: false,
  isLoading: false,
  fetchCart: async () => {
    try { const { data } = await api.get('/cart'); set({ items: data.items, total: data.total }); } catch {}
  },
  addItem: async (productId, variantId, quantity = 1) => {
    try {
      const { data } = await api.post('/cart', { productId, variantId, quantity });
      await get().fetchCart();
      set({ isOpen: true });
      const added = get().items.find((i) => i.productId === productId && (!variantId || i.variantId === variantId));
      if (added) {
        const product = added.product || {};
        const price = Number(product.discountPrice ?? product.basePrice ?? 0);
        trackEcommerceEvent('add_to_cart', { items: [added], value: price * added.quantity });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please sign in to add items to your cart');
        window.location.href = '/login';
        return;
      }
      throw err;
    }
  },
  updateQuantity: async (id, quantity) => {
    try {
      await api.put(`/cart/${id}`, { quantity });
      await get().fetchCart();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please sign in');
        window.location.href = '/login';
        return;
      }
      toast.error(err.response?.data?.error || 'Failed to update cart');
    }
  },
  removeItem: async (id) => {
    try {
      const removed = get().items.find((i) => i.id === id);
      await api.delete(`/cart/${id}`);
      await get().fetchCart();
      if (removed) {
        const product = removed.product || {};
        const price = Number(product.discountPrice ?? product.basePrice ?? 0);
        trackEcommerceEvent('remove_from_cart', { items: [removed], value: price * removed.quantity });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please sign in');
        window.location.href = '/login';
        return;
      }
      toast.error(err.response?.data?.error || 'Failed to remove item');
    }
  },
  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [], total: 0 });
  },
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  setCartOpen: (open) => set({ isOpen: open }),
}));
