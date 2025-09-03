import Products from '@/components/products/Products';
import { Suspense } from 'react';

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Products />
    </Suspense>
  );
};

export default page;
