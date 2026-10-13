import type { Metadata } from 'next';
import Feedback from '@/components/profilePages/feedback/Feedback';

export const metadata: Metadata = { title: 'Feedback' };

const page = () => {
  return <Feedback />;
};

export default page;
