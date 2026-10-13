import type { Metadata } from 'next';
import AccountShell from '@/components/profilePages/AccountShell';

export const metadata: Metadata = {
  title: { default: 'My account', template: '%s | NextMart' },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
