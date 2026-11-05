import { useSyncExternalStore } from 'react';
import { loadSession, onSessionChange, type SessionUser } from '@/lib/api/client';

const subscribe = (onChange: () => void) => onSessionChange(onChange);
const noSubscribe = () => () => {};

// False while the server renders and the page hydrates, true after: localStorage (and so the
// session) is only readable in the browser.
export const useIsClient = () =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );

export const isStaffRole = (user: Pick<SessionUser, 'role'> | null | undefined) =>
  user?.role === 'OWNER' || user?.role === 'MANAGER';

// Who is signed in, kept in step with sign-in, sign-out, token refreshes and other tabs.
// `ready` is false until the browser has read the saved session.
export const useSession = () => {
  const session = useSyncExternalStore(subscribe, loadSession, () => null);
  const ready = useIsClient();
  const user = session?.user ?? null;
  return { user, ready, isStaff: isStaffRole(user) };
};
