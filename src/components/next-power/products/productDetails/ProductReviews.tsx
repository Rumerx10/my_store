'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import Rating from '@/components/common/Rating';
import { ErrorState } from '@/components/common/QueryState';
import ReviewComments from '@/components/common/reviews/ReviewComments';
import ReviewForm from '@/components/common/reviews/ReviewForm';
import ReviewPhotos from '@/components/common/reviews/ReviewPhotos';
import { formatReviewDate } from '@/components/common/reviews/reviewDates';
import type { ApiReview } from '@/lib/api/types';
import { useProductReviews, useReviewActions, useToReview } from '@/lib/query/reviews';
import { useSession } from '@/lib/query/session';

const ReviewItem = ({ review }: { review: ApiReview }) => {
  const [open, setOpen] = useState(false);
  const count = review.commentCount;

  return (
    <li className="py-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand"
        >
          {review.author.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 dark:text-slate-100">{review.author}</p>
          <time dateTime={review.createdAt} className="text-xs text-gray-500 dark:text-slate-400">
            {formatReviewDate(review.createdAt)}
          </time>
        </div>
      </div>
      <Rating value={review.rating} className="mt-3" />
      {review.title && (
        <p className="mt-2 font-semibold text-gray-900 dark:text-slate-100">{review.title}</p>
      )}
      <p className="mt-1 whitespace-pre-line break-words text-gray-700 dark:text-slate-300">
        {review.comment}
      </p>
      <ReviewPhotos images={review.images} />
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-brand dark:text-slate-400"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        {count > 0 ? `${count} ${count === 1 ? 'comment' : 'comments'}` : 'Comment'}
      </button>
      {open && <ReviewComments reviewId={review.id} />}
    </li>
  );
};

// Writing a review is for customers whose order with this product was delivered.
const WriteReview = ({ productId }: { productId: string }) => {
  const { user } = useSession();
  const { data: toReview } = useToReview();
  const { create } = useReviewActions();
  const [writing, setWriting] = useState(false);

  if (!user) {
    return (
      <p className="text-sm text-gray-600 dark:text-slate-400">
        <Link href="/next-power/login" className="font-medium text-brand hover:text-brand-hover">
          Sign in
        </Link>{' '}
        to review a product you bought.
      </p>
    );
  }
  if (!toReview?.some((item) => item.productId === productId)) return null;

  return writing ? (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
      <p className="mb-3 font-semibold text-gray-900 dark:text-slate-100">Write a review</p>
      <ReviewForm
        onCancel={() => setWriting(false)}
        onSubmit={async (input) => {
          await create.mutateAsync({ productId, ...input });
          toast.success('Thanks! Your review is posted.');
          setWriting(false);
        }}
      />
    </div>
  ) : (
    <Button variant="outline" onClick={() => setWriting(true)}>
      Write a review
    </Button>
  );
};

// The product's reviews from the API: star summary, photos, and comment threads under each.
const ProductReviews = ({ productId }: { productId: string }) => {
  const reviews = useProductReviews(productId);

  if (reviews.isPending) {
    return <Loader2 className="size-5 animate-spin text-gray-400" aria-label="Loading reviews" />;
  }
  if (reviews.error) {
    return <ErrorState error={reviews.error} onRetry={() => reviews.refetch()} />;
  }

  const { summary } = reviews.data.pages[0];
  const list = reviews.data.pages.flatMap((page) => page.data);
  const average = Number(summary.ratingAvg);

  return (
    <div className="space-y-6">
      {summary.ratingCount > 0 ? (
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-14">
          <div>
            <h2 className="text-lg text-gray-900 dark:text-slate-100">Customer reviews</h2>
            <p className="mt-3 text-4xl font-semibold tabular-nums text-gray-900 dark:text-slate-100">
              {average.toFixed(1)}
            </p>
            <Rating value={average} className="mt-1" />
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Based on {summary.ratingCount} {summary.ratingCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          <ul className="space-y-2 self-center" aria-label="Ratings by stars">
            {(['5', '4', '3', '2', '1'] as const).map((stars) => {
              const count = summary.distribution[stars] ?? 0;
              return (
                <li key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-gray-600 dark:text-slate-400">{stars} star</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                    <span
                      className="block h-full rounded-full bg-amber-400"
                      style={{ width: `${(count / summary.ratingCount) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 text-right tabular-nums text-gray-500 dark:text-slate-400">
                    {count}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-slate-400">
          No reviews yet. Bought this product? Be the first to share what you think.
        </p>
      )}

      <WriteReview productId={productId} />

      {list.length > 0 && (
        <ul className="divide-y divide-gray-100 dark:divide-white/10">
          {list.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </ul>
      )}
      {reviews.hasNextPage && (
        <Button
          variant="outline"
          disabled={reviews.isFetchingNextPage}
          onClick={() => reviews.fetchNextPage()}
        >
          {reviews.isFetchingNextPage ? 'Loading…' : 'Show more reviews'}
        </Button>
      )}
    </div>
  );
};

export default ProductReviews;
