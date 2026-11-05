'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { QueryClientProvider } from '@tanstack/react-query';
import { Store } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import type { ApiStore } from '@/lib/api/types';
import { isNotFound } from '@/lib/query/catalog';
import { makeQueryClient } from '@/lib/query/client';
import { qk } from '@/lib/query/keys';
import { useResetOnUserChange } from '@/lib/query/resetOnUserChange';
import { useStore } from '@/lib/query/shop';
import { brandThemeCss } from '@/lib/storeTheme';
import { AdminStoreContext, useAdminStore } from './adminStore';
import { rememberStore } from './storeMemory';

const NoStore = ({ slug }: { slug: string }) => (
  <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
    <Store className="size-10 text-gray-400 dark:text-slate-500" aria-hidden="true" />
    <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-slate-100">
      No store at this address
    </h1>
    <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
      There is no store called &ldquo;{decodeURIComponent(slug)}&rdquo;. Check the address, or pick
      the store from your list.
    </p>
    <Link
      href="/admin"
      className="mt-5 rounded text-sm font-medium text-brand hover:text-brand-hover"
    >
      Choose a store
    </Link>
  </main>
);

// Loads the store, applies its colours and remembers it for the store list. Nothing below
// renders until the store is known, so every page can rely on it.
const StoreGate = ({ children }: { children: React.ReactNode }) => {
  const store = useStore();
  const { slug } = useAdminStore();

  useEffect(() => {
    if (store.data) rememberStore(store.data);
  }, [store.data]);

  if (store.data) {
    return (
      <>
        <style>{brandThemeCss(store.data.brandColor)}</style>
        {children}
      </>
    );
  }
  if (store.isPending) return <PageLoader label="Opening the seller centre" />;
  if (isNotFound(store.error)) return <NoStore slug={slug} />;
  return <ErrorState error={store.error} onRetry={() => store.refetch()} />;
};

// The seller centre for one store, /admin/<slug>/...: the store comes from the address, and
// with it the API requests, the sign-in, the name, the logo and the colours. Every store
// gets its own data cache (the layout keys this component by slug).
const AdminApp = ({
  slug,
  initialStore,
  children,
}: {
  slug: string;
  // The store's public profile, fetched on the server so the first paint has its colours.
  initialStore: ApiStore | null;
  children: React.ReactNode;
}) => {
  const [queryClient] = useState(() => {
    const client = makeQueryClient();
    if (initialStore) client.setQueryData(qk.store, initialStore);
    return client;
  });
  useResetOnUserChange(queryClient);
  const store = useMemo(() => ({ slug, href: (path = '') => `/admin/${slug}${path}` }), [slug]);

  return (
    <QueryClientProvider client={queryClient}>
      <AdminStoreContext.Provider value={store}>
        {/* react-hot-toast sets its colours inline, so the dark ones need !important. */}
        <Toaster
          position="top-center"
          toastOptions={{ className: 'dark:bg-slate-800! dark:text-slate-100!' }}
        />
        <StoreGate>{children}</StoreGate>
      </AdminStoreContext.Provider>
    </QueryClientProvider>
  );
};

export default AdminApp;
