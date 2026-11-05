'use client';
import Image from 'next/image';
import Link from 'next/link';
import { CircleAlert, Clock } from 'lucide-react';
import Panel from '@/components/common/Panel';
import type { Dashboard } from '@/lib/dashboard';
import { useCatalog } from '@/lib/query/catalog';
import { cn } from '@/lib/utils';
import { useAdminHref } from '@/components/admin/adminStore';

// Products at or below the store's low-stock level, soonest to sell out first: how fast they
// sold in the period says how many days the stock lasts.
const RestockSoon = ({ data, className }: { data: Dashboard; className?: string }) => {
  const href = useAdminHref();
  const { data: catalog = [] } = useCatalog();
  const rows = data.lowStock
    .map((item) => {
      const sold = data.topProducts.find((p) => p.id === item.id)?.units ?? 0;
      const perDay = sold / data.days;
      return {
        ...item,
        thumbnail: catalog.find((p) => p.id === item.id)?.thumbnail,
        perDay,
        daysLeft: perDay > 0 ? item.stock / perDay : undefined,
      };
    })
    .sort((a, b) => (a.daysLeft ?? a.stock * 1000) - (b.daysLeft ?? b.stock * 1000))
    .slice(0, 5);

  return (
    <Panel
      title="Restock soon"
      className={className}
      action={
        <Link
          href={href('/products/bulk-edit')}
          className="rounded text-sm font-medium text-brand hover:text-brand-hover"
        >
          Update stock
        </Link>
      }
    >
      {rows.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Every product is above your low-stock level.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-white/10">
          {rows.map((row) => {
            const soldOut = row.stock === 0;
            const urgent = soldOut || (row.daysLeft !== undefined && row.daysLeft < 7);
            const Icon = urgent ? CircleAlert : Clock;
            return (
              <li key={row.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-white dark:bg-slate-900 ring-1 ring-gray-200 dark:ring-white/10">
                  <Image
                    src={row.thumbnail || '/placeholder.svg'}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain p-1"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={href(`/products/edit-product/${row.id}`)}
                    className="block truncate text-sm font-medium text-gray-900 dark:text-slate-100 hover:text-brand"
                  >
                    {row.title}
                  </Link>
                  <p className="text-xs tabular-nums text-gray-500 dark:text-slate-400">
                    {row.stock} in stock
                    {row.perDay > 0 &&
                      ` · sells about ${row.perDay < 1 ? row.perDay.toFixed(1) : Math.round(row.perDay)}/day`}
                  </p>
                </div>
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold tabular-nums',
                    urgent ? 'bg-red/10 text-red' : 'bg-sun-soft text-sun-ink',
                  )}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {soldOut
                    ? 'Sold out'
                    : row.daysLeft !== undefined
                      ? `~${Math.max(1, Math.round(row.daysLeft))} days`
                      : 'Low stock'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
};

export default RestockSoon;
