'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/common/RequireAuth';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { useChatActions, useMyChat } from '@/lib/query/messages';
import { useSession } from '@/lib/query/session';
import { useStore } from '@/lib/query/shop';
import ChatWindow from '@/components/common/chat/ChatWindow';
import { initialsOf, toMessages, type ChatContact } from '@/components/common/chat/chatData';
import { adminHome } from '@/lib/stores';

// A customer's chat with the store. Replies show up within a few seconds.
const CustomerChat = () => {
  const { data: thread, isPending, error, refetch } = useMyChat({ open: true });
  const { data: store } = useStore();
  const { send, read } = useChatActions();
  const unread = thread?.unread ?? 0;

  // Opening the chat reads the store's replies.
  useEffect(() => {
    if (unread > 0) read.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unread]);

  if (isPending) return <PageLoader label="Loading your messages" />;
  if (error) {
    return (
      <div className="container py-10">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  const storeName = store?.name ?? 'The store';
  const contact: ChatContact = {
    id: 'store',
    name: `${storeName} support`,
    role: store?.supportHours ?? 'We usually reply within a few hours',
    initials: initialsOf(storeName),
    avatarUrl: store?.logoUrl,
    phone: store?.phone,
    lastMessage: '',
    timestamp: '',
    unreadCount: 0,
  };

  return (
    <div className="md:container md:py-6">
      <div className="flex h-[calc(100dvh-var(--header-h)-var(--bottom-nav-h))] overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl md:h-[calc(100dvh-var(--header-h)-var(--bottom-nav-h)-3rem)] md:rounded-xl md:border md:border-gray-200/80 dark:md:border-white/10">
        <ChatWindow
          chat={contact}
          messages={toMessages(thread.messages, false)}
          onSend={(text) => send.mutateAsync(text)}
          emptyText="Ask us anything: product advice, an order, installation. We'll answer here."
        />
      </div>
    </div>
  );
};

// Staff answer from the seller centre's inbox instead.
const ChatLayout = () => {
  const { isStaff } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isStaff) router.replace(`${adminHome()}/chats`);
  }, [isStaff, router]);

  return (
    <RequireAuth loginHref="/next-power/login">
      {isStaff ? <PageLoader /> : <CustomerChat />}
    </RequireAuth>
  );
};

export default ChatLayout;
