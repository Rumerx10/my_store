'use client';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import ProductCardGrid from '@/components/products/ProductCardGrid';
import { selectStoreProducts } from '@/redux/selectors';

// Every in-stock product with a discount of 10% or more, biggest saving first.
const Deals = () => {
  const deals = useSelector(selectStoreProducts)
    .filter((product) => product.discountPercentage >= 10 && product.stock > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl text-gray-900 dark:text-slate-100 md:text-4xl">Deals</h1>
      <p className="mt-2 max-w-xl text-gray-600 dark:text-slate-400">
        {deals.length > 0
          ? `${deals.length} products marked down by 10% or more, while stock lasts.`
          : 'Nothing is on sale right now. New deals are added every week.'}
      </p>

      {deals.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
          {deals.map((product, index) => (
            <ProductCardGrid key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      ) : (
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Browse all products
        </Link>
      )}
    </div>
  );
};

export default Deals;
