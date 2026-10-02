import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore } from '@/store/cartStore';
import api from '@/utils/api';
import toast from 'react-hot-toast';

describe('cartStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.setState({ items: [], total: 0, isOpen: false, isLoading: false });
  });

  it('adds item and opens cart on success', async () => {
    api.post.mockResolvedValue({ data: {} });
    api.get.mockResolvedValue({ data: { items: [{ id: '1', productId: 'p1', quantity: 2 }], total: 2000 } });

    await useCartStore.getState().addItem('p1', null, 2);

    expect(api.post).toHaveBeenCalledWith('/cart', { productId: 'p1', variantId: null, quantity: 2 });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().total).toBe(2000);
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it('redirects to login on 401', async () => {
    const err = { response: { status: 401 } };
    api.post.mockRejectedValue(err);
    const spy = vi.spyOn(toast, 'error').mockImplementation(() => {});
    const assignMock = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '/cart', assign: assignMock },
    });

    await useCartStore.getState().addItem('p1', null, 1);

    expect(window.location.href).toBe('/login');
    expect(spy).toHaveBeenCalled();
    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it('clearCart resets items and total', async () => {
    api.delete.mockResolvedValue({ data: {} });
    useCartStore.setState({ items: [{ id: '1' }], total: 999 });

    await useCartStore.getState().clearCart();

    expect(api.delete).toHaveBeenCalledWith('/cart');
    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().total).toBe(0);
  });

  it('toggleCart flips open state', () => {
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});