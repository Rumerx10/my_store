import { FEATURED_PRODUCTS } from '@/docs/homeDocs';
import React from 'react';
import ProductCard from '../products/ProductCardGrid';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PopulerProducts = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-[#48cae4]/20 via-white to-[#90e0ef]/20">
      <div className="container mx-auto px-4 flex flex-col">
        <div className="text-center mb-16">
          <Badge className="bg-blue-700 backdrop-blur-sm border-0 mb-4 shadow-lg">
            Featured Products
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Popular Products</h2>
          <p className="text-xl max-w-2xl mx-auto">
            Discover our most popular products loved by thousands of customers
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
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
