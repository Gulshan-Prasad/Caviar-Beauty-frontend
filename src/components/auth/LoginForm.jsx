import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import GoogleLoginButton from './GoogleLoginButton';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
    } catch (err) { toast.error(err.response?.data?.error || 'Invalid credentials'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h1 className="font-serif text-3xl md:text-4xl mb-2">Welcome Back</h1>
      <p className="text-caviar-500 dark:text-caviar-400 mb-8">Sign in to your Caviar Beauty account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-xs tracking-widest uppercase font-medium mb-2">Email</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-4 h-4" />
            <input type="email" {...register('email')} className="input-field pl-12" placeholder="your@email.com" />
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

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="w-4 h-4 accent-gold-500" />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-gold-500 hover:text-gold-600 link-hover">Forgot password?</Link>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-xs">
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-caviar-200 dark:border-caviar-700" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-caviar-950 px-4 text-caviar-400">or continue with</span></div>
      </div>

      <GoogleLoginButton />

      <div className="mt-8 text-center">
        <p className="text-sm text-caviar-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold-500 hover:text-gold-600 font-medium">Create one</Link>
        </p>
      </div>
    </motion.div>
  );
}
