import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { categories } from '@/data/navigation';

export default function LuxuryCategories() {
  const { ref, isInView } = useInView();

  const mainCategories = categories.slice(0, 4);

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-subtitle">Browse By</p>
          <h2 className="section-title mt-3">Luxury Categories</h2>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {mainCategories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={`/products?category=${cat.slug}`} className="group block text-center">
                <div className="aspect-square bg-caviar-50 dark:bg-caviar-800 relative overflow-hidden mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-6xl md:text-7xl text-caviar-200 dark:text-caviar-700 group-hover:scale-110 transition-transform duration-500">{cat.name[0]}</span>
                  </div>
                  <div className="absolute inset-0 bg-caviar-950/0 group-hover:bg-caviar-950/10 transition-colors duration-500" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl group-hover:text-gold-500 transition-colors duration-300">{cat.name}</h3>
                <p className="text-sm text-caviar-500 dark:text-caviar-400 mt-2 line-clamp-2">{cat.description}</p>
                <span className="inline-block mt-4 text-xs tracking-[0.2em] uppercase text-caviar-600 dark:text-caviar-300 group-hover:tracking-[0.3em] transition-all duration-300">
                  Shop Now →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
