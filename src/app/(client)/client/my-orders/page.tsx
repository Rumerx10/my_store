import type { Metadata } from 'next';
import MyOrders from '@/components/client/MyOrders';
import PageHeading from '@/components/profilePages/PageHeading';

export const metadata: Metadata = { title: 'My orders' };

const page = () => {
  return (
    <>
      <PageHeading title="My orders" desc="Track deliveries and review past purchases." />
      <MyOrders />
    </>
  );
};

export default page;
