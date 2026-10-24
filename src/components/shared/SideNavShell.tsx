'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SideNavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  // Match the path exactly; otherwise nested routes also mark the item active.
  exact?: boolean;
}

// Page frame with section navigation: a sidebar on desktop, a scrolling tab row on mobile.
const SideNavShell = ({
  items,
  label,
  header,
  children,
}: {
  items: SideNavItem[];
  label: string;
  header?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  return (
    <div className="container py-6 md:py-10">
      {/* minmax(0, 1fr) on mobile too: an auto column would grow to fit the scrolling tab row and widen the page. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-10">
        <aside className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start lg:rounded-2xl lg:p-3 lg:glass">
          {header && <div className="hidden px-2 pb-5 lg:block">{header}</div>}
          <nav aria-label={label}>
            <ul className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
              {items.map(({ icon: Icon, label: itemLabel, href, exact }) => {
                const active = pathname === href || (!exact && pathname.startsWith(`${href}/`));
                return (
                  <li key={href} className="shrink-0">
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'bg-brand text-white'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/70 hover:text-gray-900 dark:hover:text-slate-100',
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {itemLabel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default SideNavShell;
