'use client';
import { createContext, useContext } from 'react';
import { useStore } from '@/lib/query/shop';
import { storefrontUrl } from '@/lib/stores';

export interface AdminStore {
  // The store's handle in the address: /admin/<slug>/...
  slug: string;
  // A seller-centre link for this store: href('/orders') -> /admin/<slug>/orders.
  href: (path?: string) => string;
}

export const AdminStoreContext = createContext<AdminStore | null>(null);

// The store the seller-centre page on screen manages.
export const useAdminStore = () => {
  const store = useContext(AdminStoreContext);
  if (!store) throw new Error('useAdminStore is for pages inside AdminApp');
  return store;
};

export const useAdminHref = () => useAdminStore().href;

// Links to a page of the store's own shop, e.g. a product: /next-power/products/<id> for this
// app's store, the store's domain for others.
export const useStorefrontUrl = () => {
  const { data: store } = useStore();
  return (path = '') => (store ? storefrontUrl(store, path) : '#');
};
