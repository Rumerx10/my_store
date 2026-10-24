'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  ChevronDown,
  Heart,
  LayoutGrid,
  LogOut,
  MessageCircle,
  ShoppingCart,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CATEGORY_INFO, menuItems } from '@/docs/navLinks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '../Logo';
import ThemeToggle from '../ThemeToggle';
import SearchForm from './SearchForm';
import CountBadge from './CountBadge';
import { SHOP_ICONS } from './shopIcons';
import { cn } from '@/lib/utils';

const iconLinkClass =
  'relative flex size-10 items-center justify-center rounded-full text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-900/5 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white';

const linkClass =
  'inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-sm font-medium transition-colors';

// Top-level links next to the Shop menu.
const LINKS = [
  { label: 'Deals', href: '/deals' },
  { label: 'Business', href: '/products?category=commercial' },
  { label: 'Support', href: '/contact' },
];

// Shop menu: every category with its icon and one-line description.
const ShopMenu = ({ active }: { active: boolean }) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger
      className={cn(
        linkClass,
        'data-[state=open]:bg-slate-900/5 dark:data-[state=open]:bg-white/10',
        active
          ? 'text-slate-950 dark:text-white'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white',
      )}
    >
      Shop
      <ChevronDown
        className="size-4 transition-transform duration-200 [[data-state=open]_&]:rotate-180"
        aria-hidden="true"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      sideOffset={14}
      className="w-[38rem] rounded-2xl border-white/80 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 p-2 shadow-[0_24px_60px_-24px_rgb(15_23_42_/_0.35)] backdrop-blur-xl"
    >
      <div className="grid grid-cols-2 gap-1">
        {Object.entries(CATEGORY_INFO).map(([category, info]) => {
          const href = `/products?category=${category}`;
          const Icon = SHOP_ICONS[href] ?? LayoutGrid;
          return (
            <DropdownMenuItem key={category} asChild className="cursor-pointer rounded-xl p-2.5">
              <Link href={href} className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {info.label}
                  </span>
                  <span className="block text-xs leading-snug text-slate-500 dark:text-slate-400">
                    {info.blurb}
                  </span>
                </span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </div>
      <DropdownMenuItem asChild className="mt-1 cursor-pointer rounded-xl p-0">
        <Link
          href="/products"
          className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          Browse all products
          <ArrowRight className="size-4 text-brand" aria-hidden="true" />
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Floating glass bar: logo, menu, search and account in one row.
const DesktopNav = ({
  searchTerm,
  setSearchTerm,
  submitSearch,
}: {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  submitSearch: () => void;
}) => {
  const pathname = usePathname();
  const cartItemCount = useSelector((state: RootState) => state.cart.items.length);
  const wishlistItemCount = useSelector((state: RootState) => state.wishlist.items.length);
  const isActive = (href: string) => href.split('?')[0] === pathname;

  // At the top of the page the bar floats; once the page scrolls it slides up to the top
  // edge and spreads to the full width. React skips the re-render while the value is unchanged.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // duration-300! keeps both moves even when the OS asks for reduced motion (see globals.css).
  return (
    <nav
      aria-label="Main"
      className={cn(
        'fixed inset-x-0 top-0 z-50 hidden transition-transform duration-300! ease-out @container lg:block',
        scrolled ? 'translate-y-0' : 'translate-y-3',
      )}
    >
      <div className="container">
        <div className="relative">
          {/* The glass surface is its own layer, so it can grow while the content stays put.
              50cqw is half the nav's width, so the scrolled bar reaches both window edges. */}
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-y-0 border backdrop-blur-xl backdrop-saturate-150 transition-all duration-300! ease-out',
              scrolled
                ? 'inset-x-[calc(50%-50cqw)] rounded-none border-transparent border-b-slate-200/80 dark:border-b-white/10 bg-white/85 dark:bg-slate-900/85 shadow-[0_10px_30px_-22px_rgb(15_23_42_/_0.45)]'
                : 'inset-x-0 rounded-2xl border-white/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-[0_10px_40px_-18px_rgb(15_23_42_/_0.35),inset_0_1px_0_#fff]',
            )}
          />
          <div className="relative flex h-16 items-center gap-4 pl-4 pr-2 xl:gap-6">
            <Logo className="shrink-0" />

            <ul className="flex items-center">
              <li>
                <ShopMenu active={pathname.startsWith('/products')} />
              </li>
              {LINKS.map((link) => {
                const active = link.href === '/deals' && isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        linkClass,
                        active
                          ? 'text-slate-950 dark:text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white',
                      )}
                    >
                      {link.label}
                      {link.href === '/deals' && (
                        <span className="ml-1 rounded-full bg-sun px-1.5 py-px text-[10px] font-bold text-slate-950 dark:text-white">
                          HOT
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <SearchForm
              compact
              className="ml-auto w-64 xl:w-80"
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSubmit={submitSearch}
            />

            <div className="flex items-center gap-0.5">
              <ThemeToggle className={iconLinkClass} />
              <Link href="/chat" className={iconLinkClass} aria-label="Messages">
                <MessageCircle className="size-5" />
              </Link>
              <Link
                href="/wish-list"
                className={iconLinkClass}
                aria-label={`Wishlist, ${wishlistItemCount} items`}
              >
                <Heart className="size-5" />
                <CountBadge count={wishlistItemCount} />
              </Link>
              <Link
                href="/cart"
                className={iconLinkClass}
                aria-label={`Cart, ${cartItemCount} items`}
              >
                <ShoppingCart className="size-5" />
                <CountBadge count={cartItemCount} />
              </Link>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  className="ml-1.5 flex items-center gap-1.5 rounded-full p-1 pr-2 ring-1 ring-slate-200 dark:ring-white/10 transition-colors hover:bg-slate-900/5 dark:hover:bg-white/10 data-[state=open]:bg-slate-900/5 dark:data-[state=open]:bg-white/10"
                  aria-label="Account menu"
                >
                  <Image
                    src="/user.webp"
                    alt=""
                    height={32}
                    width={32}
                    className="size-8 rounded-full object-cover"
                  />
                  <ChevronDown className="size-4 text-slate-500 dark:text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={14} className="w-56 rounded-xl p-1.5">
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                    My account
                  </DropdownMenuLabel>
                  {menuItems.map(({ icon: Icon, label, href }) => (
                    <DropdownMenuItem key={label} asChild className="cursor-pointer px-2 py-2">
                      <Link href={href}>
                        <Icon className="text-gray-500 dark:text-slate-400" />
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer px-2 py-2 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-700 dark:focus:text-red-300">
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
