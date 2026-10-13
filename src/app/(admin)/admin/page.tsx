import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = { title: 'Seller dashboard' };

const page = () => {
  return <AdminDashboard />;
};

export default page;
