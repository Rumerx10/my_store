'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Store, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ApiComment } from '@/lib/api/types';
import { useReviewModeration } from '@/lib/query/admin';
import { useCommentActions, useComments, useReplies } from '@/lib/query/reviews';
import { useSession } from '@/lib/query/session';
import { formatReviewDate } from './reviewDates';

const Bubble = ({ name, store }: { name: string; store?: boolean }) => (
  <span
    aria-hidden="true"
    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand"
  >
    {store ? <Store className="size-4" /> : name.charAt(0).toUpperCase()}
  </span>
);

// A box for a comment or a reply; signed-out visitors get a sign-in link instead.
const CommentBox = ({
  placeholder,
  onSend,
  autoFocus,
}: {
  placeholder: string;
  onSend: (body: string) => Promise<unknown>;
  autoFocus?: boolean;
}) => {
  const { user } = useSession();
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  if (!user) {
    return (
      <p className="text-sm text-gray-500 dark:text-slate-400">
        <Link href="/next-power/login" className="font-medium text-brand hover:text-brand-hover">
          Sign in
        </Link>{' '}
        to join the conversation.
      </p>
    );
  }

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    try {
      await onSend(text);
      setBody('');
    } catch {
      // The toast says why; the text stays so it can be sent again.
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={send} className="flex gap-2">
      <Input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        maxLength={1000}
        autoFocus={autoFocus}
        aria-label={placeholder}
        className="h-9 rounded-full"
      />
      <Button type="submit" size="sm" disabled={busy || !body.trim()} className="rounded-full">
        {busy ? <Loader2 className="size-4 animate-spin" aria-label="Sending" /> : 'Send'}
      </Button>
    </form>
  );
};

const CommentLine = ({
  comment,
  onReply,
  onDelete,
  onToggleHidden,
}: {
  comment: ApiComment;
  onReply?: () => void;
  onDelete?: () => void;
  // Staff only: hide the comment from shoppers, or show it again.
  onToggleHidden?: () => void;
}) => (
  <div className={`flex gap-2.5 ${comment.isHidden ? 'opacity-60' : ''}`}>
    <Bubble name={comment.author} store={comment.fromStore} />
    <div className="min-w-0">
      <div className="rounded-2xl bg-gray-100 px-3.5 py-2 dark:bg-white/5">
        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
          {comment.author}
          {comment.fromStore && (
            <span className="ml-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-white">
              Store
            </span>
          )}
          {comment.isHidden && (
            <span className="ml-1.5 rounded-full bg-gray-300 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 dark:bg-white/20 dark:text-slate-200">
              Hidden
            </span>
          )}
        </p>
        <p className="whitespace-pre-line break-words text-sm text-gray-700 dark:text-slate-300">
          {comment.body}
        </p>
      </div>
      <p className="mt-1 flex gap-3 px-3.5 text-xs text-gray-500 dark:text-slate-400">
        <time dateTime={comment.createdAt}>{formatReviewDate(comment.createdAt)}</time>
        {onReply && (
          <button type="button" onClick={onReply} className="font-semibold hover:underline">
            Reply
          </button>
        )}
        {onToggleHidden && (
          <button
            type="button"
            onClick={onToggleHidden}
            className="inline-flex items-center gap-1 font-semibold hover:underline"
          >
            {comment.isHidden ? (
              <Eye className="size-3" aria-hidden="true" />
            ) : (
              <EyeOff className="size-3" aria-hidden="true" />
            )}
            {comment.isHidden ? 'Show' : 'Hide'}
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 font-semibold hover:text-red hover:underline"
          >
            <Trash2 className="size-3" aria-hidden="true" />
            Delete
          </button>
        )}
      </p>
    </div>
  </div>
);

// One comment with its replies, Facebook style: the first few show, the rest load on demand.
const CommentThread = ({ comment, reviewId }: { comment: ApiComment; reviewId: string }) => {
  const { user, isStaff } = useSession();
  const actions = useCommentActions(reviewId);
  const { hideComment } = useReviewModeration();
  const [replying, setReplying] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const all = useReplies(comment.id, showAll);
  const replies = showAll && all.data ? all.data : comment.replies;
  const hidden = comment.replyCount - replies.length;
  const canDelete = (c: ApiComment) => Boolean(user) && (c.authorId === user?.id || isStaff);
  const remove = (c: ApiComment) => {
    if (window.confirm('Delete this comment?')) actions.remove.mutate(c.id);
  };
  const toggleHidden = (c: ApiComment) =>
    isStaff ? () => hideComment.mutate({ id: c.id, isHidden: !c.isHidden }) : undefined;

  return (
    <li className="space-y-2">
      <CommentLine
        comment={comment}
        onReply={() => setReplying(true)}
        onDelete={canDelete(comment) ? () => remove(comment) : undefined}
        onToggleHidden={toggleHidden(comment)}
      />
      <div className="ml-10 space-y-2">
        {replies.map((reply) => (
          <CommentLine
            key={reply.id}
            comment={reply}
            onReply={() => setReplying(true)}
            onDelete={canDelete(reply) ? () => remove(reply) : undefined}
            onToggleHidden={toggleHidden(reply)}
          />
        ))}
        {hidden > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            disabled={all.isFetching}
            className="text-xs font-semibold text-gray-600 hover:underline dark:text-slate-400"
          >
            {all.isFetching
              ? 'Loading…'
              : `View ${hidden} more ${hidden === 1 ? 'reply' : 'replies'}`}
          </button>
        )}
        {replying && (
          <CommentBox
            autoFocus
            placeholder={`Reply to ${comment.author}`}
            onSend={async (body) => {
              await actions.reply.mutateAsync({ commentId: comment.id, body });
              setShowAll(true);
            }}
          />
        )}
      </div>
    </li>
  );
};

// The comments under a review and a box to add one.
const ReviewComments = ({ reviewId }: { reviewId: string }) => {
  const comments = useComments(reviewId, true);
  const actions = useCommentActions(reviewId);
  const list = comments.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="mt-3 space-y-3">
      {comments.isPending ? (
        <Loader2 className="size-4 animate-spin text-gray-400" aria-label="Loading comments" />
      ) : (
        list.length > 0 && (
          <ul className="space-y-3">
            {list.map((comment) => (
              <CommentThread key={comment.id} comment={comment} reviewId={reviewId} />
            ))}
          </ul>
        )
      )}
      {comments.hasNextPage && (
        <button
          type="button"
          onClick={() => comments.fetchNextPage()}
          disabled={comments.isFetchingNextPage}
          className="text-sm font-medium text-brand hover:text-brand-hover"
        >
          {comments.isFetchingNextPage ? 'Loading…' : 'More comments'}
        </button>
      )}
      <CommentBox
        placeholder="Write a comment"
        onSend={(body) => actions.comment.mutateAsync(body)}
      />
    </div>
  );
};

export default ReviewComments;
