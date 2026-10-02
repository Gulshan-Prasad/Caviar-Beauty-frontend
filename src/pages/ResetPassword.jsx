import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiCheck } from 'react-icons/fi';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import PageTransition from '@/components/layout/PageTransition';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp: token, password });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex pt-20 md:pt-24">
        <div className="hidden lg:flex w-1/2 bg-caviar-100 dark:bg-caviar-900 items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <span className="font-serif text-8xl text-caviar-200 dark:text-caviar-700">CB</span>
          </motion.div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-12">
          <div className="w-full max-w-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Link to="/login" className="flex items-center text-sm text-caviar-500 hover:text-gold-500 mb-8"><FiLock className="mr-2" /> Back to login</Link>
              <h1 className="font-serif text-3xl md:text-4xl mb-2">Set New Password</h1>
              <p className="text-caviar-500 dark:text-caviar-400 mb-8">Enter your new password below.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">New Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase font-medium mb-2">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full text-xs"><FiCheck className="inline mr-2" />{loading ? 'Resetting...' : 'Reset Password'}</button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
