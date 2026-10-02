import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '@/utils/helpers';

export default function ImageGallery({ images, name }) {
  const [selected, setSelected] = useState(0);

  const placeholderImages = images.length ? images : [{ url: '', alt: name }];

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-caviar-50 dark:bg-caviar-800 group cursor-crosshair">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <img
              src={getImageUrl(placeholderImages[selected]?.url || '')}
              alt={placeholderImages[selected]?.alt || name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {placeholderImages.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {placeholderImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-16 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors duration-300 ${
                i === selected ? 'border-gold-500' : 'border-transparent hover:border-caviar-300 dark:hover:border-caviar-600'
              }`}
            >
              <img
                src={getImageUrl(img.url || '')}
                alt={img.alt || `${name} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
