import type { Metadata } from 'next';
import HomePageEditor from '@/components/admin/homePage/HomePageEditor';

export const metadata: Metadata = { title: 'Home page' };

const page = () => <HomePageEditor />;

export default page;
