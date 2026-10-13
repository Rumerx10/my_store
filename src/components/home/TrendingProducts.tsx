'use client';
import ProductSection from './ProductSection';

const TrendingProducts = () => {
  return (
    <ProductSection
      title="Trending this week"
      desc="Picking up attention across the store."
      href="/products?searchTerm=trending"
      filter={(p) => p.trending}
    />
  );
};

export default TrendingProducts;
