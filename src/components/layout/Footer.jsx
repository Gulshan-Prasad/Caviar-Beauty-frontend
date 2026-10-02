import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiInstagram, FiTwitter, FiLinkedin, FiYoutube, FiHeart } from 'react-icons/fi';
import { footerLinks } from '@/data/navigation';

export default function Footer() {
  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <footer className="bg-caviar-950 text-caviar-300">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12"
        >
          {/* Brand */}
          <motion.div variants={item} className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.2em] text-white">CAVIAR</span>
              <span className="font-serif text-xl italic text-gold-500 ml-1">Beauty</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-caviar-400 max-w-xs">
              Crafting timeless luxury since 2024. Each piece is a testament to extraordinary craftsmanship and uncompromising quality.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              {[FiInstagram, FiTwitter, FiLinkedin, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 flex items-center justify-center border border-caviar-700 text-caviar-400 hover:text-gold-500 hover:border-gold-500 transition-all duration-300 rounded-full">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-caviar-400 hover:text-white transition-colors duration-300 link-hover">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories */}
          <motion.div variants={item}>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase font-medium mb-6">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link}>
                  <Link to={`/products?category=${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-caviar-400 hover:text-white transition-colors duration-300 link-hover">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={item}>
            <h4 className="text-white text-xs tracking-[0.2em] uppercase font-medium mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-caviar-400 hover:text-white transition-colors duration-300 link-hover">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-caviar-800 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <p className="text-xs text-caviar-500">
            &copy; {new Date().getFullYear()} Caviar Beauty. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs text-caviar-500">
            {footerLinks.policies.map((policy) => (
              <Link key={policy} to={`/${policy.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-caviar-300 transition-colors">
                {policy}
              </Link>
            ))}
          </div>
          <p className="text-xs text-caviar-600 flex items-center">
            Made with <FiHeart className="w-3 h-3 mx-1 text-red-400" /> by Caviar Beauty
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
