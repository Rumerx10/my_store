'use client';
import { useEffect } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { loadSession, onSessionChange } from '@/lib/api/client';

// Someone else signed in, or out: nothing cached for the last person may show, and lists like
// the catalogue differ for staff. Token refreshes keep the same user and change nothing. The
// reset waits a tick, so pages have re-rendered for the new session first: queries for
// signed-in users are switched off by then and don't refetch without a token.
// The store's public profile is the same for everyone, so it stays: the seller centre is
// built around it and would otherwise blank out (and lose a sign-in error) while it reloads.
export const useResetOnUserChange = (queryClient: QueryClient) => {
  useEffect(() => {
    let userId = loadSession()?.user.id ?? null;
    return onSessionChange((session) => {
      const next = session?.user.id ?? null;
      if (next === userId) return;
      userId = next;
      window.setTimeout(
        () => queryClient.resetQueries({ predicate: (query) => query.queryKey[0] !== 'store' }),
        0,
      );
    });
  }, [queryClient]);
};
