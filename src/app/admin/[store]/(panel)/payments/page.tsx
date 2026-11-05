import type { Metadata } from 'next';
import Payments from '@/components/admin/Payments';

export const metadata: Metadata = { title: 'Payments' };

const page = () => {
  return <Payments />;
};

export default page;
