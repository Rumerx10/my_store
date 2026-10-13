import type { Metadata } from 'next';
import Categories from '@/components/categories/Categories';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse the store by category.',
};

const page = () => {
  return <Categories />;
};

export default page;
