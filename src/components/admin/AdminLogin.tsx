'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { errorMessage } from '@/lib/api/client';
import { signOut, useLogin } from '@/lib/query/account';
import { isStaffRole, useSession } from '@/lib/query/session';
import { useStore } from '@/lib/query/shop';
import { useAdminStore } from './adminStore';
import AdminSun from './AdminSun';
import StoreMark from './StoreMark';

// Sign-in for a store's seller centre, in the store's own name and colours. Only the owner
// and managers get in; a customer account is signed out again with a note.
const AdminLogin = () => {
  const { data: store } = useStore();
  const { href } = useAdminStore();
  const router = useRouter();
  const nextParam = useSearchParams().get('next');
  // Back to the page that sent them here, as long as it is this store's seller centre.
  const next = nextParam && nextParam.startsWith(href('/')) ? nextParam : href();
  const { ready, isStaff } = useSession();
  const login = useLogin();
  const [form, setForm] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (ready && isStaff) router.replace(next);
  }, [ready, isStaff, next, router]);

  if (!store) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!form.login.trim() || !form.password) {
      setError('Enter your phone number or username, and your password.');
      return;
    }
    login.mutate(
      { login: form.login.trim(), password: form.password },
      {
        onSuccess: (user) => {
          if (isStaffRole(user)) return;
          void signOut();
          setError(
            `This account can't manage ${store.name}. Sign in with the owner's or a manager's account.`,
          );
        },
        onError: (reason) => setError(errorMessage(reason)),
      },
    );
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4 py-12">
      <AdminSun />
      <ThemeToggle className="fixed right-4 top-4 inline-flex size-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/10" />
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <StoreMark store={store} size="lg" />
          <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-slate-100">
            {store.name}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
            Sign in to the seller centre
          </p>
        </div>

        <form
          onSubmit={submit}
          noValidate
          className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_16px_40px_-20px_rgb(15_23_42/0.35)] ring-1 ring-gray-200 dark:bg-slate-900 dark:ring-white/10"
        >
          <div className="space-y-1.5">
            <Label htmlFor="admin-login">Phone or username</Label>
            <Input
              id="admin-login"
              autoComplete="username"
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-red">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={login.isPending}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white disabled:opacity-70"
          >
            {login.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-slate-400">
          Not {store.name}?{' '}
          <Link href="/admin" className="font-medium text-brand hover:text-brand-hover">
            Choose another store
          </Link>
        </p>
      </div>
    </main>
  );
};

export default AdminLogin;
