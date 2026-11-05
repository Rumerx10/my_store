import type { Metadata } from 'next';
import Categories from '@/components/admin/Categories';

export const metadata: Metadata = { title: 'Categories' };

const page = () => <Categories />;

export default page;
