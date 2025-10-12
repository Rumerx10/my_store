import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NEW_PRODUCTS } from '@/docs/homeDocs';
import ProductCard from '../products/ProductCardGrid';

const TrendingProducts = () => {
  return (
    <section className="py-20 bg-[#48cae4]/20 ">
      <div className="container mx-auto px-4 flex flex-col">
        <div className="text-center mb-16">
          <Badge className="bg-blue-700 border-0 mb-4 shadow-lg backdrop-blur-sm">Trending</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Trending Products</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Be the first to discover our newest additions and stay ahead of the trends
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {NEW_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} isNew />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" className="text-black bg-[#48cae4]/20 hover:text-secondary">
              Explore New Arrivals
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
