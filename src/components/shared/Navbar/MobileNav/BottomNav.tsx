'use client';
import { useEffect, useState } from 'react';
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

const isTextField = (element: EventTarget | null) =>
  element instanceof HTMLElement &&
  (element.matches(
    'input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea, select',
  ) ||
    element.isContentEditable);

// While a text field is focused the on-screen keyboard is up; the bar would ride on top of it.
const useTyping = () => {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const onFocusIn = (event: FocusEvent) => setTyping(isTextField(event.target));
    const onFocusOut = () => setTyping(false);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);
  return typing;
};

const BottomNav = ({ hidden = false }: { hidden?: boolean }) => {
  const pathname = usePathname();
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);
  const typing = useTyping();
  const away = hidden || typing;

  return (
    <nav
      aria-label="Quick links"
      aria-hidden={away || undefined}
      inert={away || undefined}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/60 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 transition-transform duration-300 ease-out-soft',
        away && 'translate-y-full',
      )}
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
                  {href === '/wish-list' && (
                    // Sits on the icon's corner instead of covering the heart.
                    <CountBadge count={wishlistCount} className="-right-2 -top-1.5" />
                  )}
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
