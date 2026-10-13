'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Heart, ShoppingCart, ChevronDown, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { menuItems, NavLinks } from '@/docs/navLinks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '../Logo';
import SearchForm from './SearchForm';
import CountBadge from './CountBadge';
import PromoBar from './PromoBar';
import { cn } from '@/lib/utils';

const iconLinkClass =
  'relative flex size-10 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-white/80 hover:text-brand';

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

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 top-0 z-50 hidden border-b border-white/70 bg-white/60 backdrop-blur-xl backdrop-saturate-150 shadow-card lg:block"
    >
      <PromoBar />
      <div className="container flex h-16 items-center gap-8">
        <Logo className="shrink-0" />

        <SearchForm
          className="max-w-xl flex-1"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSubmit={submitSearch}
        />

        <div className="ml-auto flex items-center gap-1">
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
              className="ml-2 flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-2 transition-colors hover:bg-white/80 data-[state=open]:bg-white/80"
              aria-label="Account menu"
            >
              <Image
                src="/user.webp"
                alt=""
                height={32}
                width={32}
                className="size-8 rounded-full object-cover"
              />
              <ChevronDown className="size-4 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-lg p-1.5">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-gray-500">
                My account
              </DropdownMenuLabel>
              {menuItems.map(({ icon: Icon, label, href }) => (
                <DropdownMenuItem key={label} asChild className="cursor-pointer px-2 py-2">
                  <Link href={href}>
                    <Icon className="text-gray-500" />
                    {label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer px-2 py-2 text-red-600 focus:bg-red-50 focus:text-red-700">
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-t border-white/70">
        <ul className="container flex h-11 items-center gap-1 text-sm">
          {NavLinks.map((link) => {
            const isActive =
              (link.href === '/products' && pathname === '/products') ||
              (link.href === '/deals' && pathname === '/deals');
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 font-medium text-gray-700 transition-colors hover:bg-white/80 hover:text-brand',
                    link.href === '/deals' && !isActive && 'text-brand',
                    isActive && 'bg-brand text-white hover:bg-brand hover:text-white',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default DesktopNav;
