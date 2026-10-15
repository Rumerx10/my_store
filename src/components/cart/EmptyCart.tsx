import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

const EmptyCart = () => {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl glass px-6 py-10 text-center md:px-10">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <ShoppingBag className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl text-gray-900 md:text-3xl">Your cart is empty</h1>
        <p className="mt-2 text-gray-600">
          Add products to your cart and they&apos;ll show up here, ready for checkout.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-brand px-6 font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98]"
          >
            Browse products
          </Link>
          <Link
            href="/wish-list"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 font-medium text-gray-900 transition-colors hover:bg-gray-50"
          >
            View wishlist
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
