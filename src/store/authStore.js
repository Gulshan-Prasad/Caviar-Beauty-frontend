import { create } from 'zustand';
import api from '@/utils/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (email, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/auth/admin-login' : '/auth/login';
    const { data } = await api.post(endpoint, { email, password });
    set({ user: data.user, isAuthenticated: true });
    return data;
  },
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    set({ user: data.user, isAuthenticated: true });
  },
  googleLogin: async (credential) => {
    const { data } = await api.post('/auth/google', credential);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },
  logout: async () => {
    try { await api.post('/auth/logout'); } catch {}
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch { set({ user: null, isAuthenticated: false, isLoading: false }); }
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  updateProfile: async (data) => {
    const res = await api.put('/auth/profile', data);
    set({ user: { ...get().user, ...res.data } });
    return res.data;
  },
}));
