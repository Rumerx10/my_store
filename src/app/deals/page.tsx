import type { Metadata } from 'next';
import Deals from '@/components/deals/Deals';

export const metadata: Metadata = {
  title: 'Deals',
  description: 'Products marked down by 10% or more, while stock lasts.',
};

const page = () => {
  return <Deals />;
};

export default page;
