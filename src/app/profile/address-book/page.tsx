import type { Metadata } from 'next';
import AddressBook from '@/components/profilePages/address-book/AddressBook';

export const metadata: Metadata = { title: 'Address book' };

const page = () => {
  return <AddressBook />;
};

export default page;
