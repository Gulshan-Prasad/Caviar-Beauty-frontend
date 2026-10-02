import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { categories } from '@/data/navigation';

export default function FeaturedCollections() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-subtitle">Curated For You</p>
          <h2 className="section-title mt-3">Featured Collections</h2>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.slice(0, 6).map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={`/products?category=${cat.slug}`} className="group block relative overflow-hidden aspect-[4/5]">
                <div className="absolute inset-0 bg-gradient-to-t from-caviar-950/80 via-caviar-950/20 to-transparent z-10" />
                <div className="w-full h-full bg-caviar-100 dark:bg-caviar-800 flex items-center justify-center">
                  <span className="font-serif text-4xl text-caviar-300 dark:text-caviar-600">{cat.name[0]}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
                  <h3 className="font-serif text-xl md:text-2xl text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-white/60 line-clamp-2">{cat.description}</p>
                  <span className="inline-block mt-4 text-xs text-gold-400 tracking-[0.2em] uppercase group-hover:tracking-[0.3em] transition-all duration-300">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
