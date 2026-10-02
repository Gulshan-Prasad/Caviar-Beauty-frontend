import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { useInView } from '@/hooks/useInView';

export default function RelatedProducts({ products }) {
  const { ref, isInView } = useInView();

  if (!products?.length) return null;

  return (
    <section ref={ref} className="mt-20 pt-16 border-t border-caviar-200 dark:border-caviar-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-lg tracking-widest uppercase font-medium mb-8">Complete the Look</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ProductCard product={product} listName="Related Products" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
