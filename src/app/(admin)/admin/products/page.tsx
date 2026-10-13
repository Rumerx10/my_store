import type { Metadata } from 'next';
import Products from '@/components/admin/Products/Products';

export const metadata: Metadata = { title: 'Products' };

const page = () => {
  return <Products />;
};

export default page;
