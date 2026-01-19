'use client';
import ProductCardGrid from '../products/ProductCardGrid';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SectionHeader from '../SectionHeader';

const PopulerProducts = () => {
  const products = useSelector((state: RootState) => state.products).filter((p) => p.popular);

  return (
    <section className="py-20 bg-gradient-to-r from-[#48cae4]/20 via-white to-[#90e0ef]/20">
      <div className="container mx-auto px-4 flex flex-col">
        <SectionHeader
          badgeTxt="Featured Products"
          title="Popular Products"
          desc="Discover our most popular products loved by thousands of customers"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6 mb-12">
          {products.map((product) => (
            <ProductCardGrid key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products?searchTerm=popular">
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
