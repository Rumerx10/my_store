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
import { hasNotableDiscount, originalPrice, toCartItem, toWishlistItem } from '@/lib/products';
import Rating from '../shared/Rating';

const ProductCardGrid = ({ product, priority = false }: { product: IProduct; priority?: boolean }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state: RootState) =>
    state.wishlist.items.some((item) => item.id === product.id),
  );
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const showDiscount = hasNotableDiscount(product);

  const handleAddToCart = () => {
    dispatch(addToCart(toCartItem(product)));
    toast.success(`Added to cart: ${product.title}`);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card transition-[box-shadow,transform] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white via-rose-50/60 to-violet-50/70">
        <Image
          src={product.thumbnail || product.images?.[0] || '/placeholder.svg'}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
          className="object-contain p-4 drop-shadow-md transition-transform duration-500 ease-out-soft group-hover:scale-[1.07]"
        />
        {showDiscount && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2 py-0.5 text-xs font-semibold tabular-nums text-white shadow-card">
            −{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          type="button"
          onClick={() => dispatch(addToWishlist(toWishlistItem(product)))}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Save ${product.title} to wishlist`}
          className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-white/80 bg-white/70 text-gray-600 shadow-card backdrop-blur-md transition-colors hover:text-red active:scale-95"
        >
          <Heart className={cn('size-[18px]', isWishlisted && 'fill-red text-red')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        {product.brand && (
          <p className="truncate text-xs font-medium text-gray-500">{product.brand}</p>
        )}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-gray-900 md:text-[15px]">
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
          <span className="text-base font-semibold tabular-nums text-gray-900 md:text-lg">
            {formatPrice(product.price)}
          </span>
          {showDiscount && (
            <span className="text-xs tabular-nums text-gray-500 line-through">
              {formatPrice(originalPrice(product))}
            </span>
          )}
        </div>
        {lowStock && (
          <p className="flex items-center gap-1 text-xs font-medium text-amber-700">
            <Flame className="size-3.5" aria-hidden="true" />
            Only {product.stock} left
          </p>
        )}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="relative z-10 mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand px-3 text-sm font-semibold text-white transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          <ShoppingCart className="size-4" aria-hidden="true" />
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
};

export default ProductCardGrid;
