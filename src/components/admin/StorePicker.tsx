'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PLATFORM_DOMAIN, STORE_SLUG } from '@/lib/api/client';
import StoreMark from './StoreMark';
import { forgetStore, rememberedStores, type RememberedStore } from './storeMemory';

// What someone types for a store: "next-power", "next-power.myplatform.com", or a store's own
// domain, with or without https:// and a path. Returns the handle for /admin/<handle>.
const toStoreHandle = (input: string) => {
  const host = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .split(/[/?#]/)[0];
  if (!host) return null;
  if (host.endsWith(`.${PLATFORM_DOMAIN}`)) return host.slice(0, -PLATFORM_DOMAIN.length - 1);
  if (host.includes('.')) return /^[a-z0-9.-]+$/.test(host) ? host : null;
  return /^[a-z0-9-]+$/.test(host) ? host : null;
};

// /admin: one seller centre for every store. Lists the stores this browser has managed, and
// opens any other by its address.
const StorePicker = () => {
  const router = useRouter();
  const [stores, setStores] = useState<RememberedStore[]>([]);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = rememberedStores();
    // This app's own store is always on the list, even before its first visit.
    setStores(
      saved.some((store) => store.slug === STORE_SLUG)
        ? saved
        : [...saved, { slug: STORE_SLUG, name: STORE_SLUG, logoUrl: null, brandColor: null }],
    );
  }, []);

  const open = (event: React.FormEvent) => {
    event.preventDefault();
    const handle = toStoreHandle(address);
    if (!handle) {
      setError('Enter the store’s address, such as next-power or shop.example.com.');
      return;
    }
    router.push(`/admin/${handle}`);
  };

  const forget = (slug: string) => {
    forgetStore(slug);
    setStores((current) => current.filter((store) => store.slug !== slug));
  };

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <ThemeToggle className="fixed right-4 top-4 inline-flex size-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/10" />
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-slate-100">Seller centre</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">Choose the store to manage.</p>

      {stores.length > 0 && (
        <ul className="mt-6 divide-y divide-gray-200 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 dark:divide-white/10 dark:bg-slate-900 dark:ring-white/10">
          {stores.map((store) => (
            <li key={store.slug} className="flex items-center">
              <Link
                href={`/admin/${store.slug}`}
                className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <StoreMark store={store} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-gray-900 dark:text-slate-100">
                    {store.name}
                  </span>
                  <span className="block truncate text-xs text-gray-500 dark:text-slate-400">
                    /admin/{store.slug}
                  </span>
                </span>
                <ArrowRight className="size-4 text-gray-400" aria-hidden="true" />
              </Link>
              {store.slug !== STORE_SLUG && (
                <button
                  type="button"
                  onClick={() => forget(store.slug)}
                  className="mr-2 inline-flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-slate-200"
                  aria-label={`Remove ${store.name} from this list`}
                  title="Remove from this list"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={open} noValidate className="mt-8 space-y-2">
        <Label htmlFor="store-address">Another store</Label>
        <div className="flex gap-2">
          <Input
            id="store-address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setError('');
            }}
            placeholder={`store-name or store-name.${PLATFORM_DOMAIN}`}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'store-address-error' : undefined}
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-lg bg-brand px-4 text-sm font-semibold text-white"
          >
            Open
          </button>
        </div>
        {error && (
          <p id="store-address-error" className="text-sm text-red">
            {error}
          </p>
        )}
      </form>
    </main>
  );
};

export default StorePicker;
