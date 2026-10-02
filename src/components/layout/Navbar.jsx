import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useThemeStore } from '@/store/themeStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { menuItems } from '@/data/navigation';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { scrollDirection, isScrolled } = useScrollDirection();
  const { isDark, toggle } = useThemeStore();
  const { items } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { items: wishlist } = useWishlistStore();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const useLightText = !isScrolled && isHome;
  const { toggleCart } = useCartStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const mobileMenuVariants = {
    closed: { x: '100%', opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="visible"
        animate={scrollDirection === 'down' && isScrolled ? 'hidden' : 'visible'}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'glass-solid shadow-sm border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className={`font-serif text-xl md:text-2xl tracking-[0.2em] transition-colors duration-300 ${
                useLightText ? 'text-white' : 'text-caviar-950 dark:text-white'
              }`}>
                CAVIAR
              </span>
              <span className={`font-serif text-lg md:text-xl italic text-gold-500 transition-opacity duration-300 ${
                useLightText ? 'text-gold-400' : 'text-gold-600 dark:text-gold-400'
              }`}>
                Beauty
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm tracking-widest uppercase link-hover transition-colors duration-300 ${
                    useLightText
                      ? 'text-white/80 hover:text-white'
                      : 'text-caviar-700 dark:text-caviar-200 hover:text-caviar-950 dark:hover:text-white'
                  } ${pathname === item.href ? 'after:w-full font-medium' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`transition-colors duration-300 ${
                  useLightText ? 'text-white/80 hover:text-white' : 'text-caviar-700 dark:text-caviar-200 hover:text-caviar-950 dark:hover:text-white'
                }`}
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
              <button onClick={toggle} className={`transition-colors duration-300 ${
                useLightText ? 'text-white/80' : 'text-caviar-700 dark:text-caviar-200'
              }`} aria-label="Toggle theme">
                {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>
              <Link to={isAuthenticated ? (user?.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'} className={`transition-colors duration-300 hidden sm:block ${
                useLightText ? 'text-white/80 hover:text-white' : 'text-caviar-700 dark:text-caviar-200 hover:text-caviar-950 dark:hover:text-white'
              }`} aria-label="Account">
                <FiUser className="w-5 h-5" />
              </Link>
              <Link to="/wishlist" className={`transition-colors duration-300 relative hidden sm:block ${
                useLightText ? 'text-white/80 hover:text-white' : 'text-caviar-700 dark:text-caviar-200 hover:text-caviar-950 dark:hover:text-white'
              }`} aria-label="Wishlist">
                <FiHeart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-gold-500 text-white text-[10px] font-medium rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button onClick={toggleCart} className={`transition-colors duration-300 relative ${
                useLightText ? 'text-white/80 hover:text-white' : 'text-caviar-700 dark:text-caviar-200 hover:text-caviar-950 dark:hover:text-white'
              }`} aria-label="Cart">
                <FiShoppingBag className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center bg-gold-500 text-white text-[10px] font-medium rounded-full">
                    {items.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={`lg:hidden transition-colors duration-300 ${
                  useLightText ? 'text-white' : 'text-caviar-700 dark:text-caviar-200'
                }`}
                aria-label="Menu"
              >
                {isMobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 overflow-hidden"
            >
              <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-caviar-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-12 pr-4 py-3 bg-caviar-100 dark:bg-caviar-800 text-caviar-950 dark:text-white placeholder:text-caviar-400 border-0 rounded-none focus:ring-2 focus:ring-gold-500/30 outline-none"
                      autoFocus
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] bg-caviar-950 dark:bg-caviar-950 lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-white font-serif text-3xl md:text-4xl tracking-wider hover:text-gold-400 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-6 pt-8"
              >
                <Link to={isAuthenticated ? (user?.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'} className="text-white/60 hover:text-white transition-colors" onClick={() => setIsMobileOpen(false)}>
                  <FiUser className="w-6 h-6" />
                </Link>
                <Link to="/wishlist" className="text-white/60 hover:text-white transition-colors relative" onClick={() => setIsMobileOpen(false)}>
                  <FiHeart className="w-6 h-6" />
                  {wishlist.length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold-500 text-white text-[10px] rounded-full flex items-center justify-center">{wishlist.length}</span>}
                </Link>
                <button onClick={() => { setIsMobileOpen(false); toggleCart(); }} className="text-white/60 hover:text-white transition-colors">
                  <FiShoppingBag className="w-6 h-6" />
                </button>
                <button onClick={toggle} className="text-white/60 hover:text-white transition-colors">
                  {isDark ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
