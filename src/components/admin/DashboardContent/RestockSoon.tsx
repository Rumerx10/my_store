'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { CircleAlert, Clock } from 'lucide-react';
import Panel from '@/components/dashboard/Panel';
import { dailyDemand } from '@/docs/adminDashboard';
import { cn } from '@/lib/utils';
import { RootState } from '@/redux/store';

// Products that will sell out first at their current pace, so they can be reordered in time.
const RestockSoon = ({ className }: { className?: string }) => {
  const products = useSelector((state: RootState) => state.products);
  const rows = products
    .filter((product) => product.status !== 'draft')
    .map((product) => {
      const perDay = dailyDemand(product.id);
      return { product, perDay, daysLeft: product.stock / perDay };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  return (
    <Panel
      title="Restock soon"
      className={className}
      action={
        <Link
          href="/admin/products/bulk-edit"
          className="rounded text-sm font-medium text-brand hover:text-brand-hover"
        >
          Update stock
        </Link>
      }
    >
      <ul className="divide-y divide-gray-100 dark:divide-white/10">
        {rows.map(({ product, perDay, daysLeft }) => {
          const urgent = daysLeft < 7;
          const soon = !urgent && daysLeft < 21;
          const Icon = urgent ? CircleAlert : Clock;
          return (
            <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-white dark:bg-slate-900 ring-1 ring-gray-200 dark:ring-white/10">
                <Image
                  src={product.thumbnail || '/placeholder.svg'}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </span>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/products/edit-product/${product.id}`}
                  className="block truncate text-sm font-medium text-gray-900 dark:text-slate-100 hover:text-brand"
                >
                  {product.title}
                </Link>
                <p className="text-xs tabular-nums text-gray-500 dark:text-slate-400">
                  {product.stock} in stock · sells about {perDay}/day
                </p>
              </div>
              <span
                className={cn(
                  'inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold tabular-nums',
                  urgent
                    ? 'bg-red/10 text-red'
                    : soon
                      ? 'bg-sun-soft text-sun-ink'
                      : 'bg-green/10 text-hGreen',
                )}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {product.stock === 0 ? 'Sold out' : `~${Math.max(1, Math.round(daysLeft))} days`}
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
};

export default RestockSoon;
