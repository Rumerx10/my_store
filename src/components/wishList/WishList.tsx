'use client';

import { useState, useMemo } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '@/components/ui/input';
import { RootState } from '@/redux/store';
import { clearWishlist } from '@/redux/features/wishlist/wishlistSlice';
import { addToCart } from '@/redux/features/cart/cartSlice';
import { toCartItem } from '@/lib/products';
import ProductCardGrid from '../products/ProductCardGrid';
import EmptyWhislist from './EmptyWhislist';

export default function Wishlist() {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const products = useSelector((state: RootState) => state.products);

  // Resolve saved items to full catalog products so the cards show live price and stock.
  const savedProducts = useMemo(
    () =>
      wishlistItems
        .map((item) => products.find((p) => p.id === item.id))
        .filter((p): p is (typeof products)[number] => Boolean(p)),
    [wishlistItems, products],
  );

  const visibleProducts = savedProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );
  const inStock = savedProducts.filter((p) => p.stock > 0);

  const handleAddAllToCart = () => {
    inStock.forEach((product) => dispatch(addToCart(toCartItem(product))));
    dispatch(clearWishlist());
    toast.success(
      `Moved ${inStock.length} ${inStock.length === 1 ? 'item' : 'items'} to your cart`,
    );
  };

  if (wishlistItems.length === 0) return <EmptyWhislist />;

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl">Wishlist</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
            {savedProducts.length} saved {savedProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-slate-500"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search your wishlist"
              aria-label="Search your wishlist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 bg-white dark:bg-slate-900 pl-9"
            />
          </div>
          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={inStock.length === 0}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            Add all to cart
          </button>
        </div>
      </div>

      {visibleProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCardGrid key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-sky-300 dark:border-sky-500/40 bg-white/55 dark:bg-slate-900/55 backdrop-blur-xl px-6 py-14 text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            Nothing in your wishlist matches “{searchQuery}”
          </h2>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 rounded text-sm font-medium text-brand hover:text-brand-hover"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
