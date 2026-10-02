import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const slides = [
  { id: 1, title: 'Timeless Elegance', subtitle: 'Discover the new collection', cta: 'Shop Now', cta2: 'Explore Collection', gradient: 'from-caviar-950 via-caviar-900 to-caviar-800' },
  { id: 2, title: 'Luxury Redefined', subtitle: 'Handcrafted perfection', cta: 'Discover', cta2: 'View Lookbook', gradient: 'from-caviar-900 via-caviar-800 to-caviar-950' },
  { id: 3, title: 'The Art of Style', subtitle: 'Where craftsmanship meets design', cta: 'Explore', cta2: 'Our Story', gradient: 'from-caviar-950 via-caviar-850 to-caviar-800' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Layers */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[current].gradient}`}
        />
      </AnimatePresence>

      {/* Overlay Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-gold-400 text-sm md:text-base tracking-[0.3em] uppercase font-medium mb-4"
            >
              {slides[current].subtitle}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white leading-none tracking-tight mb-8"
            >
              {slides[current].title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center space-x-4"
            >
              <Link to="/products" className="btn-primary bg-white text-caviar-950 hover:bg-gold-500 hover:text-white border-0 text-xs">
                {slides[current].cta}
              </Link>
              <Link to="/collections" className="btn-secondary border-white text-white hover:bg-white hover:text-caviar-950 text-xs">
                {slides[current].cta2}
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-32 flex items-center space-x-3">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`h-1 transition-all duration-500 ${i === current ? 'w-12 bg-gold-500' : 'w-6 bg-white/30 hover:bg-white/50'}`} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-white/50 flex flex-col items-center">
          <span className="text-[10px] tracking-[0.3em] uppercase mb-2">Scroll</span>
          <FiChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
