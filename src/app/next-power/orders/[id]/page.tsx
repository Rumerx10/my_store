import type { Metadata } from 'next';
import AccountShell from '@/components/next-power/profilePages/AccountShell';
import CustomerOrderDetails from '@/components/next-power/orders/CustomerOrderDetails';

export const metadata: Metadata = { title: 'Order details' };

const page = () => {
  return (
    <AccountShell>
      <CustomerOrderDetails backHref="/next-power/orders" />
    </AccountShell>
  );
};

export default page;
