'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EyeOff, MessageCircle, Pencil, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Rating from '@/components/common/Rating';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import ReviewForm from '@/components/common/reviews/ReviewForm';
import ReviewPhotos from '@/components/common/reviews/ReviewPhotos';
import { formatReviewDate } from '@/components/common/reviews/reviewDates';
import { absoluteUrl } from '@/lib/api/client';
import type { ApiReview } from '@/lib/api/types';
import { useMyReviews, useReviewActions } from '@/lib/query/reviews';
import PageHeading from '@/components/common/PageHeading';

const MyReview = ({ review }: { review: ApiReview }) => {
  const [editing, setEditing] = useState(false);
  const { update, remove } = useReviewActions();
  const productHref = `/next-power/products/${review.productId}`;

  const handleDelete = () => {
    if (!window.confirm(`Delete your review of ${review.product.title}?`)) return;
    remove.mutate(
      { id: review.id, productId: review.productId },
      { onSuccess: () => toast.success(`Deleted your review of ${review.product.title}`) },
    );
  };

  return (
    <li className="rounded-xl glass p-5 md:p-6">
      <div className="flex items-center gap-4">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5">
          <Image
            src={
              review.product.thumbnail ? absoluteUrl(review.product.thumbnail) : '/placeholder.svg'
            }
            alt=""
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={productHref}
            className="block truncate rounded font-medium text-gray-900 dark:text-slate-100 hover:underline"
          >
            {review.product.title}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <Rating value={review.rating} />
            <span className="text-xs text-gray-500 dark:text-slate-400">
              {formatReviewDate(review.createdAt)}
            </span>
            {!review.isPublished && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-slate-300">
                <EyeOff className="size-3" aria-hidden="true" />
                Hidden by the store
              </span>
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-white/5">
          <ReviewForm
            initial={{
              rating: review.rating,
              title: review.title ?? '',
              comment: review.comment,
              images: review.images,
            }}
            submitLabel="Save changes"
            onCancel={() => setEditing(false)}
            onSubmit={async (input) => {
              await update.mutateAsync({ id: review.id, ...input });
              toast.success('Review updated');
              setEditing(false);
            }}
          />
        </div>
      ) : (
        <>
          {review.title && (
            <h3 className="mt-4 font-semibold text-gray-900 dark:text-slate-100">{review.title}</h3>
          )}
          <p className="mt-1 whitespace-pre-line break-words text-[15px] leading-relaxed text-gray-700 dark:text-slate-300">
            {review.comment}
          </p>
          <ReviewPhotos images={review.images} />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-white/5 pt-4">
            <Link
              href={productHref}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand dark:text-slate-400"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              {review.commentCount} {review.commentCount === 1 ? 'comment' : 'comments'}
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/15 px-3 text-sm font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={remove.isPending}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/15 px-3 text-sm font-medium text-red transition-colors hover:bg-red/5 disabled:opacity-50"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </li>
  );
};

// The customer's own reviews: edit the words, stars and photos, or delete them.
const Reviews = () => {
  const query = useMyReviews();
  const reviews = query.data?.pages.flatMap((page) => page.data) ?? [];

  if (query.isPending) return <PageLoader label="Loading your reviews" />;
  if (query.error) return <ErrorState error={query.error} onRetry={() => query.refetch()} />;

  return (
    <div>
      <PageHeading
        title="My reviews"
        desc={
          reviews.length > 0
            ? `You've reviewed ${reviews.length}${query.hasNextPage ? '+' : ''} ${reviews.length === 1 ? 'product' : 'products'}.`
            : 'Reviews you write show up here.'
        }
      />

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 px-6 py-14 text-center">
          <Star className="mx-auto size-10 text-gray-300 dark:text-slate-600" aria-hidden="true" />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">No reviews yet</p>
          <Link
            href="/next-power/profile/to-review"
            className="mt-1 inline-block rounded text-sm font-medium text-brand hover:text-brand-hover"
          >
            See products waiting for your review
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <MyReview key={review.id} review={review} />
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
          {query.isFetchingNextPage ? 'Loading…' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default Reviews;
