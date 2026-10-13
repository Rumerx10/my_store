import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Settings,
  Star,
  Ticket,
} from 'lucide-react';
import type { SideNavItem } from '@/components/shared/SideNavShell';

export type DashboardRole = 'admin' | 'client';

const ITEMS: Record<DashboardRole, SideNavItem[]> = {
  admin: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ],
  client: [
    { href: '/client', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/client/my-orders', label: 'My orders', icon: Package },
    { href: '/client/reviews', label: 'Reviews', icon: Star },
    { href: '/client/coupons', label: 'Coupons', icon: Ticket },
  ],
};

export const SidebarItems = (role: DashboardRole) => ITEMS[role];
