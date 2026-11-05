'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, LogOut, Menu } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';
import UserAvatar from '@/components/common/UserAvatar';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { ApiStore } from '@/lib/api/types';
import { signOut } from '@/lib/query/account';
import { useSession } from '@/lib/query/session';
import { useStore } from '@/lib/query/shop';
import { storefrontUrl } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { useAdminStore } from './adminStore';
import { ADMIN_NAV } from './nav';
import RequireStaff from './RequireStaff';
import AdminSun from './AdminSun';
import StoreMark from './StoreMark';

const ROLE_NAMES: Record<string, string> = { OWNER: 'Owner', MANAGER: 'Manager' };

// Spreadsheet-style pages use the whole width, without the sidebar.
const FULL_WIDTH_PAGES = ['/products/bulk-edit'];

const iconButton =
  'inline-flex size-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-slate-100';

const StoreTitle = ({ store }: { store: ApiStore }) => (
  <div className="flex min-w-0 items-center gap-3">
    <StoreMark store={store} />
    <div className="min-w-0">
      <p className="truncate font-semibold leading-tight text-gray-900 dark:text-slate-100">
        {store.name}
      </p>
      <p className="text-xs text-gray-500 dark:text-slate-400">Seller centre</p>
    </div>
  </div>
);

const NavList = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  const { href } = useAdminStore();
  return (
    <nav aria-label="Seller centre">
      <ul className="space-y-0.5">
        {ADMIN_NAV.map(({ path, label, icon: Icon, exact }) => {
          const to = href(path);
          const active = pathname === to || (!exact && pathname.startsWith(`${to}/`));
          return (
            <li key={path}>
              <Link
                href={to}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

// The store's shop, and who is signed in, with sign-out.
const AccountFooter = ({ store }: { store: ApiStore }) => {
  const { user } = useSession();
  return (
    <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-white/10">
      <a
        href={storefrontUrl(store)}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
      >
        <ExternalLink className="size-4" aria-hidden="true" />
        View store
      </a>
      {user && (
        <div className="flex items-center gap-3 px-1">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-slate-100">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              {ROLE_NAMES[user.role] ?? user.role}
            </p>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            className={iconButton}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

// The seller centre's frame for every store: the store's name, logo and colours, the menu,
// and who is signed in. A sidebar on wide screens; a top bar with a slide-out menu on phones.
const AdminShell = ({ children }: { children: React.ReactNode }) => {
  const { data: store } = useStore();
  const { href } = useAdminStore();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // StoreGate (AdminApp) renders nothing until the store has loaded.
  if (!store) return null;
  const fullWidth = FULL_WIDTH_PAGES.some((page) => pathname.startsWith(href(page)));

  return (
    <RequireStaff>
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium dark:focus:bg-slate-900"
      >
        Skip to content
      </a>
      <AdminSun />
      <div className={cn('min-h-dvh', !fullWidth && 'lg:grid lg:grid-cols-[264px_minmax(0,1fr)]')}>
        {!fullWidth && (
          <aside className="sticky top-0 hidden h-dvh flex-col gap-6 overflow-y-auto border-r border-gray-200 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/60 lg:flex">
            <div className="flex items-center justify-between gap-2 px-1 pt-1">
              <StoreTitle store={store} />
              <ThemeToggle className={iconButton} />
            </div>
            <NavList />
            <div className="mt-auto">
              <AccountFooter store={store} />
            </div>
          </aside>
        )}

        <div className="min-w-0">
          <header
            className={cn(
              'sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-gray-200 bg-white/85 px-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/80',
              !fullWidth && 'lg:hidden',
            )}
          >
            <Link href={href()} className="min-w-0 rounded-lg">
              <StoreTitle store={store} />
            </Link>
            <div className="flex shrink-0 items-center gap-1">
              <ThemeToggle className={iconButton} />
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger asChild>
                  <button type="button" className={iconButton} aria-label="Open the menu">
                    <Menu className="size-5" aria-hidden="true" />
                  </button>
                </SheetTrigger>
                {/* Slides in from the right, by the menu button. The ! durations keep the
                    slide when the OS asks for reduced motion, like the shop's drawer. */}
                <SheetContent
                  side="right"
                  className="flex w-72 flex-col gap-6 p-4 data-[state=closed]:[animation-duration:260ms]! data-[state=open]:[animation-duration:420ms]!"
                >
                  <SheetTitle className="sr-only">{store.name} seller centre</SheetTitle>
                  <div className="pt-1">
                    <StoreTitle store={store} />
                  </div>
                  <NavList onNavigate={() => setMenuOpen(false)} />
                  <div className="mt-auto">
                    <AccountFooter store={store} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>
          <main
            id="admin-main"
            className={cn(
              'mx-auto w-full px-4 py-6 md:px-6 md:py-8',
              fullWidth ? 'lg:px-8' : 'max-w-[1440px] lg:px-10',
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </RequireStaff>
  );
};

export default AdminShell;
