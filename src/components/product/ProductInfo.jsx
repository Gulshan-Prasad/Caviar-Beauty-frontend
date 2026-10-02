import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2, FiStar, FiMinus, FiPlus } from 'react-icons/fi';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, calculateDiscount } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function ProductInfo({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const isInWishlist = useWishlistStore((s) => s.items.includes(product.id));
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    setSelectedVariant(product.variants?.[0] || null);
    setQuantity(1);
  }, [product.id, product.variants]);

  const discount = calculateDiscount(product.basePrice, product.discountPrice);
  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];
  const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))];
  const variantHasPrice = selectedVariant?.price != null;
  const displayPrice = selectedVariant?.price ?? product.discountPrice ?? product.basePrice;

  let specifications = {};
  if (product.specifications) {
    try {
      specifications = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications;
    } catch {
      specifications = {};
    }
  }

  const handleAddToCart = () => {
    addItem(product.id, selectedVariant?.id, quantity);
    toast.success('Added to cart');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-caviar-400 dark:text-caviar-500 mb-2">
          {product.brand?.name || 'Caviar Beauty'}
        </p>
        <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-medium">{product.name}</h1>

        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-gold-500 text-gold-500' : 'text-caviar-300 dark:text-caviar-600'}`} />
            ))}
          </div>
          <span className="text-sm text-caviar-500">({product.reviews?.length || 0} reviews)</span>
        </div>
      </div>

      <div className="flex items-baseline space-x-3">
        {variantHasPrice ? (
          <span className="text-2xl md:text-3xl font-medium">{formatPrice(displayPrice)}</span>
        ) : product.discountPrice ? (
          <>
            <span className="text-2xl md:text-3xl font-medium">{formatPrice(product.discountPrice)}</span>
            <span className="text-lg text-caviar-400 line-through">{formatPrice(product.basePrice)}</span>
            <span className="text-sm text-red-500 font-medium">-{discount}% OFF</span>
          </>
        ) : (
          <span className="text-2xl md:text-3xl font-medium">{formatPrice(product.basePrice)}</span>
        )}
      </div>

      <p className="text-caviar-600 dark:text-caviar-300 leading-relaxed">{product.description}</p>

      {product.material && (
        <p className="text-sm">
          <span className="text-caviar-400 uppercase tracking-wider text-xs">Material: </span>
          <span className="text-caviar-600 dark:text-caviar-300">{product.material}</span>
        </p>
      )}

      {colors.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase font-medium mb-3">Color: {selectedVariant?.color || 'Select'}</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedVariant(product.variants.find((v) => v.color === color && (!selectedVariant?.size || v.size === selectedVariant.size)) || product.variants.find((v) => v.color === color) || selectedVariant)}
                className={`px-6 py-2 text-sm border transition-all duration-300 ${
                  selectedVariant?.color === color
                    ? 'border-caviar-950 dark:border-white bg-caviar-950 dark:bg-white text-white dark:text-caviar-950'
                    : 'border-caviar-300 dark:border-caviar-600 hover:border-caviar-950 dark:hover:border-white'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase font-medium mb-3">Size: {selectedVariant?.size || 'Select'}</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedVariant(product.variants.find((v) => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color)) || product.variants.find((v) => v.size === size) || selectedVariant)}
                className={`w-14 h-14 flex items-center justify-center text-sm border transition-all duration-300 ${
                  selectedVariant?.size === size
                    ? 'border-caviar-950 dark:border-white bg-caviar-950 dark:bg-white text-white dark:text-caviar-950'
                    : 'border-caviar-300 dark:border-caviar-600 hover:border-caviar-950 dark:hover:border-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {Object.keys(specifications).length > 0 && (
        <div>
          <p className="text-xs tracking-widest uppercase font-medium mb-3">Specifications</p>
          <div className="space-y-2">
            {Object.entries(specifications).map(([key, val]) => (
              <div key={key} className="flex text-sm">
                <span className="w-1/2 text-caviar-400 uppercase tracking-wider text-xs">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="w-1/2 text-caviar-600 dark:text-caviar-300">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <div className="flex items-center border border-caviar-300 dark:border-caviar-600">
          <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="p-3 hover:bg-caviar-50 dark:hover:bg-caviar-800 transition-colors" aria-label="Decrease quantity">
            <FiMinus className="w-4 h-4" />
          </button>
          <span className="px-4 text-sm font-medium">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-caviar-50 dark:hover:bg-caviar-800 transition-colors" aria-label="Increase quantity">
            <FiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={handleAddToCart} className="btn-primary flex-1 text-xs">
          Add to Cart
        </button>
        <button
          onClick={() => toggleItem(product.id)}
          className={`btn-secondary flex-1 text-xs flex items-center justify-center space-x-2 ${
            isInWishlist ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' : ''
          }`}
        >
          <FiHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          <span>{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>

      <div className="flex items-center space-x-6 text-sm text-caviar-500">
        <button className="flex items-center space-x-2 hover:text-caviar-950 dark:hover:text-white transition-colors">
          <FiShare2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {product.inventory && (
        <p className={`text-sm ${product.inventory.quantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {product.inventory.quantity > 0 ? `In Stock (${product.inventory.quantity} available)` : 'Out of Stock'}
        </p>
      )}
    </div>
  );
}
