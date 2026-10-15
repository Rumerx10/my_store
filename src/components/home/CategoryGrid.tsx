'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { CATEGORY_INFO, categoryLabel } from '@/docs/navLinks';
import { selectStoreProducts } from '@/redux/selectors';

// One tile per catalog category, illustrated with its best-rated product.
const CategoryGrid = () => {
  const products = useSelector(selectStoreProducts);
  const tiles = Object.keys(CATEGORY_INFO)
    .map((category) => {
      const items = products.filter((p) => p.category === category);
      const cover = [...items].sort((a, b) => b.rating - a.rating)[0];
      return { category, count: items.length, image: cover?.thumbnail };
    })
    .filter((tile) => tile.count > 0);

  return (
    <section aria-labelledby="shop-by-category" className="container mt-8 md:mt-12">
      <div className="rounded-3xl glass p-4 md:p-8">
        <h2 id="shop-by-category" className="mb-5 text-2xl text-gray-900 md:mb-6 md:text-3xl">
          Shop by category
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {tiles.map((tile) => (
            <li key={tile.category}>
              <Link
                href={`/products?category=${tile.category}`}
                className="group flex h-full flex-col items-center rounded-2xl glass-card p-3 text-center transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lift"
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
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {categoryLabel(tile.category)}
                </p>
                <p className="text-xs tabular-nums text-gray-500">
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
