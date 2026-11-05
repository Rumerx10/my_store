import type { Metadata } from 'next';
import Categories from '@/components/next-power/categories/Categories';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse the store by category.',
};

const page = () => {
  return <Categories />;
};

export default page;
