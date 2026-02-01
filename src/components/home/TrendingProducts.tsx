'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCardGrid from '../products/ProductCardGrid';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SectionHeader from '../SectionHeader';

const TrendingProducts = () => {
  const products = useSelector((state: RootState) => state.products).filter((p) => p.trending);

  return (
    <section className="py-20 bg-[#48cae4]/20 ">
      <div className="container mx-auto px-4 flex flex-col">
        <SectionHeader
          badgeTxt="Trending"
          title="Trending Products"
          desc="Be the first to discover our newest additions and stay ahead of the trends"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-5 mb-12">
          {products.map((product) => (
            <ProductCardGrid key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products?searchTerm=trending">
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
