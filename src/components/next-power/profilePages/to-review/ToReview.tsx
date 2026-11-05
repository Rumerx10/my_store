'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClipboardCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import ReviewForm from '@/components/common/reviews/ReviewForm';
import { absoluteUrl } from '@/lib/api/client';
import { useReviewActions, useToReview } from '@/lib/query/reviews';
import { formatOrderDate } from '@/lib/utils';
import PageHeading from '@/components/common/PageHeading';

// Delivered products the customer hasn't reviewed yet, each with its own review form.
const ToReview = () => {
  const { data: pending = [], isPending, error, refetch } = useToReview();
  const { create } = useReviewActions();
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  if (isPending) return <PageLoader label="Loading your delivered products" />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeading
        title="To review"
        desc={
          pending.length > 0
            ? `${pending.length} delivered ${pending.length === 1 ? 'product is' : 'products are'} waiting for your review.`
            : 'Products from delivered orders show up here.'
        }
      />

      {pending.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 px-6 py-14 text-center">
          <ClipboardCheck
            className="mx-auto size-10 text-gray-300 dark:text-slate-600"
            aria-hidden="true"
          />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">
            You&apos;re all caught up
          </p>
          <Link
            href="/next-power/profile/reviews"
            className="mt-1 inline-block rounded text-sm font-medium text-brand hover:text-brand-hover"
          >
            See your reviews
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {pending.map((item) => (
            <li key={item.productId} className="rounded-xl glass p-5">
              <div className="flex gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5">
                  <Image
                    src={item.imageUrl ? absoluteUrl(item.imageUrl) : '/placeholder.svg'}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/next-power/products/${item.productId}`}
                    className="font-medium text-gray-900 dark:text-slate-100 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Ordered {formatOrderDate(item.orderedAt)}
                  </p>
                </div>
              </div>

              {reviewingId === item.productId ? (
                <div className="mt-5 border-t border-gray-100 pt-5 dark:border-white/5">
                  <ReviewForm
                    submitLabel="Publish review"
                    onCancel={() => setReviewingId(null)}
                    onSubmit={async (input) => {
                      await create.mutateAsync({ productId: item.productId, ...input });
                      setReviewingId(null);
                      toast.success('Thanks, your review is published');
                    }}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setReviewingId(item.productId)}
                  className="mt-5 h-10 w-full rounded-lg border border-gray-300 dark:border-white/15 text-sm font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Write a review
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToReview;
