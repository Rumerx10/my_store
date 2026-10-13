'use client';
import ProductSection from './ProductSection';

const LatestProducts = () => {
  return (
    <ProductSection
      title="New arrivals"
      desc="Recently added to the catalog."
      href="/products?searchTerm=latest"
      filter={(p) => p.latest}
    />
  );
};

export default LatestProducts;
