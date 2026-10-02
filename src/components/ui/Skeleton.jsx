import { cn } from '@/utils/helpers';

export function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="aspect-[3/4] bg-caviar-100 dark:bg-caviar-800" />
      <div className="space-y-2">
        <div className="h-3 bg-caviar-100 dark:bg-caviar-800 rounded w-1/3" />
        <div className="h-4 bg-caviar-100 dark:bg-caviar-800 rounded w-2/3" />
        <div className="h-3 bg-caviar-100 dark:bg-caviar-800 rounded w-1/4" />
      </div>
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-caviar-100 dark:bg-caviar-800 rounded', className)} />;
}
