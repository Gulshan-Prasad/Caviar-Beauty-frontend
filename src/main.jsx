import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './styles/globals.css';
import { initAnalytics } from '@/utils/analytics';

initAnalytics();

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: 1, refetchOnWindowFocus: false } },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <App />
          </GoogleOAuthProvider>
        ) : <App />}
        <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1a1a1a', color: '#fff', borderRadius: '12px', fontFamily: 'Inter, sans-serif' } }} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
