import type { Metadata } from 'next';
import AccountShell from '@/components/profilePages/AccountShell';
import CustomerOrderDetails from '@/components/orders/CustomerOrderDetails';

export const metadata: Metadata = { title: 'Order details' };

const page = () => {
  return (
    <AccountShell>
      <CustomerOrderDetails backHref="/orders" />
    </AccountShell>
  );
};

export default page;
