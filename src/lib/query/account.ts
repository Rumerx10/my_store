import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  api,
  getGuestToken,
  loadSession,
  saveSession,
  setGuestToken,
  type SessionUser,
} from '@/lib/api/client';
import type { ApiAuth, ApiUser } from '@/lib/api/types';
import { qk } from './keys';
import { useSession } from './session';

const toSessionUser = (user: ApiAuth['user'] | ApiUser): SessionUser => ({
  id: user.id,
  role: user.role,
  name: user.name,
  phone: user.phone,
  username: user.username,
  email: user.email,
  avatarUrl: user.avatarUrl,
});

// Keeps a fresh sign-in (login, sign-up or checkout). The visitor's guest cart and wishlist
// move into the account first, so nothing they picked is lost; saving the session then
// refreshes everything shown for the new user (see QueryProvider).
export const startSession = async (auth: ApiAuth) => {
  if (getGuestToken()) {
    try {
      await api('/cart/merge', {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
    } catch {
      // The cart stays with the guest token; signing in still works.
    }
  }
  setGuestToken(null);
  const user = toSessionUser(auth.user);
  saveSession({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, user });
  return user;
};

export const useLogin = () =>
  useMutation({
    meta: { toast: false },
    mutationFn: async (input: { login: string; password: string }) =>
      startSession(
        await api<ApiAuth>('/auth/login', { method: 'POST', body: input, anonymous: true }),
      ),
  });

export const useRegister = () =>
  useMutation({
    meta: { toast: false },
    mutationFn: async (input: { name: string; phone: string; password: string; email?: string }) =>
      startSession(
        await api<ApiAuth>('/auth/register', { method: 'POST', body: input, anonymous: true }),
      ),
  });

// Signs this device out. The session goes first, so the page changes at once.
export const signOut = async () => {
  const session = loadSession();
  saveSession(null);
  if (session) {
    await api('/auth/logout', {
      method: 'POST',
      body: { refreshToken: session.refreshToken },
      anonymous: true,
    }).catch(() => undefined);
  }
};

export const useLogout = () => useMutation({ mutationFn: signOut });

export const useLogoutEverywhere = () =>
  useMutation({
    mutationFn: async () => {
      await api('/auth/logout-all', { method: 'POST' });
      saveSession(null);
    },
  });

// The signed-in account as the API has it (with the join date the session leaves out).
export const useMe = () => {
  const { user } = useSession();
  return useQuery({
    queryKey: qk.me,
    queryFn: () => api<ApiUser>('/users/me'),
    enabled: Boolean(user),
  });
};

// Keeps the saved session's copy of the user in step, so the header shows the new name.
const refreshSessionUser = (user: ApiUser) => {
  const session = loadSession();
  if (session) saveSession({ ...session, user: toSessionUser(user) });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name?: string; email?: string | null; avatarUrl?: string | null }) =>
      api<ApiUser>('/users/me', { method: 'PATCH', body: input }),
    onSuccess: (user) => {
      queryClient.setQueryData(qk.me, user);
      refreshSessionUser(user);
    },
  });
};

// Changing the password signs out every other device; this one gets new tokens.
export const useChangePassword = () =>
  useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      api<ApiAuth>('/users/me/password', { method: 'PATCH', body: input }),
    onSuccess: (auth) =>
      saveSession({
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        user: toSessionUser(auth.user),
      }),
  });

// Deactivates the account (orders are kept) and signs out.
export const useCloseAccount = () =>
  useMutation({
    mutationFn: async () => {
      await api('/users/me', { method: 'DELETE' });
      saveSession(null);
    },
  });
