'use client';

import { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import MobileChatView from './MobileChatView';
import ChatWindow from './ChatWindow';

// interface ChatContact {
//   id: number;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp: string;
//   isOnline: boolean;
//   unreadCount: number;
// }

const ChatLayout = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(1);
  // const [chats, setChats] = useState<ChatContact[]>([
  const chats = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/user.webp',
      lastMessage: 'Thanks for your help!',
      timestamp: '2:30 PM',
      isOnline: true,
      unreadCount: 0,
    },
    {
      id: 2,
      name: 'Alex Chen',
      avatar: '/user.webp',
      lastMessage: 'See you tomorrow',
      timestamp: '1:15 PM',
      isOnline: true,
      unreadCount: 2,
    },
    {
      id: 3,
      name: 'Emma Davis',
      avatar: '/user.webp',
      lastMessage: 'Sounds great!',
      timestamp: '11:45 AM',
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: 4,
      name: 'Michael Brown',
      avatar: '/user.webp',
      lastMessage: 'Let me check that',
      timestamp: 'Yesterday',
      isOnline: false,
      unreadCount: 1,
    },
    {
      id: 5,
      name: 'Jessica Wilson',
      avatar: '/user.webp',
      lastMessage: 'Perfect timing!',
      timestamp: 'Yesterday',
      isOnline: true,
      unreadCount: 0,
    },
  ];

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  return (
    <div className="flex h-[calc(100vh-80px)] lg:h-[calc(100vh-96px)] bg-gray-50">
      {/* Mobile: Show either sidebar or chat */}
      <div className="w-full lg:hidden flex">
        {selectedChatId === null ? (
          <ChatSidebar
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
          />
        ) : (
          selectedChat && (
            <MobileChatView chat={selectedChat} onBack={() => setSelectedChatId(null)} />
          )
        )}
      </div>

      {/* Desktop: Show both sidebar and chat */}
      <div className="hidden lg:flex flex-1 w-full">
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Select a chat to start messaging
              </h2>
              <p className="text-gray-500">Choose a contact from the list to begin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
