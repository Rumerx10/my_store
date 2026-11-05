'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useStoreProducts } from '@/lib/query/catalog';
import { useCategories } from '@/lib/query/shop';

// One tile per catalog category, illustrated with its best-rated product.
const CategoryGrid = ({ title }: { title: string }) => {
  const { data: products = [] } = useStoreProducts();
  const { data: categories = [] } = useCategories();
  const tiles = categories
    .filter((category) => category.isActive)
    .map((category) => {
      const items = products.filter((p) => p.category === category.slug);
      const cover = [...items].sort((a, b) => b.rating - a.rating)[0];
      return {
        category: category.slug,
        name: category.name,
        count: items.length,
        image: category.imageUrl ?? cover?.thumbnail,
      };
    })
    .filter((tile) => tile.count > 0);

  if (tiles.length === 0) return null;

  return (
    <section aria-labelledby="shop-by-category" className="container mt-8 md:mt-12">
      <div className="rounded-3xl glass p-4 md:p-8">
        <h2
          id="shop-by-category"
          className="mb-5 text-2xl text-gray-900 dark:text-slate-100 md:mb-6 md:text-3xl"
        >
          {title}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {tiles.map((tile) => (
            <li key={tile.category}>
              <Link
                href={`/next-power/products?category=${tile.category}`}
                className="group flex h-full flex-col items-center rounded-2xl glass-card p-3 text-center transition-[transform,translate,scale,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative aspect-square w-full">
                  {tile.image && (
                    <Image
                      src={tile.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 45vw"
                      className="object-contain p-2 drop-shadow-md transition-transform duration-500 ease-out-soft group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-slate-100">
                  {tile.name}
                </p>
                <p className="text-xs tabular-nums text-gray-500 dark:text-slate-400">
                  {tile.count} {tile.count === 1 ? 'product' : 'products'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CategoryGrid;
