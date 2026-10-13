import type { Metadata } from 'next';
import AccountShell from '@/components/profilePages/AccountShell';
import PageHeading from '@/components/profilePages/PageHeading';
import Orders from '@/components/profilePages/orders/Orders';

export const metadata: Metadata = { title: 'My orders' };

const page = () => {
  return (
    <AccountShell>
      <PageHeading title="My orders" desc="Track deliveries and review past purchases." />
      <Orders />
    </AccountShell>
  );
};

export default page;
