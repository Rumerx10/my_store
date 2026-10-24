'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Rating from '@/components/shared/Rating';
import PageHeading from '../PageHeading';

interface MyReview {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
}

const INITIAL_REVIEWS: MyReview[] = [
  {
    id: 1,
    productId: 4,
    productName: 'GoodWe XS G3 Single-phase Inverter 3.3kW',
    productImage: 'https://en.goodwe.com/Public/Uploads/uploadfile/images/20240201/XS-G3-1.png',
    rating: 5,
    title: 'Silent and easy to monitor',
    content:
      'No fan noise at all, so it sits fine next to the stairs. The app shows generation every few minutes and the installers set it up in one afternoon.',
    date: '2 Oct 2026',
    helpful: 14,
  },
  {
    id: 2,
    productId: 1,
    productName: 'GoodWe Galaxy 570W Ultra-lightweight Solar Panel',
    productImage:
      'https://en.pvbm.com/Public/Uploads/uploadfile/images/20260327/Galaxy570FrontBack.png',
    rating: 4,
    title: 'Light enough for our tin roof',
    content:
      'Our roof could not take framed panels, these went on without extra steel. Output dips on hazy winter days, as expected.',
    date: '1 Oct 2026',
    helpful: 6,
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  const handleDelete = (review: MyReview) => {
    setReviews((prev) => prev.filter((r) => r.id !== review.id));
    toast.success(`Deleted your review of ${review.productName}`);
  };

  return (
    <div>
      <PageHeading
        title="My reviews"
        desc={`You've reviewed ${reviews.length} ${reviews.length === 1 ? 'product' : 'products'}.`}
      />

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 px-6 py-14 text-center">
          <Star className="mx-auto size-10 text-gray-300 dark:text-slate-600" aria-hidden="true" />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">No reviews yet</p>
          <Link
            href="/profile/to-review"
            className="mt-1 inline-block rounded text-sm font-medium text-brand hover:text-brand-hover"
          >
            See products waiting for your review
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-xl glass p-5 md:p-6">
              <div className="flex items-center gap-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5">
                  <Image
                    src={review.productImage}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${review.productId}`}
                    className="block truncate rounded font-medium text-gray-900 dark:text-slate-100 hover:underline"
                  >
                    {review.productName}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Rating value={review.rating} />
                    <span className="text-xs text-gray-500 dark:text-slate-400">{review.date}</span>
                  </div>
                </div>
              </div>

              <h3 className="mt-4 font-semibold text-gray-900 dark:text-slate-100">
                {review.title}
              </h3>
              <p className="mt-1 text-[15px] leading-relaxed text-gray-700 dark:text-slate-300">
                {review.content}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-white/5 pt-4">
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/products/${review.productId}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/15 px-3 text-sm font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(review)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/15 px-3 text-sm font-medium text-red transition-colors hover:bg-red/5"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews;
