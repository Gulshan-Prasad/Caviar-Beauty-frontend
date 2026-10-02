import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-caviar-950"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1
            className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-[0.15em] text-caviar-950 dark:text-white"
            animate={{ opacity: [1, 1, 0], y: [0, 0, -20] }}
            transition={{ duration: 2.2, times: [0, 0.6, 1] }}
          >
            CAVIAR
          </motion.h1>
          <motion.p
            className="font-serif text-xl md:text-2xl text-gold-500 italic mt-2 tracking-[0.3em]"
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: 2.2, times: [0, 0.6, 1], delay: 0.1 }}
          >
            Beauty
          </motion.p>
          <motion.div
            className="h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mt-6 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: ['0px', '120px', '0px'] }}
            transition={{ duration: 2.2, times: [0, 0.4, 1], delay: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
