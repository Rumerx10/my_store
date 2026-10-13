import type { Metadata } from 'next';
import CustomerOrderDetails from '@/components/orders/CustomerOrderDetails';

export const metadata: Metadata = { title: 'Order details' };

const page = () => {
  return <CustomerOrderDetails backHref="/client/my-orders" />;
};

export default page;
