'use client';
import { useState } from 'react';
import { Inbox, Mail, MailOpen, Phone, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import type { ApiMessage } from '@/lib/api/types';
import { FEEDBACK_TOPICS } from '@/lib/query/messages';
import { useMessageActions, useStoreMessages, type MessageFilter } from '@/lib/query/admin';
import { cn } from '@/lib/utils';

const FILTERS: { value: MessageFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'CONTACT', label: 'Contact form' },
  { value: 'FEEDBACK', label: 'Feedback' },
];

const topicLabel = (topic: string | null) =>
  FEEDBACK_TOPICS.find((t) => t.value === topic)?.label ?? 'Feedback';

const MessageCard = ({ message }: { message: ApiMessage }) => {
  const { markRead, remove } = useMessageActions();
  const [open, setOpen] = useState(!message.isRead);
  const subject =
    message.subject ||
    (message.kind === 'CONTACT' ? 'Message from the contact page' : topicLabel(message.topic));

  return (
    <li className={cn('rounded-xl glass p-4 md:p-5', !message.isRead && 'ring-1 ring-brand/40')}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!message.isRead) markRead.mutate({ id: message.id, isRead: true });
        }}
        aria-expanded={open}
        className="flex w-full items-start gap-3 text-left"
      >
        <span
          className={cn(
            'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl',
            message.isRead
              ? 'bg-gray-100 text-gray-500 dark:bg-white/10'
              : 'bg-brand-soft text-brand',
          )}
        >
          {message.isRead ? (
            <MailOpen className="size-4" aria-hidden="true" />
          ) : (
            <Mail className="size-4" aria-hidden="true" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'text-gray-900 dark:text-slate-100',
                !message.isRead && 'font-semibold',
              )}
            >
              {subject}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-slate-300">
              {message.kind === 'CONTACT' ? 'Contact' : topicLabel(message.topic)}
            </span>
            {message.wantsReply && (
              <span className="rounded-full bg-sun-soft px-2 py-0.5 text-xs font-medium text-sun-ink">
                Wants a reply
              </span>
            )}
          </span>
          <span className="block text-sm text-gray-600 dark:text-slate-400">
            {message.name} ·{' '}
            {new Date(message.createdAt).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
          {!open && (
            <span className="mt-1 line-clamp-1 block text-sm text-gray-500 dark:text-slate-400">
              {message.body}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="mt-3 pl-12">
          <p className="whitespace-pre-line break-words text-sm text-gray-800 dark:text-slate-200">
            {message.body}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {message.email && (
              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white hover:bg-brand-hover"
              >
                <Mail className="size-4" aria-hidden="true" />
                Reply to {message.email}
              </a>
            )}
            {message.phone && (
              <a
                href={`tel:${message.phone}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 dark:border-white/15 dark:hover:bg-white/5"
              >
                <Phone className="size-4" aria-hidden="true" />
                {message.phone}
              </a>
            )}
            <button
              type="button"
              onClick={() => markRead.mutate({ id: message.id, isRead: !message.isRead })}
              className="h-9 rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/10"
            >
              Mark {message.isRead ? 'unread' : 'read'}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this message?')) {
                  remove.mutate(message.id, { onSuccess: () => toast.success('Message deleted') });
                }
              }}
              className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-500 hover:text-red dark:text-slate-400"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

// Messages from the contact page and customers' feedback, newest first.
const Messages = () => {
  const [filter, setFilter] = useState<MessageFilter>('all');
  const query = useStoreMessages(filter);

  return (
    <div>
      <PageHeading
        title="Messages"
        desc={
          query.unread > 0
            ? `${query.unread} unread ${query.unread === 1 ? 'message' : 'messages'}.`
            : 'Contact form messages and customer feedback.'
        }
      />
      <div
        role="radiogroup"
        aria-label="Show"
        className="no-scrollbar mb-4 flex gap-1 overflow-x-auto"
      >
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={filter === option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              'h-9 shrink-0 rounded-full px-4 text-sm font-medium transition-colors',
              filter === option.value
                ? 'bg-brand text-white'
                : 'text-gray-700 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-900/70',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {query.isPending ? (
        <PageLoader label="Loading messages" />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : query.messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 backdrop-blur-sm bg-white/30 px-6 py-14 text-center dark:border-white/15 dark:bg-slate-900">
          <Inbox className="mx-auto size-10 text-gray-300 dark:text-slate-600" aria-hidden="true" />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">Nothing here</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {query.messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </ul>
      )}
      {query.hasNextPage && (
        <button
          type="button"
          onClick={() => query.fetchNextPage()}
          disabled={query.isFetchingNextPage}
          className="mt-4 h-10 rounded-lg border border-gray-300 px-4 text-sm font-medium dark:border-white/15"
        >
          {query.isFetchingNextPage ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
};

export default Messages;
