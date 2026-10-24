'use client';
import { usePathname } from 'next/navigation';
import { SidebarItems } from '@/docs/dashboard';
import SideNavShell from './shared/SideNavShell';

const TITLES = {
  admin: { name: 'Seller centre', hint: 'Manage your store' },
  client: { name: 'My dashboard', hint: 'Orders, reviews and coupons' },
};

const FULL_WIDTH_PAGES = ['/admin/products/bulk-edit'];

// Frame for /admin/* and /client/*; the first path segment picks the navigation.
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const role = pathname.split('/').filter(Boolean)[0] === 'client' ? 'client' : 'admin';

  // Spreadsheet-style pages need the whole screen, so they skip the sidebar and container.
  if (FULL_WIDTH_PAGES.some((page) => pathname.startsWith(page))) {
    return <div className="px-4 py-6 md:px-6 md:py-8 lg:px-8">{children}</div>;
  }

  return (
    <SideNavShell
      items={SidebarItems(role)}
      label={TITLES[role].name}
      header={
        <div>
          <p className="font-semibold text-gray-900 dark:text-slate-100">{TITLES[role].name}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">{TITLES[role].hint}</p>
        </div>
      }
    >
      {children}
    </SideNavShell>
  );
};

export default DashboardLayout;
