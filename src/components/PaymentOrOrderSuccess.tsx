import Link from 'next/link';
import { Check } from 'lucide-react';

const PaymentOrOrderSuccess = ({
  title = 'Order placed',
  subTitle,
  orderId,
}: {
  title?: string;
  subTitle?: string;
  orderId?: string;
}) => {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl glass px-6 py-10 text-center md:px-10">
      <span className="flex size-14 items-center justify-center rounded-full bg-green/10 text-green">
        <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl text-gray-900 dark:text-slate-100" tabIndex={-1}>
        {title}
      </h1>
      {orderId && (
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
          Order number{' '}
          <span className="font-semibold tabular-nums text-gray-900 dark:text-slate-100">
            {orderId}
          </span>
        </p>
      )}
      {subTitle && <p className="mt-3 text-gray-600 dark:text-slate-400">{subTitle}</p>}
      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
        <Link
          href="/orders"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-brand font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Track my order
        </Link>
        <Link
          href="/products"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-gray-300 dark:border-white/15 font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentOrOrderSuccess;
