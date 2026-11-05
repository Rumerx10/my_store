'use client';
import Link from 'next/link';
import { Copy, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { couponHeadline, usePublicCoupons } from '@/lib/query/shop';
import { formatOrderDate, formatPrice } from '@/lib/utils';

// The store's public promo codes, usable right now.
const Coupons = () => {
  const { data: coupons = [], isPending, error, refetch } = usePublicCoupons();

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch {
      toast.error(`Couldn't copy. The code is ${code}`);
    }
  };

  if (isPending) return <PageLoader label="Loading coupons" />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeading title="Coupons" desc="Enter a code in your cart to apply the discount." />

      {coupons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 px-6 py-14 text-center">
          <Ticket
            className="mx-auto size-10 text-gray-300 dark:text-slate-600"
            aria-hidden="true"
          />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">No coupons right now</p>
          <p className="text-sm text-gray-600 dark:text-slate-400">New offers show up here.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {coupons.map((coupon) => {
            const conditions = [
              coupon.minOrderAmount &&
                `On orders over ${formatPrice(Number(coupon.minOrderAmount))}`,
              coupon.maxDiscountAmount &&
                `up to ${formatPrice(Number(coupon.maxDiscountAmount))} off`,
              coupon.endsAt && `until ${formatOrderDate(coupon.endsAt)}`,
            ].filter(Boolean);
            return (
              <li
                key={coupon.code}
                className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-sky-300 dark:border-sky-500/40 bg-white/55 dark:bg-slate-900/55 backdrop-blur-xl p-5"
              >
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {couponHeadline(coupon, formatPrice)}
                  </p>
                  {coupon.description && (
                    <p className="text-sm text-gray-700 dark:text-slate-300">
                      {coupon.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Code{' '}
                    <span className="font-medium tabular-nums text-gray-900 dark:text-slate-100">
                      {coupon.code}
                    </span>
                  </p>
                  {conditions.length > 0 && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      {conditions.join(', ')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(coupon.code)}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 px-3 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <Copy className="size-4" aria-hidden="true" />
                  Copy<span className="sr-only"> code {coupon.code}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href="/next-power/cart"
        className="mt-5 inline-block rounded text-sm font-medium text-brand hover:text-brand-hover"
      >
        Go to cart
      </Link>
    </div>
  );
};

export default Coupons;
