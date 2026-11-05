'use client';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Copy, Plus, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ApiHomeSection } from '@/lib/api/types';
import { useCartActions } from '@/lib/query/cart';
import { useStoreProducts } from '@/lib/query/catalog';
import { toCartItem } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import type { IProduct } from '@/types/api_types';
import { homeImage } from './media';

type Combo = Extract<ApiHomeSection, { type: 'combo' }>;

// Products bought together for one price. The cart prices each product as usual; the coupon
// set with the combo is what brings the total down to the combo price at checkout.
const ComboOffer = ({ section }: { section: Combo }) => {
  const { data: catalog = [] } = useStoreProducts();
  const { addToCart } = useCartActions();
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState(false);

  // Products since deleted or hidden drop out; a combo needs two to make sense.
  const products = section.productIds
    .map((id) => catalog.find((product) => product.id === id))
    .filter((product): product is IProduct => Boolean(product));
  if (products.length < 2) return null;

  const regular = products.reduce((sum, product) => sum + product.price, 0);
  const saving = regular - section.comboPrice;
  const soldOut = products.filter((product) => product.stock <= 0);
  const headingId = `${section.id}-title`;

  const addAll = async () => {
    setAdding(true);
    for (const product of products) await addToCart(toCartItem(product), false);
    setAdding(false);
    toast.success(
      section.couponCode
        ? `Added the ${section.title} to your cart. Use code ${section.couponCode} at checkout.`
        : `Added the ${section.title} to your cart`,
    );
  };

  const copyCode = async () => {
    if (!section.couponCode) return;
    try {
      await navigator.clipboard.writeText(section.couponCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(`Couldn't copy. The code is ${section.couponCode}`);
    }
  };

  return (
    <section aria-labelledby={headingId} className="container mt-8 md:mt-12">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-6 rounded-3xl glass p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-10 md:p-8">
        {section.image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white dark:bg-slate-900">
            <Image
              {...homeImage(section.image.url)}
              alt={section.image.alt}
              fill
              sizes="(min-width: 768px) 640px, 100vw"
              className="object-cover"
            />
          </div>
        ) : (
          // The set itself: each product, joined by plus signs.
          <ul className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {products.map((product, index) => (
              <Fragment key={product.id}>
                {index > 0 && (
                  <li aria-hidden="true" className="text-gray-400 dark:text-slate-500">
                    <Plus className="size-5" />
                  </li>
                )}
                <li className="w-32 md:w-40">
                  <Link
                    href={`/next-power/products/${product.id}`}
                    className="group block rounded-2xl glass-card p-3 text-center"
                  >
                    <span className="relative mx-auto block aspect-square w-full">
                      <Image
                        src={product.thumbnail}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-contain transition-transform duration-500 ease-out-soft group-hover:scale-105"
                      />
                    </span>
                    <span className="mt-2 line-clamp-2 text-xs font-medium text-gray-900 dark:text-slate-100">
                      {product.title}
                    </span>
                  </Link>
                </li>
              </Fragment>
            ))}
          </ul>
        )}

        <div>
          {saving > 0 && (
            <p className="inline-flex rounded-full bg-sun-soft px-3 py-1 text-sm font-semibold text-sun-ink">
              Save {formatPrice(saving)}
            </p>
          )}
          <h2
            id={headingId}
            className="mt-3 text-2xl text-gray-900 dark:text-slate-100 md:text-3xl"
          >
            {section.title}
          </h2>
          {section.text && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400 md:text-base">
              {section.text}
            </p>
          )}

          <ul className="mt-4 space-y-1.5 text-sm">
            {products.map((product) => (
              <li key={product.id} className="flex items-baseline gap-2">
                <Check className="size-4 shrink-0 translate-y-0.5 text-hGreen" aria-hidden="true" />
                <Link
                  href={`/next-power/products/${product.id}`}
                  className="min-w-0 flex-1 truncate text-gray-800 hover:text-brand dark:text-slate-200"
                >
                  {product.title}
                </Link>
                <span className="tabular-nums text-gray-500 dark:text-slate-400">
                  {formatPrice(product.price)}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums">
            <span className="text-3xl font-semibold text-gray-900 dark:text-slate-100">
              {formatPrice(section.comboPrice)}
            </span>
            {saving > 0 && (
              <span className="text-gray-500 line-through dark:text-slate-400">
                {formatPrice(regular)}
              </span>
            )}
          </p>

          {section.couponCode && (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
              Use code
              <span className="rounded-md bg-gray-900 px-2 py-0.5 font-mono font-semibold tracking-wider text-white dark:bg-white dark:text-slate-900">
                {section.couponCode}
              </span>
              at checkout
              <button
                type="button"
                onClick={copyCode}
                aria-label={copied ? 'Code copied' : `Copy code ${section.couponCode}`}
                className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 font-medium text-brand hover:bg-brand-soft"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </p>
          )}

          <button
            type="button"
            onClick={addAll}
            disabled={adding || soldOut.length > 0}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand px-6 font-semibold text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60 sm:w-auto"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            {adding ? 'Adding…' : 'Add all to cart'}
          </button>
          {soldOut.length > 0 && (
            <p className="mt-2 text-sm text-red">
              Out of stock: {soldOut.map((product) => product.title).join(', ')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ComboOffer;
