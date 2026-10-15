import type { Metadata } from 'next';
import { Suspense } from 'react';
import Products from '@/components/products/Products';
import ProductGridSkeleton from '@/components/products/ProductGridSkeleton';

export const metadata: Metadata = {
  title: 'Shop all products',
  description: 'Browse GoodWe solar panels, inverters, batteries and EV chargers. Filter by category, price and stock.',
};

const page = () => {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <Products />
    </Suspense>
  );
};

export default page;
