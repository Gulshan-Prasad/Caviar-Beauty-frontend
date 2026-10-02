import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiEyeOff, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Uppercase letter required')
    .regex(/[a-z]/, 'Lowercase letter required')
    .regex(/[0-9]/, 'Number required')
    .regex(/[^A-Za-z0-9]/, 'Special character required'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function AdminChangePassword() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  if (user?.role !== 'ADMIN') return <Navigate to={user ? '/dashboard' : '/admin/login'} replace />;
  if (!user?.mustChangePassword) return <Navigate to="/admin" replace />;

  const onSubmit = async (data) => {
    try {
      await api.put('/auth/change-password', { currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully');
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    }
  };

  const passwordField = (key, placeholder) => (
    <div className="relative">
      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
      <input type={show[key] ? 'text' : 'password'} {...register(key)} className="input-field pl-12 pr-12" placeholder={placeholder} />
      <button type="button" onClick={() => setShow({ ...show, [key]: !show[key] })} className="absolute right-4 top-1/2 -translate-y-1/2 text-caviar-400 hover:text-caviar-600" aria-label="Toggle password visibility">
        {show[key] ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="pt-32 pb-20 px-4 min-h-screen flex items-start justify-center">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <FiShield className="w-6 h-6 text-gold-500" />
            <h1 className="font-serif text-3xl">Change Password</h1>
          </div>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="text-xs text-caviar-400 hover:text-caviar-600 flex items-center space-x-1">
            <FiLogOut className="w-3 h-3" /><span>Logout</span>
          </button>
        </div>
        <p className="text-caviar-500 dark:text-caviar-400 mb-8 text-sm">
          You must change the default password before continuing. Choose a strong password you haven't used before.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">Current Password</label>
            {passwordField('currentPassword', 'Enter current password')}
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">New Password</label>
            {passwordField('newPassword', 'At least 8 chars, 1 upper, 1 lower, 1 number, 1 special')}
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">Confirm New Password</label>
            {passwordField('confirmPassword', 'Re-enter new password')}
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-xs">
            {isSubmitting ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
