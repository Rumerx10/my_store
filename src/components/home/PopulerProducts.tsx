'use client';
import ProductSection from './ProductSection';

const PopulerProducts = () => {
  return (
    <ProductSection
      title="Popular right now"
      desc="The products other shoppers keep coming back for."
      href="/products?searchTerm=popular"
      filter={(p) => p.popular}
    />
  );
};

export default PopulerProducts;
