import { MapPin, Package, Star, MessageSquare, ClipboardList, User } from 'lucide-react';


export const NavLinks = [
  { label: 'Phone', href: '/' },
  { label: 'Mens Cloting', href: '/' },
  { label: 'Womens Clothing', href: '/' },
  { label: 'Kids Cloting', href: '/' },
  { label: 'Electronics', href: '/' },
  { label: 'Cosmetics', href: '/' },
  { label: 'Perfumes', href: '/' },
];

export const menuItems = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: MapPin, label: 'Address Book', href: '/profile/address-book' },
  { icon: Package, label: 'My Orders', href: '/profile/orders' },
  { icon: Star, label: 'My Reviews', href: '/profile/reviews' },
  { icon: ClipboardList, label: 'To Review', href: '/profile/to-review' },
  { icon: MessageSquare, label: 'Feedback', href: '/profile/feedback' },
];
