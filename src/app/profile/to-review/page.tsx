import type { Metadata } from 'next';
import ToReview from '@/components/profilePages/to-review/ToReview';

export const metadata: Metadata = { title: 'To review' };

const page = () => {
  return <ToReview />;
};

export default page;
