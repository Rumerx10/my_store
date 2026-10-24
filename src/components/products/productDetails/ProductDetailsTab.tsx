import { useMemo, useState } from 'react';
import { BadgeCheck, Package, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IProduct } from '@/types/api_types';
import { categoryLabel } from '@/docs/navLinks';
import Rating from '@/components/shared/Rating';
import { descriptionToHtml } from '@/lib/richText';

interface ProductDetailsTabProps {
  product: IProduct;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const INITIAL_REVIEWS = 3;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export function ProductDetailsTab({ product, activeTab, setActiveTab }: ProductDetailsTabProps) {
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviews = product.reviews;

  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((stars) => {
        const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
        return { stars, count, percentage: reviews.length ? (count / reviews.length) * 100 : 0 };
      }),
    [reviews],
  );

  const filteredReviews =
    reviewFilter === 'all'
      ? reviews
      : reviews.filter((r) => Math.round(r.rating) === Number(reviewFilter));
  const visibleReviews = showAllReviews
    ? filteredReviews
    : filteredReviews.slice(0, INITIAL_REVIEWS);

  const { width, height, depth } = product.dimensions;
  const specifications: [string, string][] = [
    ['Brand', product.brand ?? 'Unbranded'],
    ['Model', product.sku],
    ...(product.specs ?? []),
    ['Category', categoryLabel(product.category)],
    ...(product.weight > 0 ? [['Weight', `${product.weight} kg`] as [string, string]] : []),
    ...(width > 0
      ? [['Dimensions', `${width} × ${height} × ${depth} cm`] as [string, string]]
      : []),
    ...(product.minimumOrderQuantity > 1
      ? [['Minimum order', `${product.minimumOrderQuantity} units`] as [string, string]]
      : []),
    ['Warranty', product.warrantyInformation],
    ['Availability', product.availabilityStatus],
  ];

  return (
    <section
      id="product-tabs"
      aria-label="Product information"
      className="scroll-mt-[calc(var(--header-h)+1rem)]"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & returns</TabsTrigger>
        </TabsList>

        <div className="mt-4 rounded-xl glass p-5 md:p-8">
          <TabsContent value="description" className="mt-0">
            <h2 className="text-lg text-gray-900 dark:text-slate-100">About this product</h2>
            <div
              className="rich-text mt-3 max-w-[70ch]"
              // Sanitised to the editor's own tags and attributes in descriptionToHtml.
              dangerouslySetInnerHTML={{ __html: descriptionToHtml(product.description) }}
            />
            {product.highlights && product.highlights.length > 0 && (
              <ul className="mt-5 grid gap-2 sm:grid-cols-2" aria-label="Highlights">
                {product.highlights.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300"
                  >
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
            {product.tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
                {product.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-gray-100 dark:bg-white/10 px-2.5 py-1 text-sm capitalize text-gray-700 dark:text-slate-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="specifications" className="mt-0">
            <h2 className="text-lg text-gray-900 dark:text-slate-100">Specifications</h2>
            <dl className="mt-4 grid gap-x-10 md:grid-cols-2">
              {specifications.map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between gap-6 border-b border-gray-100 dark:border-white/5 py-3 text-sm"
                >
                  <dt className="text-gray-500 dark:text-slate-400">{key}</dt>
                  <dd className="text-right font-medium text-gray-900 dark:text-slate-100">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            {reviews.length === 0 ? (
              <p className="text-gray-600 dark:text-slate-400">
                No reviews yet. Bought this product? Share what you think from My orders.
              </p>
            ) : (
              <>
                <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-14">
                  <div>
                    <h2 className="text-lg text-gray-900 dark:text-slate-100">Customer reviews</h2>
                    <p className="mt-3 text-5xl font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                      {product.rating.toFixed(1)}
                    </p>
                    <Rating value={product.rating} className="mt-2" />
                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                      Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                  <ul className="space-y-2 self-center" aria-label="Rating distribution">
                    {distribution.map((row) => (
                      <li key={row.stars} className="flex items-center gap-3 text-sm">
                        <span className="w-12 tabular-nums text-gray-700 dark:text-slate-300">
                          {row.stars} star
                        </span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                          <span
                            className="block h-full rounded-full bg-amber-400"
                            style={{ width: `${row.percentage}%` }}
                          />
                        </span>
                        <span className="w-6 text-right tabular-nums text-gray-500 dark:text-slate-400">
                          {row.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4 border-t border-gray-100 dark:border-white/5 pt-6">
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Showing {visibleReviews.length} of {filteredReviews.length}
                  </p>
                  <Select
                    value={reviewFilter}
                    onValueChange={(value) => {
                      setReviewFilter(value);
                      setShowAllReviews(false);
                    }}
                  >
                    <SelectTrigger className="w-40" aria-label="Filter reviews by rating">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All ratings</SelectItem>
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <SelectItem key={stars} value={String(stars)}>
                          {stars} {stars === 1 ? 'star' : 'stars'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {filteredReviews.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-600 dark:text-slate-400">
                    No reviews with this rating yet.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-gray-100 dark:divide-white/10">
                    {visibleReviews.map((review) => (
                      <li key={`${review.reviewerEmail}-${review.date}`} className="py-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-sm font-semibold text-brand-ink"
                            >
                              {review.reviewerName.charAt(0)}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                {review.reviewerName}
                              </p>
                              <p className="flex items-center gap-1 text-xs text-green">
                                <BadgeCheck className="size-3.5" aria-hidden="true" />
                                Verified purchase
                              </p>
                            </div>
                          </div>
                          <time
                            dateTime={review.date}
                            className="text-xs text-gray-500 dark:text-slate-400"
                          >
                            {formatDate(review.date)}
                          </time>
                        </div>
                        <Rating value={review.rating} className="mt-3" />
                        <p className="mt-2 text-[15px] text-gray-700 dark:text-slate-300">
                          {review.comment}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

                {filteredReviews.length > INITIAL_REVIEWS && (
                  <div className="mt-2 text-center">
                    <Button variant="outline" onClick={() => setShowAllReviews(!showAllReviews)}>
                      {showAllReviews
                        ? 'Show fewer reviews'
                        : `Show all ${filteredReviews.length} reviews`}
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="shipping" className="mt-0">
            <h2 className="text-lg text-gray-900 dark:text-slate-100">Shipping and returns</h2>
            <ul className="mt-5 grid gap-5 md:grid-cols-2">
              {[
                { icon: Truck, title: 'Delivery', text: product.shippingInformation },
                { icon: RotateCcw, title: 'Returns', text: product.returnPolicy },
                { icon: ShieldCheck, title: 'Warranty', text: product.warrantyInformation },
                {
                  icon: Package,
                  title: 'Packaging',
                  text: 'Returned items must be unused and in their original packaging.',
                },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-slate-100">{title}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
