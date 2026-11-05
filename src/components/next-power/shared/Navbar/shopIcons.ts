import {
  BatteryCharging,
  Building2,
  Combine,
  Gauge,
  LayoutGrid,
  PlugZap,
  SunMedium,
  Tag,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// One icon per shop link, keyed by the link's address. Shared by the desktop and mobile menus.
export const SHOP_ICONS: Record<string, LucideIcon> = {
  '/next-power/products': LayoutGrid,
  '/next-power/products?category=solar-panels': SunMedium,
  '/next-power/products?category=inverters': Zap,
  '/next-power/products?category=hybrid-inverters': Combine,
  '/next-power/products?category=batteries': BatteryCharging,
  '/next-power/products?category=commercial': Building2,
  '/next-power/products?category=ev-chargers': PlugZap,
  '/next-power/products?category=accessories': Gauge,
  '/next-power/deals': Tag,
};
