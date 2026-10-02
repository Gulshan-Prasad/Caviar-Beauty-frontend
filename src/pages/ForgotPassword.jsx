import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheck, FiLock } from 'react-icons/fi';
import api from '@/utils/api';
import toast from 'react-hot-toast';
import PageTransition from '@/components/layout/PageTransition';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp, purpose: 'password-reset' });
      toast.success('Code verified');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, password });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('New OTP sent');
    } catch (err) {
      toast.error('Failed to resend');
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
              <Link to="/login" className="flex items-center text-sm text-caviar-500 hover:text-gold-500 mb-8">
                <FiArrowLeft className="mr-2" /> Back to login
              </Link>
              <h1 className="font-serif text-3xl md:text-4xl mb-2">Reset Password</h1>
              <p className="text-caviar-500 dark:text-caviar-400 mb-8">
                {step === 1 && 'Enter your email to receive a reset code'}
                {step === 2 && 'Enter the 6-digit code sent to your email'}
                {step === 3 && 'Choose a new password'}
              </p>

              {step === 1 && (
                <form onSubmit={handleSendOTP} className="space-y-6">
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-12" placeholder="your@email.com" required />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full text-xs">{loading ? 'Sending...' : 'Send Reset Code'}</button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2">Verification Code</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="input-field pl-12 text-center tracking-[8px] font-mono text-xl" placeholder="000000" maxLength={6} required />
                    </div>
                  </div>
                  <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full text-xs">{loading ? 'Verifying...' : 'Verify Code'}</button>
                  <button type="button" onClick={handleResendOTP} disabled={loading} className="w-full text-sm text-gold-500 hover:text-gold-600 text-center">Resend code</button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2">New Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-12" placeholder="••••••••" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field pl-12" placeholder="••••••••" required />
                    </div>
                  </div>
                  <p className="text-xs text-caviar-400">Must be 8+ characters with uppercase, lowercase, number, and special character.</p>
                  <button type="submit" disabled={loading} className="btn-primary w-full text-xs"><FiCheck className="inline mr-2" />{loading ? 'Resetting...' : 'Reset Password'}</button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
