import type { Metadata } from 'next';
import Reviews from '@/components/admin/Reviews';

export const metadata: Metadata = { title: 'Reviews' };

const page = () => <Reviews />;

export default page;
