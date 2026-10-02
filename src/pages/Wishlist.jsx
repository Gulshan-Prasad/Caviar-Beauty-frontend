import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import PageTransition from '@/components/layout/PageTransition';
import ProductGrid from '@/components/product/ProductGrid';

export default function Wishlist() {
  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then(r => r.data),
  });

  const products = data?.items?.map((i) => i.product) || [];

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="section-subtitle">Saved Items</p>
            <h1 className="section-title mt-3">Your Wishlist</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </motion.div>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-caviar-400 text-sm tracking-wider uppercase mb-4">Your wishlist is empty</p>
              <Link to="/products" className="btn-primary text-xs">Discover Products</Link>
            </div>
          ) : (
            <ProductGrid products={products} isLoading={isLoading} />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
