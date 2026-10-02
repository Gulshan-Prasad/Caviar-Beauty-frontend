import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';

export default function AboutBrand() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-[4/5] bg-caviar-100 dark:bg-caviar-800 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-caviar-50 to-caviar-200 dark:from-caviar-800 dark:to-caviar-900 flex items-center justify-center">
              <div className="text-center">
                <span className="font-serif text-8xl md:text-9xl text-caviar-200 dark:text-caviar-700">CB</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="section-subtitle">Our Heritage</p>
            <h2 className="section-title mt-3">The Art of Luxury</h2>
            <div className="w-16 h-[1px] bg-gold-500 mt-6 mb-8" />
            <div className="space-y-5 text-caviar-600 dark:text-caviar-300 leading-relaxed">
              <p>Founded in 2024, Caviar Beauty represents the pinnacle of luxury fashion. Each piece in our collection is a testament to extraordinary craftsmanship, using only the finest materials sourced from around the world.</p>
              <p>Our ateliers in Italy and France house master artisans who bring decades of experience to every stitch, fold, and finish. We believe in slow fashion — creating pieces that transcend seasons and trends.</p>
              <p>From our signature handbags to our curated accessories, every Caviar Beauty piece is designed to be cherished for a lifetime.</p>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-10">
              {[{ num: '200+', label: 'Artisans' }, { num: '30+', label: 'Countries' }, { num: '50K+', label: 'Happy Clients' }].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl md:text-4xl text-caviar-950 dark:text-white">{stat.num}</p>
                  <p className="text-xs text-caviar-500 dark:text-caviar-400 tracking-wider uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-primary mt-10 text-xs">Our Story</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
