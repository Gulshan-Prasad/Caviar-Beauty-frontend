import ProductCard from './ProductCard';
import { ProductSkeleton } from '@/components/ui/Skeleton';

export default function ProductGrid({ products, isLoading, listName = 'products' }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-20">
        <p className="text-caviar-400 text-sm tracking-wider uppercase">No products found</p>
        <p className="text-caviar-500 mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} listName={listName} index={index} />
      ))}
    </div>
  );
}
