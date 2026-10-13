import type { Metadata } from 'next';
import Settings from '@/components/profilePages/settings/Settings';

export const metadata: Metadata = { title: 'Settings' };

const page = () => {
  return <Settings />;
};

export default page;
