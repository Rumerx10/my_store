'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ClipboardCheck, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn, formatPrice } from '@/lib/utils';
import { formatOrderDate } from '@/lib/utils';
import PageHeading from '../PageHeading';

const ToReview = () => {
  const orders = useSelector((state: RootState) => state.orderlist.orders);
  const [reviewedIds, setReviewedIds] = useState<Array<string | number>>([]);
  const [reviewingId, setReviewingId] = useState<string | number | null>(null);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  // Every item from a delivered order that hasn't been reviewed yet.
  const pending = useMemo(
    () =>
      orders
        .filter((order) => order.status === 'delivered')
        .flatMap((order) => order.items.map((item) => ({ ...item, deliveredOn: order.date })))
        .filter((item) => !reviewedIds.includes(item.productId)),
    [orders, reviewedIds],
  );

  const startReview = (productId: string | number) => {
    setReviewingId(productId);
    setRating(0);
    setTitle('');
    setContent('');
    setError('');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Choose a star rating before submitting.');
      return;
    }
    if (content.trim().length < 10) {
      setError('Write at least a sentence about the product.');
      return;
    }
    setReviewedIds((prev) => [...prev, reviewingId as string | number]);
    setReviewingId(null);
    toast.success('Thanks, your review is published');
  };

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
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <ClipboardCheck className="mx-auto size-10 text-gray-300" aria-hidden="true" />
          <p className="mt-3 font-medium text-gray-900">You&apos;re all caught up</p>
          <Link
            href="/profile/reviews"
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
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  <Image src={item.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/products/${item.productId}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm tabular-nums text-gray-700">{formatPrice(item.price)}</p>
                  <p className="text-xs text-gray-500">Delivered {formatOrderDate(item.deliveredOn)}</p>
                </div>
              </div>

              {reviewingId === item.productId ? (
                <form onSubmit={handleSubmitReview} noValidate className="mt-5 space-y-4 border-t border-gray-100 pt-5">
                  <fieldset>
                    <legend className="text-sm font-medium text-gray-900">Your rating</legend>
                    <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          role="radio"
                          aria-checked={rating === star}
                          aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
                          onClick={() => {
                            setRating(star);
                            setError('');
                          }}
                          className="rounded p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            className={cn(
                              'size-7',
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300',
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div>
                    <Label htmlFor={`title-${item.productId}`} className="text-sm font-medium text-gray-900">
                      Headline <span className="font-normal text-gray-500">(optional)</span>
                    </Label>
                    <Input
                      id={`title-${item.productId}`}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sum it up in a few words"
                      className="mt-1.5 h-11"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`content-${item.productId}`} className="text-sm font-medium text-gray-900">
                      Review
                    </Label>
                    <Textarea
                      id={`content-${item.productId}`}
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        setError('');
                      }}
                      placeholder="What did you like or dislike? How did you use it?"
                      className="mt-1.5 min-h-28"
                    />
                  </div>
                  {error && (
                    <p role="alert" className="text-sm text-red">
                      {error}
                    </p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="h-11 flex-1 rounded-lg bg-brand font-medium text-white transition-colors hover:bg-brand-hover"
                    >
                      Publish review
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewingId(null)}
                      className="h-11 flex-1 rounded-lg border border-gray-300 font-medium text-gray-900 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => startReview(item.productId)}
                  className="mt-5 h-10 w-full rounded-lg border border-gray-300 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
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
