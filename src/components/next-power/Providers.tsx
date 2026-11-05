'use client';
import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { makeQueryClient } from '@/lib/query/client';
import { useResetOnUserChange } from '@/lib/query/resetOnUserChange';
import { store } from '@/redux/store';
import { initialCheckout, restored } from '@/redux/features/checkout/checkoutSlice';

const CHECKOUT_KEY = 'np.checkout';

// Keeps the delivery option, coupon and installation choice through a reload of this tab.
const useSavedCheckout = () => {
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(CHECKOUT_KEY);
      if (saved) store.dispatch(restored({ ...initialCheckout, ...JSON.parse(saved) }));
    } catch {
      // Nothing saved, or storage is blocked: start fresh.
    }
    let last = store.getState().checkout;
    return store.subscribe(() => {
      const next = store.getState().checkout;
      if (next === last) return;
      last = next;
      try {
        window.sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(next));
      } catch {
        // The choices just won't survive a reload.
      }
    });
  }, []);
};

// API data (React Query) and client state (Redux) for the NextPower pages.
const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(makeQueryClient);
  useSavedCheckout();

  useResetOnUserChange(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  );
};

export default Providers;
