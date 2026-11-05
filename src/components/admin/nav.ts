import {
  CreditCard,
  FolderTree,
  Inbox,
  LayoutTemplate,
  LayoutDashboard,
  MessagesSquare,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Ticket,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  // Path inside the store's seller centre: '' is /admin/<store>, '/orders' is its orders.
  path: string;
  label: string;
  icon: LucideIcon;
  // Match the path exactly; otherwise nested pages also mark the item active.
  exact?: boolean;
}

// The seller centre's menu, the same for every store.
export const ADMIN_NAV: AdminNavItem[] = [
  { path: '', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/categories', label: 'Categories', icon: FolderTree },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/payments', label: 'Payments', icon: CreditCard },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/reviews', label: 'Reviews', icon: Star },
  { path: '/coupons', label: 'Coupons', icon: Ticket },
  { path: '/chats', label: 'Chats', icon: MessagesSquare },
  { path: '/messages', label: 'Messages', icon: Inbox },
  { path: '/home-page', label: 'Home page', icon: LayoutTemplate },
  { path: '/settings', label: 'Settings', icon: Settings },
];
