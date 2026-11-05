import type { Metadata } from 'next';
import Coupons from '@/components/admin/Coupons';

export const metadata: Metadata = { title: 'Coupons' };

const page = () => <Coupons />;

export default page;
