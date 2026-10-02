import { create } from 'zustand';
import api from '@/utils/api';
import toast from 'react-hot-toast';

let wishlistFetchPromise;
let wishlistFetchGeneration = 0;

export const useWishlistStore = create((set, get) => ({
  items: [],
  itemIds: {},
  reset: () => {
    wishlistFetchGeneration += 1;
    wishlistFetchPromise = undefined;
    set({ items: [], itemIds: {} });
  },
  fetchWishlist: () => {
    if (wishlistFetchPromise) return wishlistFetchPromise;
    const generation = wishlistFetchGeneration;
    const request = (async () => {
      try {
        const { data } = await api.get('/wishlist');
        if (generation === wishlistFetchGeneration) {
          set({ items: data.items.map((i) => i.productId), itemIds: Object.fromEntries(data.items.map((i) => [i.productId, i.id])) });
        }
      } catch (err) { if (generation === wishlistFetchGeneration && err.response?.status === 401) set({ items: [], itemIds: {} }); }
      finally { if (wishlistFetchPromise === request) wishlistFetchPromise = undefined; }
    })();
    wishlistFetchPromise = request;
    return request;
  },
  toggleItem: async (productId) => {
    try {
      const isIn = get().items.includes(productId);
      if (isIn) {
        let itemId = get().itemIds[productId];
        if (!itemId) {
          await get().fetchWishlist();
          itemId = get().itemIds[productId];
        }
        if (!itemId) throw new Error('Wishlist item could not be loaded');
        await api.delete(`/wishlist/${itemId}`);
        set((s) => {
          const itemIds = { ...s.itemIds };
          delete itemIds[productId];
          return { items: s.items.filter((id) => id !== productId), itemIds };
        });
      } else {
        const { data } = await api.post('/wishlist', { productId });
        set((s) => ({ items: [...s.items, productId], itemIds: { ...s.itemIds, [productId]: data.id } }));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please sign in to save items to your wishlist');
        window.location.href = '/login';
      } else {
        toast.error(err.response?.data?.error || 'Failed to update wishlist');
      }
    }
  },
  isInWishlist: (productId) => get().items.includes(productId),
}));
