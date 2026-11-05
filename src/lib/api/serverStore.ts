import { API_URL, STORE_HOST, storeHostFor } from './client';
import type { ApiHomePage, ApiStore } from './types';

// A store's public profile, fetched while the server renders a seller-centre page, so the page
// arrives with the store's name, logo and colours. Null when the API can't say; the browser
// then asks again and shows what went wrong.
export const fetchStoreProfile = async (store: string): Promise<ApiStore | null> => {
  try {
    const res = await fetch(`${API_URL}/store`, {
      headers: { Accept: 'application/json', 'X-Seller-Host': storeHostFor(store) },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok ? ((await res.json()) as ApiStore) : null;
  } catch {
    return null;
  }
};

// This shop's home page, fetched while the server renders it, so the hero arrives with the
// page. Null when the API can't say; the browser then asks again.
export const fetchHomePage = async (): Promise<ApiHomePage | null> => {
  try {
    const res = await fetch(`${API_URL}/store/home`, {
      headers: { Accept: 'application/json', 'X-Seller-Host': STORE_HOST },
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    return res.ok ? ((await res.json()) as ApiHomePage) : null;
  } catch {
    return null;
  }
};
