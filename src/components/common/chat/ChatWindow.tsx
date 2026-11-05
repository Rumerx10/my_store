'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Loader2, MessageCircle, Phone, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatContact, Message } from './chatData';
import ChatAvatar from './ChatAvatar';

interface ChatWindowProps {
  chat: ChatContact;
  messages: Message[];
  // Resolves when the message is saved; the text is kept if it fails.
  onSend: (text: string) => Promise<unknown>;
  onBack?: () => void;
  emptyText?: string;
}

// One conversation thread; used on desktop and, with a back button, on mobile.
const ChatWindow = ({ chat, messages, onSend, onBack, emptyText }: ChatWindowProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length, chat.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await onSend(text);
      setInputMessage('');
    } catch {
      // The toast says why; the text stays so it can be sent again.
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      aria-label={`Conversation with ${chat.name}`}
      className="flex h-full min-w-0 flex-1 flex-col bg-white dark:bg-slate-900"
    >
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-white/5 px-3 py-3 md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          {/* Phones only: on wide screens the list stays beside the conversation. */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to conversations"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 md:hidden"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}
          <ChatAvatar chat={chat} size="sm" />
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold text-gray-900 dark:text-slate-100">
              {chat.name}
            </h2>
            <p className="truncate text-xs text-gray-500 dark:text-slate-400">{chat.role}</p>
          </div>
        </div>
        {chat.phone && (
          <a
            href={`tel:${chat.phone.replace(/[^+\d]/g, '')}`}
            aria-label={`Call ${chat.name}`}
            className="flex size-10 items-center justify-center rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <Phone className="size-5" />
          </a>
        )}
      </header>

      <div
        className="flex-1 space-y-3 overflow-y-auto bg-gray-50 dark:bg-white/5 px-3 py-4 md:px-6"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <MessageCircle
              className="size-10 text-gray-300 dark:text-slate-600"
              aria-hidden="true"
            />
            <p className="mt-3 max-w-xs text-sm text-gray-500 dark:text-slate-400">
              {emptyText ?? 'No messages yet.'}
            </p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex', message.mine ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-3.5 py-2 md:max-w-md',
                message.mine
                  ? 'rounded-br-md bg-brand text-white'
                  : 'rounded-bl-md border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100',
              )}
            >
              <p className="whitespace-pre-line break-words text-sm">{message.text}</p>
              <p
                className={cn(
                  'mt-1 text-right text-[11px]',
                  message.mine ? 'text-white/70' : 'text-gray-400 dark:text-slate-500',
                )}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-gray-100 dark:border-white/5 px-3 py-3 md:px-5"
      >
        <label htmlFor="chat-input" className="sr-only">
          Message {chat.name}
        </label>
        <input
          id="chat-input"
          type="text"
          autoComplete="off"
          maxLength={2000}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Write a message"
          className="h-11 min-w-0 flex-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 px-4 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 transition-colors focus:border-brand focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-3 focus:ring-brand/15"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || sending}
          aria-label="Send message"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-[background-color,opacity] hover:bg-brand-hover disabled:opacity-40"
        >
          {sending ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <Send className="size-[18px]" />
          )}
        </button>
      </form>
    </section>
  );
};

export default ChatWindow;
