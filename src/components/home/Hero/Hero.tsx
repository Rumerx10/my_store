'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgePercent } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CATEGORY_INFO, categoryLabel } from '@/docs/navLinks';
import { SITE } from '@/docs/site';

// One tint per tile, cycled if more categories are added.
const TILE_TINTS = [
  'from-rose-200/90 to-pink-100/70',
  'from-violet-200/90 to-fuchsia-100/70',
  'from-amber-200/90 to-orange-100/70',
  'from-emerald-200/90 to-teal-100/70',
];

const Hero = () => {
  const products = useSelector((state: RootState) => state.products);
  const dealCount = products.filter((p) => p.discountPercentage >= 10 && p.stock > 0).length;
  const topDiscount = Math.round(Math.max(0, ...products.map((p) => p.discountPercentage)));

  // One tile per catalog category, illustrated with its best-rated product.
  const tiles = Object.keys(CATEGORY_INFO).map((category) => {
    const items = products.filter((p) => p.category === category);
    const cover = [...items].sort((a, b) => b.rating - a.rating)[0];
    return { category, count: items.length, image: cover?.thumbnail ?? '/placeholder.svg' };
  });

  return (
    <section aria-labelledby="hero-title" className="container pt-6 md:pt-10">
      <div className="relative overflow-hidden rounded-3xl glass p-6 md:p-10 lg:p-12">
        {/* Soft colour glows behind the glass content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-28 size-80 rounded-full bg-rose-400/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-0 size-96 rounded-full bg-violet-400/30 blur-3xl"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div>
            {dealCount > 0 && (
              <Link
                href="/deals"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-sm font-medium text-brand-ink shadow-card backdrop-blur-md transition-colors hover:bg-white"
              >
                <BadgePercent className="size-4 shrink-0 text-brand" aria-hidden="true" />
                Up to {topDiscount}% off on {dealCount} products
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
              </Link>
            )}
            <h1
              id="hero-title"
              className="mt-4 text-4xl leading-[1.08] text-gray-900 md:text-5xl lg:text-[3.5rem]"
            >
              Everyday essentials, <span className="text-gradient">at your door.</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-700 md:text-lg">
              {SITE.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 text-[15px] font-semibold text-white transition-transform active:scale-[0.98]"
              >
                Shop all products
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex h-12 items-center rounded-full border border-white/80 bg-white/70 px-6 text-[15px] font-semibold text-gray-900 shadow-card backdrop-blur-md transition-colors hover:bg-white"
              >
                See today&apos;s deals
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              Cash on delivery across Bangladesh · bKash, Nagad, Rocket and cards
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {tiles.map((tile, index) => (
              <li key={tile.category}>
                <Link
                  href={`/products?category=${tile.category}`}
                  className={`group relative flex aspect-[4/3.4] flex-col justify-between overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br p-4 shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-lift ${TILE_TINTS[index % TILE_TINTS.length]}`}
                >
                  <div className="relative z-10">
                    <p className="font-semibold text-gray-900">{categoryLabel(tile.category)}</p>
                    <p className="text-xs text-gray-700">
                      {tile.count} {tile.count === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                  <Image
                    src={tile.image}
                    alt=""
                    width={220}
                    height={220}
                    priority={index < 2}
                    className="pointer-events-none absolute -bottom-3 -right-3 size-[68%] object-contain drop-shadow-xl transition-transform duration-500 ease-out-soft group-hover:scale-110"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
