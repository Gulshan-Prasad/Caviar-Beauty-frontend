import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useInView } from '@/hooks/useInView';
import { testimonials } from '@/data/navigation';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { ref, isInView } = useInView();

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 lg:px-12 bg-caviar-950 text-white">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase font-medium">Testimonials</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mt-3">What Our Clients Say</h2>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mt-6" />
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <p className="text-lg md:text-xl text-caviar-200 leading-relaxed font-serif italic mb-8">
                "{testimonials[current].text}"
              </p>
              <div className="w-12 h-12 rounded-full bg-caviar-700 mx-auto mb-4 flex items-center justify-center">
                <span className="font-serif text-lg">{testimonials[current].name[0]}</span>
              </div>
              <p className="font-medium">{testimonials[current].name}</p>
              <p className="text-sm text-caviar-400 mt-1">{testimonials[current].title}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center space-x-4 mt-10">
            <button onClick={prev} className="w-12 h-12 flex items-center justify-center border border-caviar-700 text-caviar-400 hover:text-white hover:border-white transition-all rounded-full" aria-label="Previous">
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-gold-500' : 'w-1.5 bg-caviar-600 hover:bg-caviar-400'}`} aria-label={`Testimonial ${i + 1}`} />
              ))}
            </div>
            <button onClick={next} className="w-12 h-12 flex items-center justify-center border border-caviar-700 text-caviar-400 hover:text-white hover:border-white transition-all rounded-full" aria-label="Next">
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
