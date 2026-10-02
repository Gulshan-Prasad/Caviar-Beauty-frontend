import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import ProductCard from '@/components/product/ProductCard';

export default function NewArrivals({ products }) {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 lg:px-12 bg-caviar-50 dark:bg-caviar-900/50">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="section-subtitle">Fresh Arrivals</p>
            <h2 className="section-title mt-3">New In</h2>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </div>
          <Link to="/new-arrivals" className="hidden md:inline-flex text-sm tracking-widest uppercase link-hover text-caviar-600 dark:text-caviar-300">
            View All →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <ProductCard product={product} listName="New Arrivals" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 md:hidden"
        >
          <Link to="/new-arrivals" className="btn-secondary text-xs">View All New Arrivals</Link>
        </motion.div>
      </div>
    </section>
  );
}
