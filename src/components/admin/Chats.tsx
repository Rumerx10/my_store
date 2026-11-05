'use client';
import { useEffect, useState } from 'react';
import ChatSidebar from '@/components/common/chat/ChatSidebar';
import ChatWindow from '@/components/common/chat/ChatWindow';
import {
  chatTime,
  initialsOf,
  toMessages,
  type ChatContact,
} from '@/components/common/chat/chatData';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { useChatThread, useChats, useStoreChatActions } from '@/lib/query/admin';
import { cn } from '@/lib/utils';

// The store's chat inbox: customers on the left, the conversation on the right. New
// messages arrive within a few seconds.
const Chats = () => {
  const chats = useChats();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConversationOnMobile, setShowConversationOnMobile] = useState(false);
  const thread = useChatThread(selectedId);
  const { reply, read } = useStoreChatActions();

  const conversations = chats.data?.data ?? [];
  const contacts: ChatContact[] = conversations.map((conversation) => ({
    id: conversation.id,
    name: conversation.customer.name,
    role: conversation.customer.phone,
    initials: initialsOf(conversation.customer.name),
    avatarUrl: conversation.customer.avatarUrl,
    phone: conversation.customer.phone,
    lastMessage: conversation.lastMessage,
    timestamp: chatTime(conversation.lastMessageAt),
    unreadCount: conversation.unread,
  }));

  // Open the newest conversation on wide screens.
  const firstId = contacts[0]?.id;
  useEffect(() => {
    if (!selectedId && firstId && window.matchMedia('(min-width: 768px)').matches) {
      setSelectedId(firstId);
    }
  }, [selectedId, firstId]);

  // Reading a conversation clears its unread count.
  const unread = thread.data?.unread ?? 0;
  useEffect(() => {
    if (selectedId && unread > 0) read.mutate(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, unread]);

  if (chats.isPending) return <PageLoader label="Loading conversations" />;
  if (chats.error) return <ErrorState error={chats.error} onRetry={() => chats.refetch()} />;

  const selected = contacts.find((contact) => contact.id === selectedId);

  return (
    <div className="flex h-[calc(100dvh-var(--header-h)-var(--bottom-nav-h)-6rem)] min-h-[28rem] overflow-hidden rounded-xl border border-gray-200/80 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
      <ChatSidebar
        chats={contacts}
        selectedChatId={selectedId}
        onSelectChat={(id) => {
          setSelectedId(id);
          setShowConversationOnMobile(true);
        }}
        title="Chats"
        emptyText="No customer has written yet. Conversations show up here."
        className={cn(showConversationOnMobile && 'hidden md:flex')}
      />
      <div className={cn('min-w-0 flex-1', showConversationOnMobile ? 'flex' : 'hidden md:flex')}>
        {selected ? (
          thread.data ? (
            <ChatWindow
              chat={selected}
              messages={toMessages(thread.data.messages, true)}
              onSend={(text) => reply.mutateAsync({ id: selected.id, body: text })}
              onBack={() => setShowConversationOnMobile(false)}
            />
          ) : (
            <PageLoader className="flex-1" label="Loading the conversation" />
          )
        ) : (
          <p className="m-auto px-6 text-center text-sm text-gray-500 dark:text-slate-400">
            Choose a conversation.
          </p>
        )}
      </div>
    </div>
  );
};

export default Chats;
