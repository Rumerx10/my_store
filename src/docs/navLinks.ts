import {
  MapPin,
  Package,
  Star,
  MessageSquare,
  ClipboardList,
  User,
  Settings,
} from 'lucide-react';
import { CATEGORIES } from './products';

// Display copy for the catalog categories (keys match product.category).
export const CATEGORY_INFO: Record<string, { label: string; blurb: string }> = {
  beauty: { label: 'Beauty', blurb: 'Makeup, nail care and everyday skincare' },
  fragrances: { label: 'Fragrances', blurb: 'Designer perfumes for him and her' },
  furniture: { label: 'Furniture', blurb: 'Beds, sofas and tables for every room' },
  groceries: { label: 'Groceries', blurb: 'Fresh produce, pantry staples and drinks' },
};

export const categoryLabel = (category: string) =>
  CATEGORY_INFO[category]?.label ?? category.charAt(0).toUpperCase() + category.slice(1);

export const NavLinks = [
  { label: 'All products', href: '/products' },
  ...CATEGORIES.map((category) => ({
    label: categoryLabel(category),
    href: `/products?category=${category}`,
  })),
  { label: 'Deals', href: '/deals' },
];

export const menuItems = [
  { icon: User, label: 'Profile', href: '/profile', exact: true },
  { icon: MapPin, label: 'Address book', href: '/profile/address-book' },
  { icon: Package, label: 'My orders', href: '/orders' },
  { icon: Star, label: 'My reviews', href: '/profile/reviews' },
  { icon: ClipboardList, label: 'To review', href: '/profile/to-review' },
  { icon: MessageSquare, label: 'Feedback', href: '/profile/feedback' },
  { icon: Settings, label: 'Settings', href: '/profile/settings' },
];
