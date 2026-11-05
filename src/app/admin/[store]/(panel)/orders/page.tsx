import type { Metadata } from 'next';
import OrdersPage from '@/components/admin/Orders/Orders';

export const metadata: Metadata = { title: 'Orders' };

const page = () => {
  return <OrdersPage />;
};

export default page;
