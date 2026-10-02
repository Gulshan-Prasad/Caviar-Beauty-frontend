import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { useSeo } from '@/hooks/useSeo';
import { trackEvent, toGaItems } from '@/utils/analytics';
import PageTransition from '@/components/layout/PageTransition';
import ImageGallery from '@/components/product/ImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductReviews from '@/components/product/ProductReviews';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data),
    enabled: !!slug,
  });

  useEffect(() => {
    if (!product) return;
    trackEvent('view_item', {
      currency: 'INR',
      value: Number(product.discountPrice ?? product.basePrice ?? 0),
      items: toGaItems([{ product, quantity: 1 }]),
    });
  }, [product]);

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.metaDesc || product.description,
    image: product.images?.[0]?.url ? [product.images[0].url] : ['/favicon.svg'],
    sku: product.slug,
    brand: { '@type': 'Brand', name: product.brand?.name || 'Caviar Beauty' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  } : undefined;

  useSeo(product?.name, product?.metaDesc || product?.description, {
    path: product ? `/products/${product.slug}` : undefined,
    type: 'product',
    image: product?.images?.[0]?.url || '/favicon.svg',
    jsonLd,
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <Skeleton className="aspect-[4/5]" />
              <div className="space-y-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12 text-center">
          <h1 className="font-serif text-3xl">Product not found</h1>
          <Link to="/products" className="btn-primary mt-6 inline-flex text-xs">Browse Products</Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto">
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2 text-sm text-caviar-400 mb-8">
            <Link to="/" className="hover:text-caviar-950 dark:hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-caviar-950 dark:hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span className="text-caviar-950 dark:text-white">{product.name}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <ImageGallery images={product.images} name={product.name} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <ProductInfo product={product} />
            </motion.div>
          </div>

          <ProductReviews reviews={product.reviews || []} productId={product.id} />
          <RelatedProducts products={product.related || []} />
        </div>
      </div>
    </PageTransition>
  );
}
