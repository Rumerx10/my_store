import { MapPin, Package, Star, MessageSquare, ClipboardList, User, Settings } from 'lucide-react';
import { CATEGORIES } from './products';

// Display copy for the catalog categories (keys match product.category).
export const CATEGORY_INFO: Record<string, { label: string; blurb: string }> = {
  'solar-panels': { label: 'Solar panels', blurb: 'Lightweight, bifacial and balcony panels' },
  inverters: { label: 'Inverters', blurb: 'Grid-tied and micro inverters for every roof' },
  'hybrid-inverters': { label: 'Hybrid inverters', blurb: 'Solar plus battery, with backup power' },
  batteries: { label: 'Batteries', blurb: 'Home storage from 5 kWh to all-in-one' },
  commercial: { label: 'Business', blurb: 'Commercial inverters and storage systems' },
  'ev-chargers': { label: 'EV chargers', blurb: 'Charge your car on solar power' },
  accessories: { label: 'Accessories', blurb: 'Meters, controllers and monitoring' },
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
