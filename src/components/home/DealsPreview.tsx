'use client';
import ProductSection from './ProductSection';

const DealsPreview = () => {
  return (
    <ProductSection
      title="Biggest discounts"
      desc="Marked down from the regular price, while stock lasts."
      href="/deals"
      linkLabel="All deals"
      filter={(p) => p.discountPercentage >= 10 && p.stock > 0}
      sort={(a, b) => b.discountPercentage - a.discountPercentage}
      limit={4}
    />
  );
};

export default DealsPreview;
