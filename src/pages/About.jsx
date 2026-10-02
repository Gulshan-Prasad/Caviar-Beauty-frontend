import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import { useInView } from '@/hooks/useInView';
import { useSeo } from '@/hooks/useSeo';
import Testimonials from '@/components/sections/Testimonials';

const values = [
  { title: 'Craftsmanship', desc: 'Every piece is handcrafted by master artisans with decades of experience.' },
  { title: 'Sustainability', desc: 'Ethically sourced materials and responsible production practices.' },
  { title: 'Timeless Design', desc: 'Pieces designed to transcend seasons and trends.' },
  { title: 'Exclusivity', desc: 'Limited production runs ensure rarity and uniqueness.' },
];

export default function About() {
  useSeo('About', 'Learn about the Caviar Beauty story and craftsmanship.');
  const { ref, isInView } = useInView();

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <p className="section-subtitle">Our Story</p>
            <h1 className="section-title mt-3">The Caviar Beauty Legacy</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="aspect-[4/5] bg-caviar-100 dark:bg-caviar-800 flex items-center justify-center">
              <span className="font-serif text-9xl text-caviar-200 dark:text-caviar-700">CB</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <p className="text-gold-500 text-sm tracking-[0.3em] uppercase font-medium mb-4">Founded 2024</p>
              <div className="space-y-5 text-caviar-600 dark:text-caviar-300 leading-relaxed">
                <p>Caviar Beauty was born from a vision to create the world's finest luxury accessories. Our founder, inspired by the ateliers of Paris and the craftsmanship of Italian artisans, set out to build a house that represents the pinnacle of elegance.</p>
                <p>Today, our pieces are worn by discerning clients in over 30 countries. From our flagship atelier in Milan to our boutique on Fifth Avenue, every Caviar Beauty creation carries the legacy of excellence.</p>
                <p>We believe in slow luxury — pieces that take weeks to create but last a lifetime. Our commitment to quality, sustainability, and timeless design sets us apart in the world of high fashion.</p>
              </div>
            </motion.div>
          </div>

          <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="p-8 border border-caviar-200 dark:border-caviar-800">
                <span className="text-gold-500 font-serif text-3xl">0{i + 1}</span>
                <h3 className="font-serif text-xl mt-4 mb-2">{v.title}</h3>
                <p className="text-sm text-caviar-500 dark:text-caviar-400">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <Testimonials />
      </div>
    </PageTransition>
  );
}
