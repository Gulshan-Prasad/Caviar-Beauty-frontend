import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-7xl md:text-9xl text-gold-500">404</motion.p>
          <p className="section-subtitle mt-6">Page Not Found</p>
          <p className="text-caviar-500 text-sm mt-4">The page you are looking for doesn't exist or has been moved.</p>
          <Link to="/" className="btn-primary text-xs inline-flex mt-8">Back to Home</Link>
        </div>
      </div>
    </PageTransition>
  );
}
