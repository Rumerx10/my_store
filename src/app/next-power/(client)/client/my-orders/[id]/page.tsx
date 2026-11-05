import type { Metadata } from 'next';
import CustomerOrderDetails from '@/components/next-power/orders/CustomerOrderDetails';

export const metadata: Metadata = { title: 'Order details' };

const page = () => {
  return <CustomerOrderDetails backHref="/next-power/client/my-orders" />;
};

export default page;
