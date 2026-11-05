import type { Metadata } from 'next';
import BulkEdit from '@/components/admin/Products/BulkEdit';

export const metadata: Metadata = { title: 'Bulk edit products' };

const page = () => {
  return <BulkEdit />;
};

export default page;
