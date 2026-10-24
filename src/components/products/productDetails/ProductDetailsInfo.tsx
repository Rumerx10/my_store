import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { IProduct } from '@/types/api_types';
import { addToCart, MAX_QUANTITY_PER_ITEM } from '@/redux/features/cart/cartSlice';
import { RootState } from '@/redux/store';
import { addToWishlist } from '@/redux/features/wishlist/wishlistSlice';
import { cn, formatPrice } from '@/lib/utils';
import {
  hasNotableDiscount,
  toCartItem,
  toWishlistItem,
  variantLabel,
  variantPrice,
  type OptionSelection,
} from '@/lib/products';
import { excerpt, htmlToText } from '@/lib/richText';
import Rating from '@/components/shared/Rating';
import VariantPicker from './VariantPicker';

interface ProductDetailsInfoProps {
  product: IProduct;
  quantity: number;
  setQuantity: (value: number) => void;
  selection: OptionSelection;
  onSelect: (optionName: string, valueLabel: string) => void;
  onShowReviews: () => void;
  onShowDescription: () => void;
}

export function ProductDetailsInfo({
  product,
  quantity,
  setQuantity,
  selection,
  onSelect,
  onShowReviews,
  onShowDescription,
}: ProductDetailsInfoProps) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector((state: RootState) =>
    state.wishlist.items.some((item) => item.id === product.id),
  );

  const outOfStock = product.stock === 0;
  const maxQuantity = Math.min(MAX_QUANTITY_PER_ITEM, product.stock);
  const showDiscount = hasNotableDiscount(product);
  const unitPrice = variantPrice(product, selection);
  const wasPrice = unitPrice / (1 - product.discountPercentage / 100);
  const summary = excerpt(product.description);
  const hasMore = summary.length < htmlToText(product.description).length;

  const handleAddToCart = () => {
    dispatch(addToCart(toCartItem(product, quantity, selection)));
    const variant = variantLabel(product, selection);
    toast.success(
      `Added ${quantity} × ${product.title}${variant ? ` (${variant})` : ''} to your cart`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        {product.brand && <p className="text-sm font-medium text-brand">{product.brand}</p>}
        <h1 className="mt-1 text-2xl leading-tight text-gray-900 dark:text-slate-100 md:text-3xl">
          {product.title}
        </h1>
        <button
          type="button"
          onClick={onShowReviews}
          className="mt-3 rounded transition-opacity hover:opacity-80"
        >
          <Rating value={product.rating} count={product.reviews.length} size="md" />
        </button>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-semibold tabular-nums text-gray-900 dark:text-slate-100">
            {formatPrice(unitPrice)}
          </span>
          {showDiscount && (
            <>
              <span className="text-base tabular-nums text-gray-400 dark:text-slate-500 line-through">
                {formatPrice(wasPrice)}
              </span>
              <span className="rounded-md bg-red/10 px-2 py-0.5 text-sm font-semibold text-red">
                Save {Math.round(product.discountPercentage)}%
              </span>
            </>
          )}
        </div>
        <p
          className={cn(
            'mt-2 text-sm font-medium',
            outOfStock
              ? 'text-red'
              : product.stock <= 10
                ? 'text-amber-700 dark:text-amber-300'
                : 'text-green',
          )}
        >
          {outOfStock
            ? 'Out of stock'
            : product.stock <= 10
              ? `Only ${product.stock} left in stock`
              : 'In stock'}
        </p>
      </div>

      {summary && (
        <p className="text-[15px] leading-relaxed text-gray-700 dark:text-slate-300">
          {summary}{' '}
          {hasMore && (
            <button
              type="button"
              onClick={onShowDescription}
              className="rounded font-medium text-brand underline underline-offset-2 hover:no-underline"
            >
              Read the full description
            </button>
          )}
        </p>
      )}

      <VariantPicker product={product} selection={selection} onChange={onSelect} />

      {!outOfStock && (
        <div>
          <p
            id="quantity-label"
            className="mb-2 text-sm font-semibold text-gray-900 dark:text-slate-100"
          >
            Quantity
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div
              role="group"
              aria-labelledby="quantity-label"
              className="flex h-11 items-center rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex size-11 items-center justify-center rounded-l-lg text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>
              <output
                aria-live="polite"
                className="min-w-10 text-center font-semibold tabular-nums"
              >
                {quantity}
              </output>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= maxQuantity}
                aria-label="Increase quantity"
                className="flex size-11 items-center justify-center rounded-r-lg text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Subtotal{' '}
              <span className="font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                {formatPrice(unitPrice * quantity)}
              </span>
              <span className="block text-xs text-gray-500 dark:text-slate-400">
                Max {maxQuantity} per order
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-[15px] font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-white/15 disabled:text-gray-500 dark:disabled:text-slate-400"
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </button>
        <button
          type="button"
          onClick={() => dispatch(addToWishlist(toWishlistItem(product)))}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 transition-colors hover:border-red/40 hover:text-red active:scale-95"
        >
          <Heart className={cn('size-5', isWishlisted && 'fill-red text-red')} />
        </button>
      </div>
    </div>
  );
}
