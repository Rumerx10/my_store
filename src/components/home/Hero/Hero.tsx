'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, Copy, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectStoreProducts } from '@/redux/selectors';
import { HERO_IMAGE } from '@/docs/homeMedia';
import { formatPrice } from '@/lib/utils';
import { COUPONS } from '@/lib/checkout';
import GridPulses from '@/components/shared/GridPulses';
import type { IProduct } from '@/types/api_types';

// Product shown in the hero card.
const FEATURED_ID = 16;

// Coupon row inside the hero card: the offer, the code and a copy button.
const CouponRow = () => {
  const [copied, setCopied] = useState(false);
  const coupon = COUPONS[0];
  if (!coupon) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success(`Copied ${coupon.code}`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(`Couldn't copy. The code is ${coupon.code}`);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 text-white sm:px-5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sun text-sm font-bold tabular-nums text-slate-950 dark:text-white">
        -{coupon.discount}%
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Your first solar order</p>
        <p className="text-xs text-white/70">
          Use <span className="font-mono font-semibold tracking-wider text-sun">{coupon.code}</span>{' '}
          at checkout
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Code copied' : `Copy code ${coupon.code}`}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3.5 text-sm font-semibold text-white ring-1 ring-white/25 transition-[background-color,transform] hover:bg-white/25 active:scale-95"
      >
        {copied ? (
          <Check className="size-4 text-sun" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

// One floating card: the featured product on a light panel, the welcome offer underneath.
const HeroCard = ({ product }: { product?: IProduct }) => (
  <div className="hero-rise rounded-[1.75rem] border border-white/20 bg-slate-950/45 p-1.5 shadow-[0_30px_80px_-30px_rgb(2_6_23_/_0.8)] backdrop-blur-2xl [--rise-delay:360ms]">
    {product && (
      <Link
        href={`/products/${product.id}`}
        className="group relative hidden overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-sky-100 via-white to-amber-50 p-5 md:block dark:from-sky-950 dark:via-slate-900 dark:to-amber-950/60"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium text-brand">Featured</p>
          <span className="flex size-8 items-center justify-center rounded-full bg-gray-900 text-white transition-transform dark:bg-white dark:text-slate-900 duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </div>
        <div className="relative mx-auto mt-1 aspect-[4/3] w-full max-w-64">
          <Image
            src={product.thumbnail}
            alt=""
            fill
            sizes="256px"
            priority
            className="scale-125 object-contain drop-shadow-[0_18px_24px_rgb(15_23_42_/_0.3)] transition-transform duration-500 ease-out-soft group-hover:scale-[1.32]"
          />
        </div>
        <p className="mt-3 line-clamp-1 font-semibold text-gray-900 dark:text-slate-100">
          {product.title}
        </p>
        <p className="mt-0.5 flex items-baseline gap-2 tabular-nums">
          <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">
            {formatPrice(product.price)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-gray-500 dark:text-slate-400 line-through">
              {formatPrice(product.price / (1 - product.discountPercentage / 100))}
            </span>
          )}
        </p>
      </Link>
    )}
    <CouponRow />
  </div>
);

const Hero = () => {
  const products = useSelector(selectStoreProducts);
  const featured = products.find((p) => p.id === FEATURED_ID);

  return (
    // Slides up under the floating header so the photo fills the whole first screen.
    <section aria-labelledby="hero-title" className="-mt-(--header-h)">
      {/* Full-bleed photo; the content stays aligned with the page container. */}
      <div className="relative isolate flex min-h-[calc(100dvh-var(--bottom-nav-h))] items-end overflow-hidden lg:items-center">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Solar dusk: deep navy on the left fading through teal, so white text stays readable. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(3_10_32_/_0.94)_0%,rgb(6_32_64_/_0.78)_35%,rgb(8_72_96_/_0.35)_68%,rgb(8_72_96_/_0)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-[linear-gradient(0deg,rgb(3_10_32_/_0.85),rgb(3_10_32_/_0.35)_45%,transparent)]"
        />
        <GridPulses variant="hero" />
        {/* The hero photo covers the page sun, so the hero shows its own. */}
        <div aria-hidden="true" className="hero-sun">
          <div className="sun-rays" />
          <div className="sun-disc" />
        </div>

        <div className="container grid w-full items-end gap-10 pb-10 pt-[calc(var(--header-h)+3rem)] md:pb-16 lg:items-center lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 lg:pb-20 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="max-w-2xl text-white">
            <p className="hero-rise inline-flex items-center gap-2 text-sm font-medium text-white/85">
              <BadgeCheck className="size-4 text-sun" aria-hidden="true" />
              Official GoodWe range, delivered and installed
            </p>
            <h1
              id="hero-title"
              className="hero-rise mt-5 text-[2.6rem] font-semibold leading-[1.02] tracking-tight [--rise-delay:80ms] sm:text-6xl xl:text-7xl"
            >
              Power your home with <span className="text-sun">the sun.</span>
            </h1>
            <p className="hero-rise mt-5 max-w-[46ch] text-base leading-relaxed text-white/80 [--rise-delay:160ms] md:text-lg">
              Panels, inverters and batteries sized to your bill, with backup power when the grid
              goes down.
            </p>
            <div className="hero-rise mt-8 flex flex-wrap gap-3 [--rise-delay:240ms]">
              <Link
                href="/products"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-sun px-6 text-[15px] font-semibold text-slate-950 dark:text-white shadow-[0_12px_32px_-12px_rgb(251_191_36_/_0.9)] transition-[background-color,transform] hover:bg-amber-300 active:scale-[0.98]"
              >
                Shop solar
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/chat"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 px-6 text-[15px] font-semibold text-white ring-1 ring-white/35 backdrop-blur-md transition-[background-color,transform] hover:bg-white/20 active:scale-[0.98]"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Free system design
              </Link>
            </div>
          </div>

          <div className="w-full max-w-md lg:max-w-none">
            <HeroCard product={featured} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
