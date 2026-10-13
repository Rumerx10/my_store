import type { Metadata } from 'next';
import Coupons from '@/components/client/Coupons';

export const metadata: Metadata = { title: 'Coupons' };

const page = () => {
  return <Coupons />;
};

export default page;
