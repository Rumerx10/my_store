import Link from 'next/link';
import { Heart } from 'lucide-react';

const EmptyWhislist = () => {
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl glass px-6 py-10 text-center md:px-10">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-sun-soft text-sun-ink">
          <Heart className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl text-gray-900 md:text-3xl">Your wishlist is empty</h1>
        <p className="mt-2 text-gray-600">
          Tap the heart on any product to save it here and come back to it later.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-brand px-6 font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98]"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
};

export default EmptyWhislist;
