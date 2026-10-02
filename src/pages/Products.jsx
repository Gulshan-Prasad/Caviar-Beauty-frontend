import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { useSeo } from '@/hooks/useSeo';
import { trackEvent, toGaItems } from '@/utils/analytics';
import PageTransition from '@/components/layout/PageTransition';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  useSeo('All Products', 'Explore the luxury collection at Caviar Beauty.');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    color: searchParams.get('color') || '',
    size: searchParams.get('size') || '',
    search: searchParams.get('search') || '',
    page: searchParams.get('page') || '1',
  });

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.get(`/products?${params}`).then(r => r.data),
  });

  useEffect(() => {
    if (!data?.products) return;
    if (filters.search) {
      trackEvent('search', { search_term: filters.search });
    }
    trackEvent('view_item_list', {
      item_list_id: 'all_products',
      item_list_name: 'All Products',
      items: toGaItems(data.products),
    });
  }, [data]);

  const updateFilters = (newFilters) => {
    const changedOtherFilter = Object.entries(filters).some(([k, v]) => k !== 'page' && v !== newFilters[k]);
    const next = { ...newFilters, page: changedOtherFilter ? '1' : (newFilters.page || '1') };
    setFilters(next);
    const sp = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => { if (v && k !== 'sort') sp.set(k, v); });
    setSearchParams(sp);
  };

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <p className="section-subtitle">Our Collection</p>
            <h1 className="section-title mt-3">All Products</h1>
            <div className="w-16 h-[1px] bg-gold-500 mt-6" />
          </motion.div>

          <ProductFilters filters={filters} setFilters={updateFilters} />
          <ProductGrid products={data?.products || []} isLoading={isLoading} />

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-12">
              {Array.from({ length: data.totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => updateFilters({ ...filters, page: String(i + 1) })}
                  className={`w-10 h-10 text-sm border transition-all duration-300 ${
                    data.page === i + 1 ? 'bg-caviar-950 dark:bg-white text-white dark:text-caviar-950 border-caviar-950 dark:border-white' : 'border-caviar-300 dark:border-caviar-600 hover:border-caviar-950 dark:hover:border-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
