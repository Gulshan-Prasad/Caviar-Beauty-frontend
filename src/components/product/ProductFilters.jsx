import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiX } from 'react-icons/fi';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

const priceRanges = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: '$2,500 - $5,000', min: 2500, max: 5000 },
  { label: '$5,000+', min: 5000, max: undefined },
];

export default function ProductFilters({ filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(false);

  const clearFilters = () => setFilters({ sort: filters.sort });

  const hasFilters = Object.entries(filters).some(([k, v]) => k !== 'sort' && v);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-sm tracking-widest uppercase text-caviar-600 dark:text-caviar-300 hover:text-caviar-950 dark:hover:text-white transition-colors"
        >
          <span>Filters</span>
          <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center space-x-4">
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-caviar-400 hover:text-red-500 transition-colors flex items-center space-x-1">
              <FiX className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            className="text-sm bg-transparent border-0 text-caviar-600 dark:text-caviar-300 outline-none cursor-pointer"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 pb-4 border-b border-caviar-200 dark:border-caviar-800">
              <div>
                <h4 className="text-xs tracking-widest uppercase font-medium mb-4">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setFilters({ ...filters, minPrice: range.min?.toString(), maxPrice: range.max?.toString() })}
                      className={`block text-sm w-full text-left py-1 transition-colors ${
                        filters.minPrice === range.min?.toString() ? 'text-gold-500 font-medium' : 'text-caviar-500 hover:text-caviar-950 dark:hover:text-white'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
