'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingCart, MessageCircle, LogOut, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { menuItems, NavLinks } from '@/docs/navLinks';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import BottomNav from './BottomNav';
import Logo from '../../Logo';
import SearchForm from '../SearchForm';
import CountBadge from '../CountBadge';
import PromoBar from '../PromoBar';

const iconButtonClass =
  'relative flex size-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-white/80 active:bg-white';

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
  const pathname = usePathname();
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length);

  // Close the search panel whenever the route changes.
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/60 backdrop-blur-xl backdrop-saturate-150">
        <PromoBar />
        <div className="container flex h-14 items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Sheet>
              <SheetTrigger className={`${iconButtonClass} -ml-2`} aria-label="Open menu">
                <Menu className="size-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] max-w-sm gap-0 overflow-y-auto p-0">
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 pr-14">
                  <Image
                    src="/user.webp"
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <SheetTitle className="text-base font-semibold text-gray-900">
                      Welcome back
                    </SheetTitle>
                    <SheetDescription className="text-sm text-gray-500">
                      Browse categories or manage your account
                    </SheetDescription>
                  </div>
                </div>

                <nav aria-label="Shop" className="px-3 py-4">
                  <p className="px-2 pb-2 text-xs font-medium text-gray-500">Shop</p>
                  <ul>
                    {NavLinks.map((link) => (
                      <li key={link.href}>
                        <SheetClose asChild>
                          <Link
                            href={link.href}
                            className="flex rounded-md px-2 py-2.5 text-[15px] font-medium text-gray-800 transition-colors hover:bg-gray-50"
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>

                <nav aria-label="Account" className="border-t border-gray-100 px-3 py-4">
                  <p className="px-2 pb-2 text-xs font-medium text-gray-500">My account</p>
                  <ul>
                    {menuItems.map(({ icon: Icon, label, href }) => (
                      <li key={label}>
                        <SheetClose asChild>
                          <Link
                            href={href}
                            aria-current={pathname === href ? 'page' : undefined}
                            className="flex items-center gap-3 rounded-md px-2 py-2.5 text-[15px] text-gray-800 transition-colors hover:bg-gray-50 aria-[current=page]:bg-brand-soft aria-[current=page]:text-brand-ink"
                          >
                            <Icon className="size-[18px] text-gray-500" />
                            {label}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto border-t border-gray-100 px-3 py-4">
                  <button className="flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-[15px] text-red-600 transition-colors hover:bg-red-50">
                    <LogOut className="size-[18px]" />
                    Log out
                  </button>
                </div>
              </SheetContent>
            </Sheet>
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
          <div id="mobile-search" className="border-t border-white/70 py-3">
            <SearchForm
              className="container"
              autoFocus
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSubmit={() => {
                submitSearch();
                setIsSearchOpen(false);
              }}
            />
          </div>
        )}
      </div>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/20"
          onClick={() => setIsSearchOpen(false)}
          aria-hidden="true"
        />
      )}

      <BottomNav />
    </div>
  );
};

export default MobileNav;
