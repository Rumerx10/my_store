import {
  Banknote,
  BatteryCharging,
  Building2,
  ClipboardList,
  Clock,
  Gift,
  Headphones,
  House,
  Leaf,
  MapPin,
  MessageCircle,
  Percent,
  Phone,
  ShieldCheck,
  Smartphone,
  Star,
  Sun,
  Truck,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { ApiHomeIcon } from '@/lib/api/types';

// The icons a home page item can show (the API's HOME_ICONS), with names for the picker.
export const HOME_ICONS: Record<ApiHomeIcon, { icon: LucideIcon; label: string }> = {
  banknote: { icon: Banknote, label: 'Cash' },
  battery: { icon: BatteryCharging, label: 'Battery' },
  building: { icon: Building2, label: 'Building' },
  clipboard: { icon: ClipboardList, label: 'Checklist' },
  clock: { icon: Clock, label: 'Clock' },
  gift: { icon: Gift, label: 'Gift' },
  headphones: { icon: Headphones, label: 'Support' },
  home: { icon: House, label: 'Home' },
  leaf: { icon: Leaf, label: 'Leaf' },
  'map-pin': { icon: MapPin, label: 'Location' },
  message: { icon: MessageCircle, label: 'Chat' },
  percent: { icon: Percent, label: 'Discount' },
  phone: { icon: Phone, label: 'Phone' },
  shield: { icon: ShieldCheck, label: 'Shield' },
  smartphone: { icon: Smartphone, label: 'Phone app' },
  star: { icon: Star, label: 'Star' },
  sun: { icon: Sun, label: 'Sun' },
  truck: { icon: Truck, label: 'Delivery' },
  wrench: { icon: Wrench, label: 'Tools' },
  zap: { icon: Zap, label: 'Power' },
};

export const HomeIcon = ({ name, className }: { name: ApiHomeIcon; className?: string }) => {
  const Icon = HOME_ICONS[name]?.icon ?? Star;
  return <Icon className={className} aria-hidden="true" />;
};
