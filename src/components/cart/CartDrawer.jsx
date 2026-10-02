import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getImageUrl } from '@/utils/helpers';

export default function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const isOpen = useCartStore((s) => s.isOpen);
  const setCartOpen = useCartStore((s) => s.setCartOpen);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[201] w-full max-w-md bg-white dark:bg-caviar-950 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-caviar-200 dark:border-caviar-800">
                <h2 className="text-lg tracking-widest uppercase font-medium">Cart ({items.length})</h2>
                <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-caviar-100 dark:hover:bg-caviar-800 rounded-full transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-caviar-400 text-sm tracking-wider uppercase">Your cart is empty</p>
                    <Link to="/products" onClick={() => setCartOpen(false)} className="btn-primary mt-6 inline-flex text-xs">Shop Now</Link>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const unitPrice = item.variant?.price ?? item.product.discountPrice ?? item.product.basePrice;
                      return (
                      <motion.div key={item.id} layout exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }} className="flex space-x-4">
                        <div className="w-20 h-24 bg-caviar-100 dark:bg-caviar-800 flex-shrink-0">
                          <img src={getImageUrl(item.product.images?.[0]?.url || '')} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/products/${item.product.slug}`} onClick={() => setCartOpen(false)} className="text-sm font-medium truncate block hover:text-gold-500 transition-colors">
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-cavitar-400 mt-1">{formatPrice(unitPrice)}</p>
                          {(item.variant?.color || item.variant?.size) && <p className="text-xs text-caviar-400 mt-1">{[item.variant.color, item.variant.size].filter(Boolean).join(' · ')}</p>}
                          <div className="flex items-center space-x-3 mt-3">
                            <button onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-caviar-100 dark:hover:bg-caviar-800 rounded transition-colors">
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-caviar-100 dark:hover:bg-caviar-800 rounded transition-colors">
                              <FiPlus className="w-3 h-3" />
                            </button>
                            <button onClick={() => removeItem(item.id)} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 rounded transition-colors ml-auto">
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-caviar-200 dark:border-caviar-800 p-6 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-caviar-500 uppercase tracking-wider">Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-caviar-400">Shipping & taxes calculated at checkout</p>
                  <Link to="/checkout" onClick={() => setCartOpen(false)} className="btn-primary w-full text-center text-xs">
                    Checkout
                  </Link>
                  <button onClick={() => setCartOpen(false)} className="w-full text-center text-xs text-caviar-500 hover:text-caviar-950 dark:hover:text-white transition-colors uppercase tracking-wider">
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
