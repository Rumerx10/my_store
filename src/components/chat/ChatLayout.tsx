'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { CHATS, INITIAL_MESSAGES, Message } from './chatData';

const ChatLayout = () => {
  const [chats, setChats] = useState(CHATS);
  const [selectedChatId, setSelectedChatId] = useState(CHATS[0].id);
  // On small screens the list and the conversation take turns filling the screen.
  const [showConversationOnMobile, setShowConversationOnMobile] = useState(false);
  const [messages, setMessages] = useState<Record<number, Message[]>>(INITIAL_MESSAGES);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) ?? chats[0];

  const selectChat = (id: number) => {
    setSelectedChatId(id);
    setShowConversationOnMobile(true);
    setChats((prev) => prev.map((chat) => (chat.id === id ? { ...chat, unreadCount: 0 } : chat)));
  };

  const sendMessage = (text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    setMessages((prev) => {
      const thread = prev[selectedChatId] ?? [];
      return {
        ...prev,
        [selectedChatId]: [...thread, { id: thread.length + 1, sender: 'user', text, timestamp }],
      };
    });
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId ? { ...chat, lastMessage: text, timestamp } : chat,
      ),
    );
  };

  return (
    <div className="md:container md:py-6">
      <div className="flex h-[calc(100dvh-var(--header-h)-var(--bottom-nav-h))] overflow-hidden bg-white/60 backdrop-blur-xl md:h-[calc(100dvh-var(--header-h)-var(--bottom-nav-h)-3rem)] md:rounded-xl md:border md:border-gray-200/80">
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={selectChat}
          className={cn(showConversationOnMobile && 'hidden md:flex')}
        />
        <div className={cn('min-w-0 flex-1', showConversationOnMobile ? 'flex' : 'hidden md:flex')}>
          <ChatWindow
            chat={selectedChat}
            messages={messages[selectedChat.id] ?? []}
            onSend={sendMessage}
            onBack={() => setShowConversationOnMobile(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
