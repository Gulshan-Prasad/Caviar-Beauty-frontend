import { Navigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import PageTransition from '@/components/layout/PageTransition';
import { useAuthStore } from '@/store/authStore';

export default function Register() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <PageTransition>
      <div className="min-h-screen flex pt-20 md:pt-24">
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-12">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
        <div className="hidden lg:flex w-1/2 bg-caviar-100 dark:bg-caviar-900 items-center justify-center">
          <span className="font-serif text-8xl text-caviar-200 dark:text-caviar-700">CB</span>
        </div>
      </div>
    </PageTransition>
  );
}
