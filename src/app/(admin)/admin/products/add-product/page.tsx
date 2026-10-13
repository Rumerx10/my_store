import type { Metadata } from 'next';
import ProductForm from '@/components/admin/Products/ProductForm';

export const metadata: Metadata = { title: 'Add product' };

const page = () => {
  return <ProductForm />;
};

export default page;
