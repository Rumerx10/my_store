import { FEATURED_PRODUCTS } from '@/docs/homeDocs';
import ProductCardGrid from '../products/ProductCardGrid';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PopulerProducts = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#48cae4]/20 via-white to-[#90e0ef]/20">
      <div className="container mx-auto px-4 flex flex-col">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <Badge className="bg-blue-700 backdrop-blur-sm border-0 mb-3 md:mb-4 shadow-lg text-sm md:text-base">
            Featured Products
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Popular Products
          </h2>
          <p className="sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover our most popular products loved by thousands of customers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6 mb-12">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCardGrid key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button size="lg" className="text-black bg-[#48cae4]/20 hover:text-secondary ">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopulerProducts;
