'use client';
import Image from 'next/image';
import { menuItems } from '@/docs/navLinks';
import SideNavShell from '../shared/SideNavShell';

// Shared frame for the account pages: navigation plus the page content.
const AccountShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <SideNavShell
      items={menuItems}
      label="Account"
      header={
        <div className="flex items-center gap-3">
          <Image
            src="/user.webp"
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-slate-100">Tanvir Hasan</p>
            <p className="text-xs text-gray-500 dark:text-slate-400">Member since 2023</p>
          </div>
        </div>
      }
    >
      {children}
    </SideNavShell>
  );
};

export default AccountShell;
