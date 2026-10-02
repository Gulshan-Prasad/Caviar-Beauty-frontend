import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { user } = await login(data.email, data.password, true);
      if (user.role !== 'ADMIN') {
        toast.error('Access denied. Admin credentials required.');
        return;
      }
      toast.success('Welcome back, Admin!');
      if (user.mustChangePassword) {
        navigate('/admin/change-password', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="flex items-center space-x-3 mb-2">
        <FiShield className="w-6 h-6 text-gold-500" />
        <h1 className="font-serif text-3xl md:text-4xl">Admin Login</h1>
      </div>
      <p className="text-caviar-500 dark:text-caviar-400 mb-8">Sign in to the admin panel</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs tracking-widest uppercase font-medium mb-2">Admin Email</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
            <input type="email" {...register('email')} className="input-field pl-12" placeholder="admin@caviarbeauty.com" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase font-medium mb-2">Password</label>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
            <input type={showPassword ? 'text' : 'password'} {...register('password')} className="input-field pl-12 pr-12" placeholder="••••••••" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-caviar-400 hover:text-caviar-600">
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-xs">
          {isSubmitting ? 'Signing in...' : 'Sign In as Admin'}
        </button>
      </form>

      <div className="mt-8 text-center space-y-2">
        <p className="text-sm text-caviar-500">
          <Link to="/login" className="text-gold-500 hover:text-gold-600">Customer login</Link>
        </p>
      </div>
    </motion.div>
  );
}
