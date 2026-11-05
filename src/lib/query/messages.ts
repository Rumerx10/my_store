import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { ApiChatMessage, ApiChatThread, ApiMessage } from '@/lib/api/types';
import { useSession } from './session';

export const FEEDBACK_TOPICS = [
  { value: 'general', label: 'General feedback', description: 'Tell us what you think' },
  { value: 'bug', label: 'Something is broken', description: 'A page or button not working' },
  { value: 'feature', label: 'Feature idea', description: 'Something you wish we had' },
  { value: 'complaint', label: 'Complaint', description: 'A problem with an order or service' },
] as const;

export interface MessageInput {
  kind: 'CONTACT' | 'FEEDBACK';
  topic?: (typeof FEEDBACK_TOPICS)[number]['value'];
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  body: string;
  wantsReply?: boolean;
}

// The contact page and the feedback page: a message to the store's staff.
export const useSendMessage = () =>
  useMutation({
    mutationFn: (input: MessageInput) =>
      api<ApiMessage>('/messages', { method: 'POST', body: input }),
  });

export const chatKey = ['chat'] as const;

// The customer's conversation with the store. While the chat is open it checks for replies
// every few seconds; elsewhere (the unread badge) once a minute.
export const useMyChat = ({ open }: { open: boolean }) => {
  const { user, isStaff } = useSession();
  return useQuery({
    queryKey: chatKey,
    queryFn: () => api<ApiChatThread>('/chat'),
    enabled: Boolean(user) && !isStaff,
    refetchInterval: open ? 5_000 : 60_000,
    refetchOnWindowFocus: true,
  });
};

export const useChatActions = () => {
  const queryClient = useQueryClient();

  const send = useMutation({
    mutationFn: (body: string) =>
      api<ApiChatMessage>('/chat/messages', { method: 'POST', body: { body } }),
    onSuccess: (message) => {
      queryClient.setQueryData<ApiChatThread>(chatKey, (thread) =>
        thread
          ? { ...thread, messages: [...thread.messages, message] }
          : { conversationId: null, unread: 0, messages: [message] },
      );
      queryClient.invalidateQueries({ queryKey: chatKey });
    },
  });

  const read = useMutation({
    meta: { toast: false },
    mutationFn: () => api('/chat/read', { method: 'POST' }),
    onSuccess: () =>
      queryClient.setQueryData<ApiChatThread>(chatKey, (thread) =>
        thread ? { ...thread, unread: 0 } : thread,
      ),
  });

  return { send, read };
};
