'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { IProduct } from '@/types/api_types';
import { RootState } from '@/redux/store';
import { addToWishlist } from '@/redux/features/wishlist/wishlistSlice';
import { addToCart } from '@/redux/features/cart/cartSlice';
import { cn, formatPrice } from '@/lib/utils';
import {
  hasNotableDiscount,
  hasOptions,
  originalPrice,
  priceRange,
  toCartItem,
  toWishlistItem,
} from '@/lib/products';
import Rating from '../shared/Rating';

const ProductCardGrid = ({
  product,
  priority = false,
}: {
  product: IProduct;
  priority?: boolean;
}) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state: RootState) =>
    state.wishlist.items.some((item) => item.id === product.id),
  );
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const showDiscount = hasNotableDiscount(product);
  // Products with options are added from their page, where the options are chosen.
  const withOptions = hasOptions(product);
  const range = withOptions ? priceRange(product) : null;

  const handleAddToCart = () => {
    dispatch(addToCart(toCartItem(product)));
    toast.success(`Added to cart: ${product.title}`);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card transition-[box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/80 via-sky-50/70 to-amber-50/60 dark:from-slate-900/80 dark:via-sky-950/40 dark:to-amber-950/30">
        <Image
          src={product.thumbnail || product.images?.[0] || '/placeholder.svg'}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
          className="object-contain p-4 drop-shadow-md transition-transform duration-500 ease-out-soft group-hover:scale-[1.07]"
        />
        {showDiscount && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-sun px-2 py-0.5 text-xs font-bold tabular-nums text-gray-900 dark:text-slate-100 shadow-card">
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          type="button"
          onClick={() => dispatch(addToWishlist(toWishlistItem(product)))}
          aria-pressed={isWishlisted}
          aria-label={
            isWishlisted
              ? `Remove ${product.title} from wishlist`
              : `Save ${product.title} to wishlist`
          }
          className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-white/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-gray-600 dark:text-slate-400 shadow-card backdrop-blur-md transition-colors hover:text-red active:scale-95"
        >
          <Heart className={cn('size-[18px]', isWishlisted && 'fill-red text-red')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        {product.brand && (
          <p className="truncate text-xs font-medium text-gray-500 dark:text-slate-400">
            {product.brand}
          </p>
        )}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-gray-900 dark:text-slate-100 md:text-[15px]">
          {/* Stretched link: the whole card opens the product, buttons stay separate. */}
          <Link
            href={`/products/${product.id}`}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
          >
            {product.title}
          </Link>
        </h3>
        <Rating value={product.rating} />

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-1">
          {range && range.max > range.min && (
            <span className="text-xs text-gray-500 dark:text-slate-400">From</span>
          )}
          <span className="text-base font-semibold tabular-nums text-gray-900 dark:text-slate-100 md:text-lg">
            {formatPrice(product.price)}
          </span>
          {showDiscount && (
            <span className="text-xs tabular-nums text-gray-500 dark:text-slate-400 line-through">
              {formatPrice(originalPrice(product))}
            </span>
          )}
        </div>
        {lowStock && (
          <p className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300">
            <Flame className="size-3.5" aria-hidden="true" />
            Only {product.stock} left
          </p>
        )}

        {withOptions && !outOfStock ? (
          <Link
            href={`/products/${product.id}`}
            className="relative z-10 mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand px-3 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-white/15 disabled:text-gray-500 dark:disabled:text-slate-400"
          >
            Choose options
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="relative z-10 mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand px-3 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-white/15 disabled:text-gray-500 dark:disabled:text-slate-400"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            {outOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCardGrid;
