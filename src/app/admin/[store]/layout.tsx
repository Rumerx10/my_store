import type { Metadata } from 'next';
import AdminApp from '@/components/admin/AdminApp';
import PageBackground from '@/components/common/PageBackground';
import { NEXT_POWER_BACKGROUND } from '@/app/next-power/background';
import { absoluteUrl, STORE_HOST, storeHostFor } from '@/lib/api/client';
import { fetchStoreProfile } from '@/lib/api/serverStore';
import { SELLER_CENTRE_ICON_URL, storeIconUrl } from '@/lib/storeTheme';

type Params = { params: Promise<{ store: string }> };

// The browser tab carries the store's name and logo, so several stores can be open at once.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { store } = await params;
  const profile = await fetchStoreProfile(store);
  const name = profile ? `${profile.name} seller centre` : 'Seller centre';
  return {
    title: { template: `%s | ${name}`, default: name },
    robots: { index: false, follow: false },
    icons: {
      icon: !profile
        ? SELLER_CENTRE_ICON_URL
        : profile.logoUrl
          ? absoluteUrl(profile.logoUrl)
          : storeIconUrl(profile.name, profile.brandColor),
    },
  };
}

// One store's seller centre: /admin/<store>/... The store is the slug in the address (or a
// store's own domain), so the same pages serve every store on the platform.
export default async function StoreAdminLayout({
  params,
  children,
}: Params & { children: React.ReactNode }) {
  const { store } = await params;
  const profile = await fetchStoreProfile(store);
  return (
    <>
      {/* This app's own store (NextPower) has its own background in its seller centre too;
          every other store keeps the default. */}
      {storeHostFor(store) === STORE_HOST && <PageBackground {...NEXT_POWER_BACKGROUND} />}
      <AdminApp key={store} slug={store} initialStore={profile}>
        {children}
      </AdminApp>
    </>
  );
}
