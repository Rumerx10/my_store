'use client';
import RequireAuth from '@/components/common/RequireAuth';
import { CLIENT_NAV } from '@/docs/dashboard';
import SideNavShell from './shared/SideNavShell';

// Frame for the customer's dashboard, /next-power/client/*. The seller centre has its own
// frame, components/admin/AdminShell.tsx.
const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <RequireAuth loginHref="/next-power/login">
    <SideNavShell
      items={CLIENT_NAV}
      label="My dashboard"
      header={
        <div>
          <p className="font-semibold text-gray-900 dark:text-slate-100">My dashboard</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">Orders, reviews and coupons</p>
        </div>
      }
    >
      {children}
    </SideNavShell>
  </RequireAuth>
);

export default DashboardLayout;
