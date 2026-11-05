'use client';
import Link from 'next/link';
import { MessageCircle, Store } from 'lucide-react';
import { useStoreInfo } from '@/lib/query/storeInfo';

// Who sells the product and how to reach them before buying.
const SellerInfo = () => {
  const store = useStoreInfo();
  return (
    <section
      aria-label="Seller"
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl glass p-4"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-400">
          <Store className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Sold and shipped by</p>
          <p className="font-semibold text-gray-900 dark:text-slate-100">{store.name}</p>
        </div>
      </div>
      <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div>
          <dt className="text-xs text-gray-500 dark:text-slate-400">Call</dt>
          <dd className="font-semibold tabular-nums text-gray-900 dark:text-slate-100">
            <a href={`tel:${store.phoneHref}`} className="rounded hover:text-brand">
              {store.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 dark:text-slate-400">Support hours</dt>
          <dd className="font-semibold text-gray-900 dark:text-slate-100">{store.hours}</dd>
        </div>
      </dl>
      <Link
        href="/next-power/chat"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 dark:border-white/15 px-4 text-sm font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        Ask a question
      </Link>
    </section>
  );
};

export default SellerInfo;
