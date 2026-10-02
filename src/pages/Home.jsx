import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { useSeo } from '@/hooks/useSeo';
import PageTransition from '@/components/layout/PageTransition';
import Hero from '@/components/sections/Hero';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import NewArrivals from '@/components/sections/NewArrivals';
import LuxuryCategories from '@/components/sections/LuxuryCategories';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import BestSellers from '@/components/sections/BestSellers';
import AboutBrand from '@/components/sections/AboutBrand';
import Testimonials from '@/components/sections/Testimonials';
import InstagramGallery from '@/components/sections/InstagramGallery';
import Newsletter from '@/components/sections/Newsletter';
import ContactPreview from '@/components/sections/ContactPreview';

export default function Home() {
  useSeo('Home', 'Discover luxury fashion at Caviar Beauty — handcrafted bags, eyewear, and more.');
  const { data: featured } = useQuery({ queryKey: ['featured-products'], queryFn: () => api.get('/products/featured').then(r => r.data.products) });
  const { data: newArrivals } = useQuery({ queryKey: ['new-arrivals'], queryFn: () => api.get('/products/new-arrivals').then(r => r.data.products) });
  const { data: bestSellers } = useQuery({ queryKey: ['best-sellers'], queryFn: () => api.get('/products/best-sellers').then(r => r.data.products) });

  return (
    <PageTransition>
      <Hero />
      <FeaturedCollections />
      <NewArrivals products={newArrivals || []} />
      <LuxuryCategories />
      <FeaturedProducts products={featured || []} />
      <BestSellers products={bestSellers || []} />
      <AboutBrand />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
      <ContactPreview />
    </PageTransition>
  );
}
