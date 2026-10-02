import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import PageTransition from '@/components/layout/PageTransition';
import ProductGrid from '@/components/product/ProductGrid';

export default function NewArrivals() {
  const { data, isLoading } = useQuery({
    queryKey: ['new-arrivals-page'],
    queryFn: () => api.get('/products/new-arrivals').then(r => r.data),
  });

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="section-subtitle">Fresh Arrivals</p>
            <h1 className="section-title mt-3">New Arrivals</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </motion.div>
          <ProductGrid products={data?.products || []} isLoading={isLoading} />
        </div>
      </div>
    </PageTransition>
  );
}
