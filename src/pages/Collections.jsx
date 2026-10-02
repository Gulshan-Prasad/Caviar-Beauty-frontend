import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageTransition from '@/components/layout/PageTransition';
import { useSeo } from '@/hooks/useSeo';
import api from '@/utils/api';

export default function Collections() {
  useSeo('Collections', 'Explore curated luxury collections at Caviar Beauty.');
  const { data, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => (await api.get('/catalog/collections')).data,
    staleTime: 60000,
  });

  const collections = data?.collections ?? [];

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 min-h-screen">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <p className="section-subtitle">Curated Selections</p>
            <h1 className="section-title mt-3">Our Collections</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-caviar-100 dark:bg-caviar-800 mb-6" />
                <div className="h-6 w-1/2 bg-caviar-100 dark:bg-caviar-800 mb-2" />
                <div className="h-4 w-2/3 bg-caviar-100 dark:bg-caviar-800" />
              </div>
            ))}

            {!isLoading && collections.length > 0 && collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/products?collection=${col.slug}`} className="group block">
                  <div className="aspect-[4/5] bg-caviar-100 dark:bg-caviar-800 relative overflow-hidden mb-6">
                    {col.image ? (
                      <img src={col.image} alt={col.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-7xl text-caviar-200 dark:text-caviar-700 group-hover:scale-110 transition-transform duration-500">{col.name[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-caviar-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <h3 className="font-serif text-2xl group-hover:text-gold-500 transition-colors">{col.name}</h3>
                  {col.description && <p className="text-caviar-500 dark:text-caviar-400 mt-2 text-sm line-clamp-2">{col.description}</p>}
                  <p className="text-caviar-400 dark:text-caviar-500 mt-1 text-xs uppercase tracking-wide">{col._count?.products ?? 0} pieces</p>
                </Link>
              </motion.div>
            ))}

            {!isLoading && collections.length === 0 && (
              <p className="text-caviar-500 dark:text-caviar-400 col-span-full text-center py-10">Collections are being curated. Check back soon.</p>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}