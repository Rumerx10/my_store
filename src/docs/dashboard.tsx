import { LayoutDashboard, Package, Star, Ticket } from 'lucide-react';
import type { SideNavItem } from '@/components/next-power/shared/SideNavShell';

// The customer's dashboard menu, /next-power/client/*. The seller centre's menu is
// components/admin/nav.ts.
export const CLIENT_NAV: SideNavItem[] = [
  { href: '/next-power/client', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/next-power/client/my-orders', label: 'My orders', icon: Package },
  { href: '/next-power/client/reviews', label: 'Reviews', icon: Star },
  { href: '/next-power/client/coupons', label: 'Coupons', icon: Ticket },
];
