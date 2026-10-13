import type { Metadata } from 'next';
import ClientDashboard from '@/components/client/ClientDashboard';

export const metadata: Metadata = { title: 'My dashboard' };

const page = () => {
  return <ClientDashboard />;
};

export default page;
