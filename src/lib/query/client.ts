import { MutationCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ApiError, errorMessage } from '@/lib/api/client';

declare module '@tanstack/react-query' {
  interface Register {
    // `meta: { toast: false }` on a mutation: the component shows the error itself.
    mutationMeta: { toast?: boolean };
  }
}

// A request the server refused (4xx) won't succeed on a retry; a network error or 5xx might.
const shouldRetry = (failureCount: number, error: unknown) =>
  failureCount < 2 && !(error instanceof ApiError && error.status >= 400 && error.status < 500);

// One client per browser tab. Store data changes slowly, so it stays fresh for a minute; the
// cart, orders and dashboards refetch on their own schedule (see their hooks).
export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.toast !== false) toast.error(errorMessage(error));
      },
    }),
  });
