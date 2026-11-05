'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import BackButton from '@/components/common/BackButton';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { MAX_QUANTITY_PER_ITEM, useCart, useCartActions } from '@/lib/query/cart';
import { useStoreProducts } from '@/lib/query/catalog';
import { formatPrice } from '@/lib/utils';
import PricingDetails from './PricingDetails';
import EmptyCart from './EmptyCart';

const Cart = () => {
  const { data: cart, isPending, error, refetch } = useCart();
  const { data: products = [] } = useStoreProducts();
  const { setQuantity, remove } = useCartActions();

  if (isPending) return <PageLoader label="Loading your cart" />;
  if (error) {
    return (
      <div className="container py-6 md:py-10">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }
  const cartItems = cart.items;
  if (cartItems.length === 0) return <EmptyCart />;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl">Your cart</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <BackButton href="/next-power/products">Continue shopping</BackButton>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <ul className="divide-y divide-gray-100 dark:divide-white/10 self-start rounded-xl glass">
          {cartItems.map((item) => {
            const productId = item.productId ?? item.id;
            const brand = products.find((p) => p.id === productId)?.brand;
            const maxQuantity = Math.min(
              MAX_QUANTITY_PER_ITEM,
              item.stock ?? MAX_QUANTITY_PER_ITEM,
            );
            return (
              <li key={item.id} className="flex gap-4 p-4 md:gap-5 md:p-5">
                <Link
                  href={`/next-power/products/${productId}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5 md:size-24"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    {brand && (
                      <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                        {brand}
                      </p>
                    )}
                    <h2 className="text-[15px] font-medium leading-snug text-gray-900 dark:text-slate-100">
                      <Link
                        href={`/next-power/products/${productId}`}
                        className="rounded hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h2>
                    {item.variant && (
                      <p className="mt-0.5 text-sm text-gray-600 dark:text-slate-400">
                        {item.variant}
                      </p>
                    )}
                    <p className="mt-1 text-sm tabular-nums text-gray-600 dark:text-slate-400">
                      {formatPrice(item.price)} each
                    </p>
                    {item.problem && (
                      <p role="alert" className="mt-1 text-sm font-medium text-red">
                        {item.problem}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div
                      role="group"
                      aria-label={`Quantity of ${item.title}`}
                      className="flex h-9 items-center rounded-lg border border-gray-300 dark:border-white/15"
                    >
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex size-9 items-center justify-center rounded-l-lg text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <output className="min-w-8 text-center text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </output>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= maxQuantity}
                        aria-label="Increase quantity"
                        className="flex size-9 items-center justify-center rounded-r-lg text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="flex size-9 items-center justify-center rounded-lg text-gray-400 dark:text-slate-500 transition-colors hover:bg-red/10 hover:text-red"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <PricingDetails />
      </div>
    </div>
  );
};

export default Cart;
