import type { Metadata } from 'next';
import Reviews from '@/components/profilePages/reviews/Reviews';

export const metadata: Metadata = { title: 'My reviews' };

const page = () => {
  return <Reviews />;
};

export default page;
