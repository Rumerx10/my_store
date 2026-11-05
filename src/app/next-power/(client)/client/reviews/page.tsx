import type { Metadata } from 'next';
import Reviews from '@/components/next-power/profilePages/reviews/Reviews';

export const metadata: Metadata = { title: 'My reviews' };

const page = () => {
  return <Reviews />;
};

export default page;
