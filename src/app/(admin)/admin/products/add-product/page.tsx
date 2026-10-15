import { Suspense } from 'react';
import type { Metadata } from 'next';
import AddProduct from '@/components/admin/Products/AddProduct';

export const metadata: Metadata = { title: 'Add product' };

const page = () => {
  return (
    // AddProduct reads the URL's search params, which needs a Suspense boundary.
    <Suspense>
      <AddProduct />
    </Suspense>
  );
};

export default page;
