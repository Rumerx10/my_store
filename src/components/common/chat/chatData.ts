import type { ApiChatMessage } from '@/lib/api/types';

// Who a conversation is with: the store (for a customer) or a customer (for staff).
export interface ChatContact {
  id: string;
  name: string;
  // A line under the name, e.g. "Usually replies within an hour" or a phone number.
  role: string;
  initials: string;
  avatarUrl?: string | null;
  // A number to call from the conversation header.
  phone?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  // Written by the person looking at the screen.
  mine: boolean;
  text: string;
  timestamp: string;
}

export const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

// "2:30 PM" today, "Mon" this week, else "12 Oct".
export const chatTime = (iso: string) => {
  const date = new Date(iso);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  if (now.getTime() - date.getTime() < 6 * 86_400_000) {
    return date.toLocaleDateString('en-GB', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const toMessages = (messages: ApiChatMessage[], viewerIsStore: boolean): Message[] =>
  messages.map((message) => ({
    id: message.id,
    mine: message.fromStore === viewerIsStore,
    text: message.body,
    timestamp: chatTime(message.createdAt),
  }));
