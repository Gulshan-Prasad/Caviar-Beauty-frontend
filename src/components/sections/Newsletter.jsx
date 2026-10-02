import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useInView } from '@/hooks/useInView';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { ref, isInView } = useInView();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await api.post('/newsletter', { email });
      toast.success('Welcome to Caviar Beauty! Check your inbox.');
      setEmail('');
    } catch {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 lg:px-12 bg-caviar-950 text-white">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-gold-400 text-sm tracking-[0.3em] uppercase font-medium">Stay Connected</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium mt-4">Join the Caviar Circle</h2>
          <p className="text-caviar-300 mt-4 leading-relaxed">
            Be the first to know about exclusive collections, early access to new arrivals, and members-only events.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 flex items-center border-b border-caviar-700 focus-within:border-gold-500 transition-colors duration-300 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 bg-transparent py-4 text-white placeholder:text-caviar-500 outline-none text-sm"
            />
            <button type="submit" disabled={subscribing} className="p-4 text-gold-400 hover:text-gold-300 transition-colors" aria-label="Subscribe">
              <FiArrowRight className="w-5 h-5" />
            </button>
          </form>
          <p className="text-xs text-caviar-500 mt-4">By subscribing, you agree to our Privacy Policy.</p>
        </motion.div>
      </div>
    </section>
  );
}
