import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import PageTransition from '@/components/layout/PageTransition';
import { useAuthStore } from '@/store/authStore';

export default function Login() {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

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
            <LoginForm />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
