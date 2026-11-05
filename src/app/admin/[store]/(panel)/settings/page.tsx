import type { Metadata } from 'next';
import SellerSettings from '@/components/admin/SellerSettings';

export const metadata: Metadata = { title: 'Store settings' };

const page = () => {
  return <SellerSettings />;
};

export default page;
