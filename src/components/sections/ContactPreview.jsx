import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useInView } from '@/hooks/useInView';

export default function ContactPreview() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="py-20 md:py-32 px-4 md:px-8 lg:px-12 bg-caviar-50 dark:bg-caviar-900/50">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-subtitle">Get In Touch</p>
          <h2 className="section-title mt-3">We'd Love to Hear From You</h2>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: FiPhone, title: 'Phone', info: '+91 98765 43210', link: 'tel:+919876543210' },
            { icon: FiMail, title: 'Email', info: 'hello@caviarbeauty.com', link: 'mailto:hello@caviarbeauty.com' },
            { icon: FiMapPin, title: 'Flagship Store', info: 'DLF Emporio, New Delhi', link: '/contact' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link to={item.link} className="block text-center p-8 border border-caviar-200 dark:border-caviar-700 hover:border-gold-500 dark:hover:border-gold-500 transition-all duration-300 group">
                <item.icon className="w-8 h-8 mx-auto text-gold-500 mb-4" />
                <h3 className="text-sm tracking-widest uppercase font-medium mb-2">{item.title}</h3>
                <p className="text-caviar-500 dark:text-caviar-400 text-sm">{item.info}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link to="/contact" className="btn-primary text-xs">Contact Us</Link>
        </motion.div>
      </div>
    </section>
  );
}
