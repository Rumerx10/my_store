'use client';
import { useEffect, useState } from 'react';
import { Ban, Loader2, Search, ShieldCheck, UserPlus, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import UserAvatar from '@/components/common/UserAvatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApiUser } from '@/lib/api/types';
import { useStoreUsers, useUserActions } from '@/lib/query/admin';
import { useSession } from '@/lib/query/session';
import { cn, formatOrderDate } from '@/lib/utils';

const useDebounced = (value: string, ms = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(timer);
  }, [value, ms]);
  return debounced;
};

const ROLE_LABELS = { OWNER: 'Owner', MANAGER: 'Manager', CUSTOMER: 'Customer' } as const;

const UserRow = ({ user, isOwner }: { user: ApiUser; isOwner: boolean }) => {
  const { user: me } = useSession();
  const { update } = useUserActions();
  const self = me?.id === user.id;
  // Managers may block customers; only the owner changes roles or blocks managers.
  const canBlock = !self && user.role !== 'OWNER' && (isOwner || user.role === 'CUSTOMER');
  const canChangeRole = isOwner && !self && user.role !== 'OWNER';

  const setActive = (isActive: boolean) => {
    if (
      !isActive &&
      !window.confirm(`Block ${user.name}? They are signed out and can't sign in until unblocked.`)
    ) {
      return;
    }
    update.mutate(
      { id: user.id, isActive },
      { onSuccess: () => toast.success(`${user.name} ${isActive ? 'unblocked' : 'blocked'}`) },
    );
  };

  const setRole = (role: 'MANAGER' | 'CUSTOMER') => {
    const what = role === 'MANAGER' ? 'a manager of the store' : 'a customer again';
    if (!window.confirm(`Make ${user.name} ${what}?`)) return;
    update.mutate(
      { id: user.id, role },
      { onSuccess: () => toast.success(`${user.name} is now ${ROLE_LABELS[role].toLowerCase()}`) },
    );
  };

  return (
    <li className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
      <UserAvatar name={user.name} avatarUrl={user.avatarUrl} className="size-10" />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-medium text-gray-900 dark:text-slate-100">
          {user.name}
          {user.role !== 'CUSTOMER' && (
            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-ink">
              {ROLE_LABELS[user.role]}
            </span>
          )}
          {!user.isActive && (
            <span className="rounded-full bg-red/10 px-2 py-0.5 text-xs font-medium text-red">
              Blocked
            </span>
          )}
          {self && <span className="text-xs font-normal text-gray-500">(you)</span>}
        </p>
        <p className="text-sm tabular-nums text-gray-600 dark:text-slate-400">
          {user.phone}
          {user.email && ` · ${user.email}`}
          {user.username && ` · @${user.username}`}
        </p>
        <p className="text-xs text-gray-500 dark:text-slate-400">
          Joined {formatOrderDate(user.createdAt)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {canChangeRole && (
          <button
            type="button"
            disabled={update.isPending}
            onClick={() => setRole(user.role === 'MANAGER' ? 'CUSTOMER' : 'MANAGER')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5"
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            {user.role === 'MANAGER' ? 'Remove manager' : 'Make manager'}
          </button>
        )}
        {canBlock && (
          <button
            type="button"
            disabled={update.isPending}
            onClick={() => setActive(!user.isActive)}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium disabled:opacity-60',
              user.isActive
                ? 'border-red/30 text-red hover:bg-red/5'
                : 'border-gray-300 hover:bg-gray-50 dark:border-white/15 dark:hover:bg-white/5',
            )}
          >
            <Ban className="size-4" aria-hidden="true" />
            {user.isActive ? 'Block' : 'Unblock'}
          </button>
        )}
      </div>
    </li>
  );
};

const UserList = ({
  role,
  search,
  isOwner,
  empty,
}: {
  role: 'CUSTOMER' | 'MANAGER' | 'OWNER';
  search?: string;
  isOwner: boolean;
  empty: string;
}) => {
  const query = useStoreUsers({ role, search });
  if (query.isPending) return <PageLoader className="min-h-32" />;
  if (query.error) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  if (query.users.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-600 dark:text-slate-400">{empty}</p>;
  }
  return (
    <>
      <ul className="divide-y divide-gray-100 dark:divide-white/10">
        {query.users.map((user) => (
          <UserRow key={user.id} user={user} isOwner={isOwner} />
        ))}
      </ul>
      {query.hasNextPage && (
        <button
          type="button"
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
          className="mt-4 h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium dark:border-white/15"
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      )}
    </>
  );
};

const AddManager = () => {
  const { addManager } = useUserActions();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', password: '', email: '' });
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover"
      >
        <UserPlus className="size-4" aria-hidden="true" />
        Add a manager
      </button>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        addManager.mutate(
          {
            name: form.name.trim(),
            phone: form.phone.trim(),
            password: form.password,
            email: form.email.trim() || undefined,
          },
          {
            onSuccess: (user) => {
              toast.success(`${user.name} can now sign in as a manager`);
              setForm({ name: '', phone: '', password: '', email: '' });
              setOpen(false);
            },
          },
        );
      }}
      className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-white/10"
    >
      <p className="font-medium text-gray-900 dark:text-slate-100">New manager</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            { key: 'name', label: 'Full name', type: 'text' },
            { key: 'phone', label: 'Mobile number', type: 'tel' },
            { key: 'email', label: 'Email (optional)', type: 'email' },
            { key: 'password', label: 'Password (8 or more characters)', type: 'password' },
          ] as const
        ).map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={`manager-${field.key}`}>{field.label}</Label>
            <Input
              id={`manager-${field.key}`}
              type={field.type}
              autoComplete={field.key === 'password' ? 'new-password' : 'off'}
              value={form[field.key]}
              onChange={set(field.key)}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-slate-400">
        Managers run orders, products and the store&apos;s settings, but can&apos;t change domains
        or other staff.
      </p>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={addManager.isPending}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {addManager.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Add manager
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium dark:border-white/15"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// The store's customers (search, block) and its team (owner and managers).
const Customers = () => {
  const { user } = useSession();
  const isOwner = user?.role === 'OWNER';
  const [search, setSearch] = useState('');
  const debounced = useDebounced(search.trim());

  return (
    <div>
      <PageHeading
        title="Customers"
        desc="People who shop here, and the team that runs the store."
      />
      <Tabs defaultValue="customers">
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="customers" className="gap-2">
            <Users className="size-4" aria-hidden="true" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="mt-4 rounded-xl glass p-4 md:p-5">
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone number"
              aria-label="Search customers"
              className="h-10 pl-9"
            />
          </div>
          <UserList
            role="CUSTOMER"
            search={debounced || undefined}
            isOwner={isOwner}
            empty={debounced ? 'No customers match.' : 'No customers yet.'}
          />
        </TabsContent>

        <TabsContent value="team" className="mt-4 space-y-4">
          <div className="rounded-xl glass p-4 md:p-5">
            <UserList role="OWNER" isOwner={isOwner} empty="No owner found." />
            <div className="mt-3 border-t border-gray-100 pt-3 dark:border-white/10">
              <UserList role="MANAGER" isOwner={isOwner} empty="No managers yet." />
            </div>
          </div>
          {isOwner && <AddManager />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customers;
