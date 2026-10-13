'use client';
import { usePathname } from 'next/navigation';
import { SidebarItems } from '@/docs/dashboard';
import SideNavShell from './shared/SideNavShell';

const TITLES = {
  admin: { name: 'Seller centre', hint: 'Manage your store' },
  client: { name: 'My dashboard', hint: 'Orders, reviews and coupons' },
};

// Frame for /admin/* and /client/*; the first path segment picks the navigation.
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const role = pathname.split('/').filter(Boolean)[0] === 'client' ? 'client' : 'admin';

  return (
    <SideNavShell
      items={SidebarItems(role)}
      label={TITLES[role].name}
      header={
        <div>
          <p className="font-semibold text-gray-900">{TITLES[role].name}</p>
          <p className="text-xs text-gray-500">{TITLES[role].hint}</p>
        </div>
      }
    >
      {children}
    </SideNavShell>
  );
};

export default DashboardLayout;
