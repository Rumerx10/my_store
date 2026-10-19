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
  '/products': LayoutGrid,
  '/products?category=solar-panels': SunMedium,
  '/products?category=inverters': Zap,
  '/products?category=hybrid-inverters': Combine,
  '/products?category=batteries': BatteryCharging,
  '/products?category=commercial': Building2,
  '/products?category=ev-chargers': PlugZap,
  '/products?category=accessories': Gauge,
  '/deals': Tag,
};
