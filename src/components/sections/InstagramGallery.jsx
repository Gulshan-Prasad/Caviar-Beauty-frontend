import { motion } from 'framer-motion';
import { FiInstagram } from 'react-icons/fi';
import { useInView } from '@/hooks/useInView';

const posts = Array.from({ length: 6 }, (_, i) => ({ id: i, handle: '@caviarbeauty' }));

export default function InstagramGallery() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 md:py-32">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-subtitle">Follow Us</p>
          <h2 className="section-title mt-3">@caviarbeauty</h2>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mt-6" />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {posts.map((post, i) => (
          <motion.a
            key={post.id}
            href="#"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative aspect-square overflow-hidden bg-caviar-100 dark:bg-caviar-800"
          >
            <div className="absolute inset-0 bg-caviar-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
              <FiInstagram className="w-8 h-8 text-white" />
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-2xl text-caviar-300 dark:text-caviar-600 group-hover:scale-110 transition-transform duration-300">CB</span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
