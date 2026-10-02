import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, getImageUrl } from '@/utils/helpers';
import PageTransition from '@/components/layout/PageTransition';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCartStore();

  const shippingCost = total > 5000 ? 0 : 99;
  const tax = total * 0.18;

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="section-subtitle">Review Your Order</p>
            <h1 className="section-title mt-3">Shopping Cart</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </motion.div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-caviar-400 text-sm tracking-wider uppercase mb-4">Your cart is empty</p>
              <Link to="/products" className="btn-primary text-xs">Continue Shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div key={item.id} layout exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }} className="flex space-x-6 p-6 border border-caviar-200 dark:border-caviar-800">
                      <div className="w-24 h-32 bg-caviar-100 dark:bg-caviar-800 flex-shrink-0">
                          <img src={getImageUrl(item.product.images?.[0]?.url || '')} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                    <div className="flex-1">
                      <Link to={`/products/${item.product.slug}`} className="font-medium hover:text-gold-500 transition-colors">{item.product.name}</Link>
                      <p className="text-sm text-caviar-500 mt-1">{formatPrice(item.product.discountPrice || item.product.basePrice)}</p>
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center border border-caviar-300 dark:border-caviar-600">
                          <button onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-caviar-50 dark:hover:bg-caviar-800"><FiMinus className="w-3 h-3" /></button>
                          <span className="px-4 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-caviar-50 dark:hover:bg-caviar-800"><FiPlus className="w-3 h-3" /></button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-caviar-400 hover:text-red-500 transition-colors"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{formatPrice((item.product.discountPrice || item.product.basePrice) * item.quantity)}</p>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>

              <div className="lg:col-span-1">
                <div className="p-8 border border-caviar-200 dark:border-caviar-800 sticky top-28">
                  <h3 className="text-sm tracking-widest uppercase font-medium mb-6">Order Summary</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-caviar-500">Subtotal</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-caviar-500">Shipping</span>
                      <span>{total > 5000 ? 'Free' : '₹99'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-caviar-500">GST (18%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-caviar-200 dark:border-caviar-800 pt-4 flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatPrice(total + shippingCost + tax)}</span>
                    </div>
                  </div>
                  <Link to="/checkout" className="btn-primary w-full text-center text-xs mt-6">Proceed to Checkout</Link>
                  <Link to="/products" className="flex items-center justify-center space-x-2 text-xs text-caviar-500 hover:text-caviar-950 dark:hover:text-white mt-4 transition-colors">
                    <FiArrowLeft className="w-3 h-3" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
