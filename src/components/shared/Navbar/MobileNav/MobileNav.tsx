'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  Headset,
  LayoutGrid,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { menuItems, NavLinks } from '@/docs/navLinks';
import { SITE } from '@/docs/site';
import { cn } from '@/lib/utils';
import BottomNav from './BottomNav';
import MobileDrawer from './MobileDrawer';
import Logo from '../../Logo';
import SearchForm from '../SearchForm';
import CountBadge from '../CountBadge';
import { SHOP_ICONS } from '../shopIcons';

const iconButtonClass =
  'relative flex size-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-white/80 active:bg-white';

const rowClass =
  'group flex items-center gap-3 rounded-xl px-2.5 py-2 text-[15px] font-medium text-gray-800 transition-colors hover:bg-white/80 active:bg-white';

const MobileNav = ({
  searchTerm,
  setSearchTerm,
  submitSearch,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  submitSearch: () => void;
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Close the search panel and the menu whenever the page changes.
  useEffect(() => {
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/60 backdrop-blur-xl backdrop-saturate-150">
        <div className="container flex h-14 items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className={`${iconButtonClass} -ml-2`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="size-6" />
            </button>
            <MobileDrawer
              open={isMenuOpen}
              onClose={closeMenu}
              title="Menu"
              description="Shop categories and your account"
            >
              <div className="px-5 pb-4 pt-4">
                <Logo />
              </div>

              {/* Account card */}
              <div className="sheet-item mx-4" style={{ '--i': 0 } as React.CSSProperties}>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-brand p-4 text-white"
                >
                  <Image
                    src="/user.webp"
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover ring-2 ring-white/40"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-white">Welcome back, Tanvir</p>
                    <p className="text-sm text-white/80">Orders, reviews and saved items</p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-white/80" aria-hidden="true" />
                </Link>
              </div>

              <nav aria-label="Shop" className="px-3 pt-5">
                <p className="px-2.5 pb-1.5 text-xs font-medium text-gray-500">Shop</p>
                <ul className="space-y-0.5">
                  {NavLinks.map((link, index) => {
                    const Icon = SHOP_ICONS[link.href] ?? LayoutGrid;
                    const deals = link.href === '/deals';
                    return (
                      <li
                        key={link.href}
                        className="sheet-item"
                        style={{ '--i': index + 1 } as React.CSSProperties}
                      >
                        <Link href={link.href} onClick={closeMenu} className={rowClass}>
                          <span
                            className={cn(
                              'flex size-9 shrink-0 items-center justify-center rounded-xl',
                              deals ? 'bg-sun-soft text-sun-ink' : 'bg-brand-soft text-brand',
                            )}
                          >
                            <Icon className="size-[18px]" aria-hidden="true" />
                          </span>
                          <span className="flex-1">{link.label}</span>
                          <ChevronRight
                            className="size-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <nav aria-label="Account" className="mx-3 mt-4 border-t border-gray-200/70 pt-4">
                <p className="px-2.5 pb-1.5 text-xs font-medium text-gray-500">My account</p>
                <ul className="space-y-0.5">
                  {menuItems.map(({ icon: Icon, label, href }, index) => (
                    <li
                      key={label}
                      className="sheet-item"
                      style={{ '--i': NavLinks.length + index + 1 } as React.CSSProperties}
                    >
                      <Link
                        href={href}
                        onClick={closeMenu}
                        aria-current={pathname === href ? 'page' : undefined}
                        className={cn(
                          rowClass,
                          'py-2.5 font-normal aria-[current=page]:bg-brand-soft aria-[current=page]:font-medium aria-[current=page]:text-brand-ink',
                        )}
                      >
                        <Icon className="size-[18px] text-gray-500" aria-hidden="true" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mx-3 mt-auto space-y-1 border-t border-gray-200/70 py-4">
                <a href={`tel:${SITE.phoneHref}`} className={cn(rowClass, 'font-normal')}>
                  <Headset className="size-[18px] text-gray-500" aria-hidden="true" />
                  <span className="flex-1">
                    Need help?{' '}
                    <span className="font-medium tabular-nums text-gray-900">{SITE.phone}</span>
                  </span>
                </a>
                <button
                  type="button"
                  className={cn(rowClass, 'w-full font-normal text-red hover:bg-red/5')}
                >
                  <LogOut className="size-[18px]" aria-hidden="true" />
                  Log out
                </button>
              </div>
            </MobileDrawer>
            <Logo />
          </div>

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsSearchOpen((open) => !open)}
              className={iconButtonClass}
              aria-label={isSearchOpen ? 'Close search' : 'Search products'}
              aria-expanded={isSearchOpen}
              aria-controls="mobile-search"
            >
              {isSearchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>
            <Link href="/chat" className={iconButtonClass} aria-label="Messages">
              <MessageCircle className="size-5" />
            </Link>
            <Link
              href="/cart"
              className={`${iconButtonClass} -mr-2`}
              aria-label={`Cart, ${cartItemCount} items`}
            >
              <ShoppingCart className="size-5" />
              <CountBadge count={cartItemCount} />
            </Link>
          </div>
        </div>

        {isSearchOpen && (
          <div id="mobile-search" className="border-t border-white/70 bg-white/80 py-3">
            {/* The padding lives on this wrapper so the icon and button sit inside the field. */}
            <div className="container">
              <SearchForm
                autoFocus
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onSubmit={() => {
                  submitSearch();
                  setIsSearchOpen(false);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[2px]"
          onClick={() => setIsSearchOpen(false)}
          aria-hidden="true"
        />
      )}

      <BottomNav hidden={isSearchOpen} />
    </div>
  );
};

export default MobileNav;
