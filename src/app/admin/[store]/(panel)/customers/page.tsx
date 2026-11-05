import type { Metadata } from 'next';
import Customers from '@/components/admin/Customers';

export const metadata: Metadata = { title: 'Customers' };

const page = () => <Customers />;

export default page;
