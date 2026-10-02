import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = configuredApiUrl || (import.meta.env.DEV ? '/api' : '');

if (!API_URL) {
  throw new Error('VITE_API_URL must be set to the deployed backend API URL (ending in /api).');
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let csrfTokenFromResponse = '';

const readCsrfToken = () => {
  if (csrfTokenFromResponse) return csrfTokenFromResponse;
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
};

const rememberCsrfToken = (response) => {
  const token = response?.headers?.['x-csrf-token'];
  if (token) csrfTokenFromResponse = token;
};

api.interceptors.request.use((config) => {
  const token = readCsrfToken();
  if (token) config.headers['X-CSRF-Token'] = token;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    rememberCsrfToken(response);
    return response;
  },
  async (error) => {
    rememberCsrfToken(error.response);
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await api.post('/auth/refresh-token', {}, { withCredentials: true });
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export default api;
