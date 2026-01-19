import ProductCardGrid from '../ProductCardGrid';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export function RelatedProducts() {
  const products = useSelector((state: RootState) => state.products);
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Related Products</h2>
        <Link href="/products">
          <Button
            variant="outline"
            className="w-44 text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
          >
            View All Products
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCardGrid key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
