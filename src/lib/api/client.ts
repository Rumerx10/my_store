// The one way the app talks to the store API. Every request names its store (X-Seller-Host),
// sends the visitor's guest token for their cart and wishlist, and the access token when
// someone is signed in. An expired access token is refreshed once, quietly.
//
// Which store: the seller centre serves every store at /admin/<store>/..., so a request made
// from there is for that store; every other page belongs to this app's own store
// (NEXT_PUBLIC_STORE_HOST). Sign-ins are kept per store, so one browser can manage several.

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(
  /\/$/,
  '',
);
export const STORE_HOST = process.env.NEXT_PUBLIC_STORE_HOST || 'next-power.myplatform.com';

// Stores live at <slug>.<PLATFORM_DOMAIN>, unless they have a domain of their own.
export const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || STORE_HOST.split('.').slice(1).join('.');

// This app's own store, as the seller centre names it: /admin/next-power.
export const STORE_SLUG = STORE_HOST.endsWith(`.${PLATFORM_DOMAIN}`)
  ? STORE_HOST.slice(0, -PLATFORM_DOMAIN.length - 1)
  : STORE_HOST;

// The store in a seller-centre address is its slug ("next-power"), or a domain of its own.
export const storeHostFor = (store: string) => {
  const name = decodeURIComponent(store).trim().toLowerCase();
  return name.includes('.') ? name : `${name}.${PLATFORM_DOMAIN}`;
};

const ADMIN_PATH = /^\/admin\/([^/?#]+)/;

// The store the page on screen belongs to.
export const currentStoreHost = () => {
  if (typeof window !== 'undefined') {
    const match = ADMIN_PATH.exec(window.location.pathname);
    if (match) return storeHostFor(match[1]);
  }
  return STORE_HOST;
};

// Uploaded images come back as /api/v1/uploads/<id>; they live on the API's host.
export const API_ORIGIN = new URL(API_URL).origin;
export const absoluteUrl = (url: string) => (url.startsWith('/') ? `${API_ORIGIN}${url}` : url);

// The reverse, for sending an image back: the API stores uploads by their path.
const UPLOADS_PATH = '/api/v1/uploads/';
export const toApiImageUrl = (url: string) =>
  url.startsWith(`${API_ORIGIN}${UPLOADS_PATH}`) ? url.slice(API_ORIGIN.length) : url;

export type Role = 'OWNER' | 'MANAGER' | 'CUSTOMER';

export interface SessionUser {
  id: string;
  role: Role;
  name: string;
  phone: string;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: SessionUser;
}

const SESSION_KEY = 'np.session';
const GUEST_KEY = 'np.guestToken';

// localStorage can be missing (private windows, server render); the shop must still work.
const read = (key: string) => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null) => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Nothing to do: the session just won't survive a reload.
  }
};

const parseSession = (raw: string | null): Session | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
};

// One sign-in per store. This app's own store keeps the original key.
const sessionKey = (host: string) => (host === STORE_HOST ? SESSION_KEY : `${SESSION_KEY}:${host}`);
const hostOfKey = (key: string) =>
  key === SESSION_KEY
    ? STORE_HOST
    : key.startsWith(`${SESSION_KEY}:`)
      ? key.slice(SESSION_KEY.length + 1)
      : null;

// Read once per store and kept in memory, so React can compare snapshots
// (useSyncExternalStore).
const cached = new Map<string, Session | null>();
const loadSessionFor = (host: string): Session | null => {
  if (!cached.has(host)) cached.set(host, parseSession(read(sessionKey(host))));
  return cached.get(host) ?? null;
};
export const loadSession = () => loadSessionFor(currentStoreHost());

const listeners = new Set<(session: Session | null) => void>();
export const onSessionChange = (listener: (session: Session | null) => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const saveSessionFor = (host: string, session: Session | null) => {
  write(sessionKey(host), session ? JSON.stringify(session) : null);
  cached.set(host, session);
  if (host === currentStoreHost()) listeners.forEach((listener) => listener(session));
};
export const saveSession = (session: Session | null) => saveSessionFor(currentStoreHost(), session);

// Signing in or out in another tab changes this one too.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    const host = event.key ? hostOfKey(event.key) : null;
    if (!host) return;
    const session = parseSession(event.newValue);
    cached.set(host, session);
    if (host === currentStoreHost()) listeners.forEach((listener) => listener(session));
  });
}

// Guest carts and wishlists belong to this app's own shop, never to the seller centre.
const ownStore = () => currentStoreHost() === STORE_HOST;
export const getGuestToken = () => (ownStore() ? read(GUEST_KEY) : null);
export const setGuestToken = (token: string | null) => {
  if (ownStore()) write(GUEST_KEY, token);
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly body?: unknown,
  ) {
    super(message);
  }
}

// Nest answers validation errors with a list of messages; show them as one sentence.
const messageOf = (body: unknown, status: number) => {
  const message = (body as { message?: unknown } | undefined)?.message;
  if (Array.isArray(message)) return message.join('. ');
  if (typeof message === 'string') return message;
  return status >= 500 ? 'Something went wrong. Please try again.' : `Request failed (${status})`;
};

interface Options {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  // Leave out the access token, e.g. for sign-in itself.
  anonymous?: boolean;
}

const refreshing = new Map<string, Promise<boolean>>();

// Swaps the refresh token for new tokens. Several requests failing at once share one refresh,
// because the server signs everyone out when a refresh token is used twice.
const refreshSession = (host: string): Promise<boolean> => {
  const running = refreshing.get(host);
  if (running) return running;
  const refresh = (async () => {
    const session = loadSessionFor(host);
    if (!session) return false;
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Seller-Host': host },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
      if (!res.ok) {
        saveSessionFor(host, null);
        return false;
      }
      const next = (await res.json()) as Session;
      saveSessionFor(host, {
        accessToken: next.accessToken,
        refreshToken: next.refreshToken,
        user: next.user,
      });
      return true;
    } catch {
      return false;
    } finally {
      refreshing.delete(host);
    }
  })();
  refreshing.set(host, refresh);
  return refresh;
};

// Sends one request with the store, guest and access headers. An expired access token is
// refreshed once and the request sent again.
async function send(path: string, options: Options, retried = false): Promise<Response> {
  const host = currentStoreHost();
  const session = options.anonymous ? null : loadSessionFor(host);
  const guestToken = getGuestToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-Seller-Host': host,
    ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(guestToken ? { 'X-Guest-Token': guestToken } : {}),
    ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    ...options.headers,
  };

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, "Can't reach the store right now. Check your connection.");
  }

  if (res.status === 401 && session && !retried && (await refreshSession(host))) {
    return send(path, options, true);
  }

  const issued = res.headers.get('X-Guest-Token');
  if (issued && issued !== guestToken) setGuestToken(issued);
  return res;
}

const readJson = async (res: Response): Promise<unknown> => {
  const text = res.status === 204 ? '' : await res.text();
  return text ? JSON.parse(text) : undefined;
};

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const res = await send(path, options);
  const body = await readJson(res);
  if (!res.ok) throw new ApiError(res.status, messageOf(body, res.status), body);
  return body as T;
}

// A file from the API, such as the sales report PDF, with the name the server gave it.
// Errors still come back as JSON.
export async function apiFile(path: string): Promise<{ blob: Blob; filename: string | null }> {
  const res = await send(path, { headers: { Accept: '*/*' } });
  if (!res.ok) {
    const body = await readJson(res).catch(() => undefined);
    throw new ApiError(res.status, messageOf(body, res.status), body);
  }
  const disposition = res.headers.get('Content-Disposition') ?? '';
  return { blob: await res.blob(), filename: /filename="([^"]+)"/.exec(disposition)?.[1] ?? null };
}

// Hands a file to the browser to save.
export const saveFile = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong. Please try again.';

// Images picked in a form are data URLs; the API stores them and returns their URL.
// Anything else (an image already uploaded, or an https link) is sent back as it is.
export const uploadImage = async (src: string) =>
  src.startsWith('data:')
    ? (await api<{ url: string }>('/uploads', { method: 'POST', body: { dataUrl: src } })).url
    : toApiImageUrl(src);
