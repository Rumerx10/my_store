'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/query/session';
import { PageLoader } from './QueryState';

// Pages for signed-in people only. Anyone else goes to `loginHref` (each store app has its
// own sign-in page) and comes back here afterwards, query string included.
const RequireAuth = ({ loginHref, children }: { loginHref: string; children: React.ReactNode }) => {
  const { user, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready || user) return;
    const here = `${window.location.pathname}${window.location.search}`;
    router.replace(`${loginHref}?next=${encodeURIComponent(here)}`);
  }, [ready, user, loginHref, router]);

  if (!ready || !user) return <PageLoader label="Checking your sign-in" />;
  return <>{children}</>;
};

export default RequireAuth;
