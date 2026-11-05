'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { errorMessage, type SessionUser } from '@/lib/api/client';
import { useLogin, useRegister } from '@/lib/query/account';
import { isStaffRole, useSession } from '@/lib/query/session';
import { adminHome } from '@/lib/stores';

type Mode = 'login' | 'register';

// Sign in with a phone number or username, or make an account with a phone number.
// Only pages of this store, so a link can't send someone elsewhere after signing in.
const safeNext = (next: string | null) =>
  next && next.startsWith('/next-power') && !next.startsWith('//') ? next : null;

const homeFor = (user: Pick<SessionUser, 'role'>) =>
  isStaffRole(user) ? adminHome() : '/next-power';

const LoginForm = () => {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const { user: signedIn } = useSession();
  const login = useLogin();
  const register = useRegister();
  const [mode, setMode] = useState<Mode>('login');
  const busy = login.isPending || register.isPending;

  // Already signed in (or just signed in, in another tab): nothing to do here.
  useEffect(() => {
    if (signedIn && !busy) router.replace(next ?? homeFor(signedIn));
  }, [signedIn, busy, next, router]);

  const [form, setForm] = useState({ login: '', name: '', phone: '', password: '' });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const user =
        mode === 'login'
          ? await login.mutateAsync({ login: form.login.trim(), password: form.password })
          : await register.mutateAsync({
              name: form.name.trim(),
              phone: form.phone.trim(),
              password: form.password,
            });
      toast.success(`Welcome, ${user.name || user.username || 'back'}`);
      router.replace(next ?? homeFor(user));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="container flex justify-center py-10 md:py-16">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl glass p-6">
        <h1 className="text-2xl text-gray-900 dark:text-slate-100">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>
        {mode === 'login' ? (
          <div className="space-y-1.5">
            <Label htmlFor="login">Phone or username</Label>
            <Input
              id="login"
              autoComplete="username"
              required
              value={form.login}
              onChange={set('login')}
            />
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={set('name')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
          </>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={mode === 'register' ? 8 : undefined}
            required
            value={form.password}
            onChange={set('password')}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="w-full text-center text-sm font-medium text-brand hover:text-brand-hover"
        >
          {mode === 'login' ? 'New here? Create an account' : 'Have an account? Sign in'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
