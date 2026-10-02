import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, calculateDiscount, getImageUrl } from '@/utils/helpers';
import { trackEvent, toGaItems } from '@/utils/analytics';

export default function ProductCard({ product, listName = 'products', index = -1 }) {
  const isInWishlist = useWishlistStore((s) => s.items.includes(product.id));
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const addItem = useCartStore((s) => s.addItem);
  const discount = calculateDiscount(product.basePrice, product.discountPrice);
  const primaryImage = product.images?.[0]?.url;

  const handleSelect = () => {
    trackEvent('select_item', {
      item_list_id: listName.toLowerCase().replace(/\s+/g, '_'),
      item_list_name: listName,
      index,
      items: toGaItems([{ product, quantity: 1 }]),
    });
  };

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/products/${product.slug}`} className="block" onClick={handleSelect}>
        <div className="relative aspect-[3/4] overflow-hidden bg-caviar-50 dark:bg-caviar-800 mb-4">
          <img
            src={getImageUrl(primaryImage || '')}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />

          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] tracking-wider px-2 py-1 font-medium z-10">
              -{discount}%
            </span>
          )}
          {product.isLimited && (
            <span className="absolute top-3 right-3 bg-gold-500 text-white text-[10px] tracking-wider px-2 py-1 font-medium z-10">
              Limited
            </span>
          )}

          <div className="absolute inset-0 bg-caviar-950/0 group-hover:bg-caviar-950/20 transition-all duration-500" />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] tracking-[0.2em] uppercase text-caviar-400 dark:text-caviar-500">{product.brand?.name || 'Caviar Beauty'}</p>
          <h3 className="text-sm font-medium truncate group-hover:text-gold-500 transition-colors">{product.name}</h3>
          <div className="flex items-center space-x-2">
            {product.discountPrice ? (
              <>
                <span className="text-sm font-medium">{formatPrice(product.discountPrice)}</span>
                <span className="text-xs text-caviar-400 line-through">{formatPrice(product.basePrice)}</span>
              </>
            ) : (
              <span className="text-sm font-medium">{formatPrice(product.basePrice)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
        <button
          onClick={(e) => { e.preventDefault(); toggleItem(product.id); }}
          className={`w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-caviar-800 shadow-lg transition-colors ${
            isInWishlist ? 'text-red-500' : 'text-caviar-600 dark:text-caviar-300 hover:text-red-500'
          }`}
          aria-label="Toggle wishlist"
        >
          <FiHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); addItem(product.id); }}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-caviar-800 shadow-lg text-caviar-600 dark:text-caviar-300 hover:text-gold-500 transition-colors"
          aria-label="Add to cart"
        >
          <FiShoppingBag className="w-4 h-4" />
        </button>
        <Link
          to={`/products/${product.slug}`}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-caviar-800 shadow-lg text-caviar-600 dark:text-caviar-300 hover:text-caviar-950 dark:hover:text-white transition-colors"
          aria-label="Quick view"
        >
          <FiEye className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
