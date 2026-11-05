import type { Metadata } from 'next';
import OrderSummary from '@/components/next-power/client/myOrders/OrderSummary';

export const metadata: Metadata = { title: 'Checkout' };

const page = () => <OrderSummary />;

export default page;
