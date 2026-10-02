import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);
  const { googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await googleLogin({ accessToken: tokenResponse.access_token });
        toast.success('Welcome!');
        navigate('/dashboard');
      } catch {
        toast.error('Google sign-in failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error('Google sign-in failed'),
  });

  if (!clientId || clientId === 'your-google-client-id.apps.googleusercontent.com') {
    return (
      <button type="button" disabled className="w-full flex items-center justify-center space-x-3 border border-caviar-300 dark:border-caviar-600 rounded-lg px-4 py-3 text-sm opacity-50 cursor-not-allowed">
        <FcGoogle className="w-5 h-5" />
        <span>Google OAuth not configured</span>
      </button>
    );
  }

  return (
    <button type="button" onClick={() => login()} disabled={loading} className="w-full flex items-center justify-center space-x-3 border border-caviar-300 dark:border-caviar-600 rounded-lg px-4 py-3 text-sm hover:bg-caviar-50 dark:hover:bg-caviar-800 transition-colors">
      <FcGoogle className="w-5 h-5" />
      <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
    </button>
  );
}
