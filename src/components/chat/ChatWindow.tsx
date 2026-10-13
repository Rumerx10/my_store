'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Phone, Send, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatContact, Message } from './chatData';
import ChatAvatar from './ChatAvatar';

interface ChatWindowProps {
  chat: ChatContact;
  messages: Message[];
  onSend: (text: string) => void;
  onBack?: () => void;
}

// One conversation thread; used on desktop and, with a back button, on mobile.
const ChatWindow = ({ chat, messages, onSend, onBack }: ChatWindowProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, chat.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSend(inputMessage.trim());
    setInputMessage('');
  };

  return (
    <section aria-label={`Conversation with ${chat.name}`} className="flex h-full min-w-0 flex-1 flex-col bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}
          <ChatAvatar chat={chat} size="sm" />
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold text-gray-900">{chat.name}</h2>
            <p className="text-xs text-gray-500">{chat.isOnline ? 'Online' : chat.role}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label={`Call ${chat.name}`}
          className="flex size-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Phone className="size-5" />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-4 md:px-6" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex', message.sender === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-3.5 py-2 md:max-w-md',
                message.sender === 'user'
                  ? 'rounded-br-md bg-brand text-white'
                  : 'rounded-bl-md border border-gray-200 bg-white text-gray-900',
              )}
            >
              <p className="break-words text-sm">{message.text}</p>
              <p
                className={cn(
                  'mt-1 text-right text-[11px]',
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-400',
                )}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-100 px-3 py-3 md:px-5">
        <button
          type="button"
          aria-label="Attach a file"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <Paperclip className="size-5" />
        </button>
        <label htmlFor="chat-input" className="sr-only">
          Message {chat.name}
        </label>
        <input
          id="chat-input"
          type="text"
          autoComplete="off"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Write a message"
          className="h-11 min-w-0 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-500 transition-colors focus:border-brand focus:bg-white focus:outline-none focus:ring-3 focus:ring-brand/15"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          aria-label="Send message"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-[background-color,opacity] hover:bg-brand-hover disabled:opacity-40"
        >
          <Send className="size-[18px]" />
        </button>
      </form>
    </section>
  );
};

export default ChatWindow;
