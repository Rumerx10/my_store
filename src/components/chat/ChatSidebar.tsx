'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, MoreVertical } from 'lucide-react';

interface ChatContact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
}

interface ChatSidebarProps {
  chats: ChatContact[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
}

const ChatSidebar = ({ chats, selectedChatId, onSelectChat }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
          />
          <Search
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                selectedChatId === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Image
                  src={chat.avatar || '/placeholder.svg'}
                  alt={chat.name}
                  width={48}
                  height={48}
                  className="rounded-full w-12 h-12 object-cover"
                />
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">{chat.timestamp}</span>
                </div>
                <p
                  className={`text-sm truncate ${
                    chat.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}
                >
                  {chat.lastMessage}
                </p>
              </div>

              {/* Unread Badge */}
              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">
                  {chat.unreadCount}
                </div>
              )}
            </button>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p className="text-sm">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
