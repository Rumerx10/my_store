import { Skeleton } from '@/components/ui/skeleton';

// Placeholder that matches the product grid while the page loads.
const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div className="container py-6 md:py-10" aria-busy="true" aria-label="Loading products">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-24" />
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl glass">
            <Skeleton className="aspect-square rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-3 h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGridSkeleton;
