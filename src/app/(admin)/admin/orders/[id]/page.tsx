import type { Metadata } from 'next';
import OrderDetails from '@/components/admin/Orders/OrderDetails';

export const metadata: Metadata = { title: 'Order details' };

const page = () => {
  return <OrderDetails />;
};

export default page;
