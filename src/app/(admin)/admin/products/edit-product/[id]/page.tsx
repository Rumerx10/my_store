import type { Metadata } from 'next';
import EditProduct from '@/components/admin/Products/EditProduct';

export const metadata: Metadata = { title: 'Edit product' };

const page = () => {
  return <EditProduct />;
};

export default page;
