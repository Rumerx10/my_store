import type { Metadata } from 'next';
import { Suspense } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';

export const metadata: Metadata = { title: 'Sign in' };

const page = () => (
  <Suspense>
    <AdminLogin />
  </Suspense>
);

export default page;
