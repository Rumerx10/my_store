'use client';
import Link from 'next/link';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeading from '@/components/profilePages/PageHeading';
import { COUPONS } from '@/lib/checkout';

const Coupons = () => {
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch {
      toast.error(`Couldn't copy. The code is ${code}`);
    }
  };

  return (
    <div>
      <PageHeading title="Coupons" desc="Enter a code in your cart to apply the discount." />

      <ul className="grid gap-3 sm:grid-cols-2">
        {COUPONS.map((coupon) => (
          <li
            key={coupon.code}
            className="flex items-center justify-between gap-4 rounded-xl border border-dashed border-sky-300 bg-white/55 backdrop-blur-xl p-5"
          >
            <div>
              <p className="text-lg font-semibold text-gray-900">{coupon.discount}% off</p>
              <p className="text-sm text-gray-600">
                Code <span className="font-medium tabular-nums text-gray-900">{coupon.code}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyCode(coupon.code)}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Copy className="size-4" aria-hidden="true" />
              Copy<span className="sr-only"> code {coupon.code}</span>
            </button>
          </li>
        ))}
      </ul>

      <Link
        href="/cart"
        className="mt-5 inline-block rounded text-sm font-medium text-brand hover:text-brand-hover"
      >
        Go to cart
      </Link>
    </div>
  );
};

export default Coupons;
