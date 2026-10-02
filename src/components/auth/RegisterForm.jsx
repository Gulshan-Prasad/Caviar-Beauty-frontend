import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiCheck, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import GoogleLoginButton from './GoogleLoginButton';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Minimum 8 characters')
    .regex(/[A-Z]/, 'Must include an uppercase letter')
    .regex(/[a-z]/, 'Must include a lowercase letter')
    .regex(/[0-9]/, 'Must include a number')
    .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

const requirements = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'One number', test: (v) => /[0-9]/.test(v) },
  { label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export default function RegisterForm() {
  const { register: registerUser } = useAuthStore();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const passwordVal = useWatch({ control, name: 'password' }) || '';

  const onSubmit = async (data) => {
    try {
      await registerUser({ email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName });
      toast.success('Account created! Welcome to Caviar Beauty.');
    } catch (err) { toast.error(err.response?.data?.error || err.response?.data?.message || 'Registration failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h1 className="font-serif text-3xl md:text-4xl mb-2">Create Account</h1>
      <p className="text-caviar-500 dark:text-caviar-400 mb-8">Join the Caviar Beauty family</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">First Name</label>
            <input type="text" {...register('firstName')} className="input-field" placeholder="Jane" />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase font-medium mb-2">Last Name</label>
            <input type="text" {...register('lastName')} className="input-field" placeholder="Doe" />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

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
          <div className="mt-3 space-y-1.5">
            {requirements.map((req) => {
              const met = req.test(passwordVal);
              return (
                <div key={req.label} className={`flex items-center space-x-2 text-xs ${met ? 'text-green-600' : 'text-caviar-400'}`}>
                  {met ? <FiCheck className="w-3 h-3" /> : <FiX className="w-3 h-3" />}
                  <span>{req.label}</span>
                </div>
              );
            })}
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase font-medium mb-2">Confirm Password</label>
          <input type="password" {...register('confirmPassword')} className="input-field" placeholder="••••••••" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-xs">
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-caviar-200 dark:border-caviar-700" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-caviar-950 px-4 text-caviar-400">or sign up with</span></div>
      </div>

      <GoogleLoginButton />

      <div className="mt-8 text-center">
        <p className="text-sm text-caviar-500">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-500 hover:text-gold-600 font-medium">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}
