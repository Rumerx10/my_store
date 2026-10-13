'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Tag, Heart, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { cn } from '@/lib/utils';
import CountBadge from '../CountBadge';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/products', icon: LayoutGrid },
  { label: 'Deals', href: '/deals', icon: Tag },
  { label: 'Wishlist', href: '/wish-list', icon: Heart },
  { label: 'Account', href: '/profile', icon: User },
];

const isActivePath = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  if (href === '/profile') return pathname.startsWith('/profile') || pathname === '/orders';
  return pathname === href || pathname.startsWith(`${href}/`);
};

const BottomNav = () => {
  const pathname = usePathname();
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);

  return (
    <nav
      aria-label="Quick links"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/60 backdrop-blur-xl backdrop-saturate-150 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid h-16 grid-cols-5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActivePath(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                  active ? 'text-brand' : 'text-gray-500 hover:text-gray-900',
                )}
              >
                <span className="relative flex size-7 items-center justify-center">
                  <Icon className="size-[22px]" strokeWidth={active ? 2.25 : 1.75} />
                  {href === '/wish-list' && <CountBadge count={wishlistCount} />}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
