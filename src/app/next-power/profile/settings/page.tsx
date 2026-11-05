import type { Metadata } from 'next';
import Settings from '@/components/next-power/profilePages/settings/Settings';

export const metadata: Metadata = { title: 'Settings' };

const page = () => {
  return <Settings />;
};

export default page;
