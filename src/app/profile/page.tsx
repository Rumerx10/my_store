import type { Metadata } from 'next';
import Profile from '@/components/profilePages/profile/Profile';

export const metadata: Metadata = { title: 'Profile' };

const page = () => {
  return <Profile />;
};

export default page;
