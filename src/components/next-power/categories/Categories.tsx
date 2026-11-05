'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { useStoreProducts } from '@/lib/query/catalog';
import { useCategories } from '@/lib/query/shop';

// One card per catalog category, illustrated with its best-rated product.
const Categories = () => {
  const productsQuery = useStoreProducts();
  const categoriesQuery = useCategories();
  if (productsQuery.isPending || categoriesQuery.isPending) return <PageLoader />;
  if (!productsQuery.data || !categoriesQuery.data) {
    return (
      <div className="container py-8 md:py-12">
        <ErrorState
          error={productsQuery.error ?? categoriesQuery.error}
          onRetry={() => {
            productsQuery.refetch();
            categoriesQuery.refetch();
          }}
        />
      </div>
    );
  }
  const products = productsQuery.data;
  const categories = categoriesQuery.data
    .filter((category) => category.isActive)
    .map((category) => {
      const items = products.filter((product) => product.category === category.slug);
      const cover = [...items].sort((a, b) => b.rating - a.rating)[0];
      return {
        category: category.slug,
        name: category.name,
        blurb: category.description,
        count: items.length,
        image: category.imageUrl ?? (cover?.thumbnail || '/placeholder.svg'),
      };
    })
    .filter((category) => category.count > 0);

  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl text-gray-900 dark:text-slate-100 md:text-4xl">Categories</h1>
      <p className="mt-2 text-gray-600 dark:text-slate-400">
        Pick a category to see everything in it.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
        {categories.map(({ category, name, blurb, count, image }, index) => (
          <li key={category}>
            <Link
              href={`/next-power/products?category=${category}`}
              className="group flex h-full items-center gap-4 rounded-xl glass p-4 transition-colors hover:border-gray-300 dark:hover:border-white/15 lg:flex-col lg:items-start lg:p-5"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5 lg:aspect-[4/3] lg:size-auto lg:w-full">
                <Image
                  src={image}
                  alt=""
                  fill
                  priority={index < 4}
                  sizes="(min-width: 1024px) 260px, 80px"
                  className="object-contain p-2 transition-transform duration-500 ease-out-soft group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-semibold text-gray-900 dark:text-slate-100">
                  {name}
                  <ArrowRight
                    className="size-4 text-gray-400 dark:text-slate-500 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </p>
                {blurb && (
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-slate-400">{blurb}</p>
                )}
                <p className="mt-1 text-xs tabular-nums text-gray-500 dark:text-slate-400">
                  {count} {count === 1 ? 'product' : 'products'}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
