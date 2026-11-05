import { MapPin, Package, Star, MessageSquare, ClipboardList, User, Settings } from 'lucide-react';

// The account menu (header dropdown, mobile drawer and account sidebar). Shop links are built
// from the store's categories (components/next-power/shared/Navbar/useNavData.ts).
export const menuItems = [
  { icon: User, label: 'Profile', href: '/next-power/profile', exact: true },
  { icon: MapPin, label: 'Address book', href: '/next-power/profile/address-book' },
  { icon: Package, label: 'My orders', href: '/next-power/orders' },
  { icon: Star, label: 'My reviews', href: '/next-power/profile/reviews' },
  { icon: ClipboardList, label: 'To review', href: '/next-power/profile/to-review' },
  { icon: MessageSquare, label: 'Feedback', href: '/next-power/profile/feedback' },
  { icon: Settings, label: 'Settings', href: '/next-power/profile/settings' },
];
