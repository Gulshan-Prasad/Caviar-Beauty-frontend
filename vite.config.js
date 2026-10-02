import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (mode === 'production' && !env.VITE_API_URL?.trim()) {
    throw new Error('Set VITE_API_URL to the deployed backend API URL (ending in /api) before building for production.');
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: 'http://localhost:4000', changeOrigin: true },
        '/uploads': { target: 'http://localhost:4000', changeOrigin: true },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('framer-motion')) return 'vendor';
              if (id.includes('react-icons')) return 'ui';
            }
          },
        },
      },
    },
  };
});
