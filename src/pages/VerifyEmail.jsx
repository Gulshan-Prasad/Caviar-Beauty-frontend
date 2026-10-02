import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiCheck, FiRefreshCw } from 'react-icons/fi';
import api from '@/utils/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import PageTransition from '@/components/layout/PageTransition';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email: user.email, otp });
      toast.success('Email verified!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/auth/resend-otp', { email: user.email });
      setResent(true);
      toast.success('New verification code sent');
      setTimeout(() => setResent(false), 30000);
    } catch (err) {
      toast.error('Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <PageTransition>
      <div className="min-h-screen flex pt-20 md:pt-24">
        <div className="w-full flex items-center justify-center px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
            <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMail className="w-8 h-8 text-gold-500" />
            </div>
            <h1 className="font-serif text-3xl mb-2">Verify Your Email</h1>
            <p className="text-caviar-500 dark:text-caviar-400 mb-2">We sent a 6-digit code to</p>
            <p className="font-medium text-lg mb-8">{user.email}</p>
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="input-field text-center tracking-[12px] font-mono text-2xl" placeholder="000000" maxLength={6} required />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full text-xs"><FiCheck className="inline mr-2" />{loading ? 'Verifying...' : 'Verify Email'}</button>
            </form>
            <button onClick={handleResend} disabled={loading || resent} className="mt-6 text-sm text-gold-500 hover:text-gold-600 flex items-center justify-center mx-auto"><FiRefreshCw className={`mr-2 ${resent ? 'animate-spin' : ''}`} />{resent ? 'Code sent' : 'Resend code'}</button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
