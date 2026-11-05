import type { Metadata } from 'next';
import AccountShell from '@/components/next-power/profilePages/AccountShell';
import PageHeading from '@/components/common/PageHeading';
import Orders from '@/components/next-power/profilePages/orders/Orders';

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
