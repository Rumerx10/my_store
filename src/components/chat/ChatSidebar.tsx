'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatContact } from './chatData';
import ChatAvatar from './ChatAvatar';

interface ChatSidebarProps {
  chats: ChatContact[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  className?: string;
}

const ChatSidebar = ({ chats, selectedChatId, onSelectChat, className }: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col border-r border-gray-100 dark:border-white/5 bg-white dark:bg-slate-900 md:w-80',
        className,
      )}
    >
      <div className="border-b border-gray-100 dark:border-white/5 p-4">
        <h1 className="text-xl text-gray-900 dark:text-slate-100">Messages</h1>
        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search conversations"
            placeholder="Search conversations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 pl-9 pr-3 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 focus:border-brand focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-3 focus:ring-brand/15"
          />
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                onClick={() => onSelectChat(chat.id)}
                aria-current={selectedChatId === chat.id ? 'true' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5',
                  selectedChatId === chat.id && 'bg-brand-soft/60 hover:bg-brand-soft/60',
                )}
              >
                <ChatAvatar chat={chat} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-gray-900 dark:text-slate-100">
                      {chat.name}
                    </span>
                    <span className="shrink-0 text-xs text-gray-500 dark:text-slate-400">
                      {chat.timestamp}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'truncate text-sm',
                        chat.unreadCount > 0
                          ? 'font-medium text-gray-900 dark:text-slate-100'
                          : 'text-gray-500 dark:text-slate-400',
                      )}
                    >
                      {chat.lastMessage}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold text-white">
                        {chat.unreadCount}
                        <span className="sr-only"> unread</span>
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))
        ) : (
          <li className="px-4 py-10 text-center text-sm text-gray-500 dark:text-slate-400">
            No conversations match.
          </li>
        )}
      </ul>
    </div>
  );
};

export default ChatSidebar;
