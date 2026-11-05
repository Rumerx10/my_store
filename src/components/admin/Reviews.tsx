'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { absoluteUrl } from '@/lib/api/client';
import Rating from '@/components/common/Rating';
import type { ApiReview } from '@/lib/api/types';
import PageHeading from '@/components/common/PageHeading';
import { useStorefrontUrl } from '@/components/admin/adminStore';
import ReviewPhotos from '@/components/common/reviews/ReviewPhotos';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import ReviewComments from '@/components/common/reviews/ReviewComments';
import { Eye, EyeOff, MessageCircle, Star, Trash2 } from 'lucide-react';
import { formatReviewDate } from '@/components/common/reviews/reviewDates';
import { useReviewModeration, useStoreReviews, type ReviewFilter } from '@/lib/query/admin';

const FILTERS: { value: ReviewFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
];

const ReviewCard = ({ review }: { review: ApiReview }) => {
  const storefront = useStorefrontUrl();
  const { setPublished, remove } = useReviewModeration();
  const [open, setOpen] = useState(false);

  return (
    <li className={cn('rounded-xl glass p-5', !review.isPublished && 'opacity-75')}>
      <div className="flex items-start gap-4">
        <Link
          href={storefront(`/products/${review.productId}`)}
          className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5"
          aria-label={`Open ${review.product.title}`}
        >
          <Image
            src={
              review.product.thumbnail ? absoluteUrl(review.product.thumbnail) : '/placeholder.svg'
            }
            alt=""
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={storefront(`/products/${review.productId}`)}
            className="block truncate text-sm font-medium text-gray-900 hover:underline dark:text-slate-100"
          >
            {review.product.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-slate-400">
            <Rating value={review.rating} />
            <span>{review.author}</span>
            <span>{formatReviewDate(review.createdAt)}</span>
            {!review.isPublished && (
              <span className="rounded-full bg-gray-200 px-2 py-0.5 font-medium text-gray-700 dark:bg-white/15 dark:text-slate-200">
                Hidden from the store
              </span>
            )}
          </div>
        </div>
      </div>

      {review.title && (
        <p className="mt-3 font-semibold text-gray-900 dark:text-slate-100">{review.title}</p>
      )}
      <p className="mt-1 whitespace-pre-line break-words text-sm text-gray-700 dark:text-slate-300">
        {review.comment}
      </p>
      <ReviewPhotos images={review.images} />

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-white/5">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="mr-auto inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand dark:text-slate-400"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          {review.commentCount} {review.commentCount === 1 ? 'comment' : 'comments'}
        </button>
        <button
          type="button"
          disabled={setPublished.isPending}
          onClick={() =>
            setPublished.mutate(
              { id: review.id, isPublished: !review.isPublished },
              {
                onSuccess: () =>
                  toast.success(review.isPublished ? 'Review hidden' : 'Review published'),
              },
            )
          }
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5"
        >
          {review.isPublished ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
          {review.isPublished ? 'Hide' : 'Publish'}
        </button>
        <button
          type="button"
          disabled={remove.isPending}
          onClick={() => {
            if (window.confirm('Delete this review and its comments? This can’t be undone.')) {
              remove.mutate(review.id, { onSuccess: () => toast.success('Review deleted') });
            }
          }}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red/30 px-3 text-sm font-medium text-red hover:bg-red/5 disabled:opacity-60"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </button>
      </div>
      {open && <ReviewComments reviewId={review.id} />}
    </li>
  );
};

// Every review of the store's products, newest first. Hidden reviews don't count towards the
// product's rating; comments can be answered (as the store) or hidden one by one.
const Reviews = () => {
  const [filter, setFilter] = useState<ReviewFilter>('all');
  const query = useStoreReviews(filter);

  return (
    <div>
      <PageHeading title="Reviews" desc="What customers say, and the conversations under it." />
      <div role="radiogroup" aria-label="Show" className="mb-4 flex gap-1">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={filter === option.value}
            onClick={() => setFilter(option.value)}
            className={cn(
              'h-9 rounded-full px-4 text-sm font-medium transition-colors',
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
        <PageLoader label="Loading reviews" />
      ) : query.error ? (
        <ErrorState error={query.error} onRetry={() => query.refetch()} />
      ) : query.reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 backdrop-blur-sm bg-white/30 px-6 py-14 text-center dark:border-white/15 dark:bg-slate-900">
          <Star className="mx-auto size-10 text-gray-300 dark:text-slate-600" aria-hidden="true" />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">No reviews here</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {query.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
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

export default Reviews;
