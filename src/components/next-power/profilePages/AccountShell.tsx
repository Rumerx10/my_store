'use client';
import { menuItems } from '@/docs/navLinks';
import { useMe } from '@/lib/query/account';
import { useSession } from '@/lib/query/session';
import RequireAuth from '@/components/common/RequireAuth';
import SideNavShell from '../shared/SideNavShell';
import UserAvatar from '@/components/common/UserAvatar';

export const memberSince = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

const AccountHeader = () => {
  const { user } = useSession();
  const { data: me } = useMe();
  const name = me?.name ?? user?.name ?? '';
  const avatar = me?.avatarUrl ?? user?.avatarUrl;
  return (
    <div className="flex items-center gap-3">
      <UserAvatar name={name} avatarUrl={avatar} className="size-11" />
      <div className="min-w-0">
        <p className="truncate font-semibold text-gray-900 dark:text-slate-100">{name}</p>
        {me && (
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Member since {memberSince(me.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};

// Shared frame for the account pages: navigation plus the page content, signed in only.
const AccountShell = ({ children }: { children: React.ReactNode }) => (
  <RequireAuth loginHref="/next-power/login">
    <SideNavShell items={menuItems} label="Account" header={<AccountHeader />}>
      {children}
    </SideNavShell>
  </RequireAuth>
);

export default AccountShell;
