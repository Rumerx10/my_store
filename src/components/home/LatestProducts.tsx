'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCardGrid from '../products/ProductCardGrid';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import SectionHeader from '../SectionHeader';

const LatestProducts = () => {
  const products = useSelector((state: RootState) => state.products).filter((p) => p.latest);

  return (
    <section className="py-20 bg-gradient-to-br from-[#1c7293] via-[#1c7293]/80 to-[#1c7293]/60">
      <div className="container mx-auto px-4 flex flex-col">
        <SectionHeader
          badgeTxt="New Arrivals"
          title="Latest Products"
          desc="Be the first to discover our newest additions and stay ahead of the trends"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6 mb-12">
          {products.map((product) => (
            <ProductCardGrid key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/products?searchTerm=latest">
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
