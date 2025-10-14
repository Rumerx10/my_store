import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NEW_PRODUCTS } from '@/docs/homeDocs';
import ProductCard from '../products/ProductCardGrid';

const LatestProducts = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1c7293] via-[#1c7293]/80 to-[#1c7293]/60">
      <div className="container mx-auto px-4 flex flex-col">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <Badge className="bg-gradient-to-r from-white/20 to-white/30 text-white border-0 mb-3 md:mb-4 shadow-lg backdrop-blur-sm text-sm md:text-base">
            New Arrivals
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Latest Products
          </h2>
          <p className="sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Be the first to discover our newest additions and stay ahead of the trends
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6 mb-12">
          {NEW_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} isNew />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button
              size="lg"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white font-semibold px-8 py-4 text-lg shadow-xl"
            >
              Explore New Arrivals
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
