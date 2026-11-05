'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { PageLoader } from '@/components/common/QueryState';
import { signOut } from '@/lib/query/account';
import { useSession } from '@/lib/query/session';
import { useStore } from '@/lib/query/shop';
import { useAdminStore } from './adminStore';

// Owners and managers of this store only. Anyone signed out goes to the store's seller-centre
// sign-in and comes back to the same page, query string included.
const RequireStaff = ({ children }: { children: React.ReactNode }) => {
  const { user, ready, isStaff } = useSession();
  const { data: store } = useStore();
  const { href } = useAdminStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready || user) return;
    const here = `${window.location.pathname}${window.location.search}`;
    router.replace(`${href('/login')}?next=${encodeURIComponent(here)}`);
  }, [ready, user, href, router]);

  if (!ready || !user) return <PageLoader label="Checking your sign-in" />;
  if (!isStaff) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
        <ShieldAlert className="size-10 text-gray-400 dark:text-slate-500" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-slate-100">
          This account can&apos;t manage {store?.name ?? 'this store'}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">
          You&apos;re signed in as {user.name}, a customer. Sign in with the owner&apos;s or a
          manager&apos;s account to use the seller centre.
        </p>
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-5 h-10 rounded-full bg-brand px-5 text-sm font-semibold text-white"
        >
          Sign in with another account
        </button>
      </main>
    );
  }
  return <>{children}</>;
};

export default RequireStaff;
