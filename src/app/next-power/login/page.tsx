import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForm from '@/components/next-power/auth/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

const page = () => (
  <Suspense>
    <LoginForm />
  </Suspense>
);

export default page;
