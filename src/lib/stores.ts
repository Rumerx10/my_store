import { STORE_SLUG } from '@/lib/api/client';

// The seller centre serves every store at /admin/<store>; this app's own shop is NextPower,
// at /next-power. Other stores' shops are their own apps, on their own domains.

export const adminHome = (store: string = STORE_SLUG) => `/admin/${store}`;

// A page of a store's shop: here for this app's own store, on the store's domain otherwise.
// Store apps are planned to serve their pages from "/" (PLAN.md step 14), e.g. /orders/<id>.
export const storefrontUrl = (store: { slug: string; primaryHost: string }, path = '') =>
  store.slug === STORE_SLUG ? `/next-power${path}` : `https://${store.primaryHost}${path}`;
