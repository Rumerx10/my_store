'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  increaseQuantityInCart,
  MAX_QUANTITY_PER_ITEM,
  reduceQuantityFromCart,
  removeFromCart,
} from '@/redux/features/cart/cartSlice';
import { formatPrice } from '@/lib/utils';
import PricingDetails from './PricingDetails';
import EmptyCart from './EmptyCart';

const Cart = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();

  if (cartItems.length === 0) return <EmptyCart />;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 md:text-3xl">Your cart</h1>
          <p className="mt-1 text-sm text-gray-600">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded text-sm font-medium text-brand transition-colors hover:text-brand-hover"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Continue shopping
        </Link>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <ul className="divide-y divide-gray-100 self-start rounded-xl glass">
          {cartItems.map((item) => {
            const brand = products.find((p) => p.id === item.id)?.brand;
            return (
              <li key={item.id} className="flex gap-4 p-4 md:gap-5 md:p-5">
                <Link
                  href={`/products/${item.id}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 md:size-24"
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
                    {brand && <p className="text-xs font-medium text-gray-500">{brand}</p>}
                    <h2 className="text-[15px] font-medium leading-snug text-gray-900">
                      <Link href={`/products/${item.id}`} className="rounded hover:underline">
                        {item.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm tabular-nums text-gray-600">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div
                      role="group"
                      aria-label={`Quantity of ${item.title}`}
                      className="flex h-9 items-center rounded-lg border border-gray-300"
                    >
                      <button
                        type="button"
                        onClick={() => dispatch(reduceQuantityFromCart(item.id))}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="flex size-9 items-center justify-center rounded-l-lg text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <output className="min-w-8 text-center text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </output>
                      <button
                        type="button"
                        onClick={() => dispatch(increaseQuantityInCart(item.id))}
                        disabled={item.quantity >= MAX_QUANTITY_PER_ITEM}
                        aria-label="Increase quantity"
                        className="flex size-9 items-center justify-center rounded-r-lg text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.id))}
                        aria-label={`Remove ${item.title} from cart`}
                        className="flex size-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red/10 hover:text-red"
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
