'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Check, Copy, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectStoreProducts } from '@/redux/selectors';
import { HERO_IMAGE } from '@/docs/homeMedia';
import { formatPrice } from '@/lib/utils';
import { COUPONS } from '@/lib/checkout';
import GridPulses from '@/components/shared/GridPulses';

// Product shown in the hero's glass card.
const FEATURED_ID = 16;

// Coupon ticket: discount stub, perforated edge with notches, and the code to copy.
const OfferTicket = () => {
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
    <div className="offer-ticket relative flex overflow-hidden rounded-3xl border border-white/25 bg-slate-950/40 text-white backdrop-blur-xl">
      <div className="flex w-28 shrink-0 flex-col items-center justify-center bg-gradient-to-br from-amber-300 via-sun to-orange-400 px-3 py-5 text-slate-950">
        <span className="text-4xl font-semibold leading-none tabular-nums">{coupon.discount}%</span>
        <span className="mt-1 text-sm font-medium">off</span>
      </div>
      <div className="min-w-0 flex-1 border-l-2 border-dashed border-white/35 p-4 sm:p-5">
        <p className="font-semibold">Save on your first solar order</p>
        <p className="mt-0.5 text-sm text-white/75">Use this code in your cart.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-dashed border-sun/70 bg-white/10 px-3 py-1.5 font-mono text-sm font-semibold tracking-wider text-sun">
            {coupon.code}
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-slate-900 transition-transform active:scale-95"
          >
            {copied ? (
              <Check className="size-4 text-green" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy code'}
          </button>
          <Link
            href="/deals"
            className="rounded text-sm font-medium text-white/85 underline decoration-white/40 underline-offset-4 hover:text-white"
          >
            See deals
          </Link>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const products = useSelector(selectStoreProducts);
  const featured = products.find((p) => p.id === FEATURED_ID);
  const topDiscount = Math.round(Math.max(0, ...products.map((p) => p.discountPercentage)));
  const categoryCount = new Set(products.map((p) => p.category)).size;

  const stats = [
    { value: products.length, label: 'GoodWe products' },
    { value: categoryCount, label: 'Categories' },
    { value: `${topDiscount}%`, label: 'Top discount' },
  ];

  return (
    <section aria-labelledby="hero-title">
      {/* Full-bleed photo; the content stays aligned with the page container. */}
      <div className="relative isolate flex min-h-[min(88dvh,46rem)] items-end overflow-hidden">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Darkens the left side so white text stays readable over the photo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/80 via-slate-900/45 to-slate-900/5"
        />
        <GridPulses variant="hero" />
        {/* The hero photo covers the page sun, so the hero shows its own. */}
        <div aria-hidden="true" className="hero-sun">
          <div className="sun-rays" />
          <div className="sun-disc" />
        </div>

        <div className="container grid w-full gap-6 py-8 md:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-20">
          <div className="max-w-xl rounded-3xl border border-white/20 bg-slate-950/25 p-6 text-white backdrop-blur-xl md:p-8">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium sm:text-sm">
              <BadgeCheck className="size-4 text-sun" aria-hidden="true" />
              Official GoodWe range · delivered and installed
            </p>
            <h1
              id="hero-title"
              className="mt-4 text-4xl leading-[1.08] md:text-5xl lg:text-[3.4rem]"
            >
              Power your home and business with the <span className="text-sun">sun.</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">
              Solar panels, inverters and batteries sized to your electricity bill, with backup
              power for load shedding.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-semibold text-white transition-transform active:scale-[0.98]"
              >
                Shop solar
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/40 bg-white/15 px-6 text-[15px] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/25"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Free system design
              </Link>
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/20 pt-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-2xl font-semibold tabular-nums md:text-3xl">{stat.value}</dd>
                  <dd className="text-xs text-white/75 md:text-sm">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex w-full flex-col gap-4 lg:max-w-sm lg:justify-self-end">
            <OfferTicket />
            {featured && (
              <Link
                href={`/products/${featured.id}`}
                className="group hidden rounded-3xl glass p-5 md:flex md:items-center md:gap-5 lg:p-6"
              >
                <div className="relative aspect-square w-32 shrink-0 lg:w-36">
                  <Image
                    src={featured.thumbnail}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-contain drop-shadow-xl transition-transform duration-500 ease-out-soft group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                    Featured
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">{featured.title}</p>
                  <p className="mt-2 flex items-center gap-2 text-lg font-semibold tabular-nums text-gray-900">
                    {formatPrice(featured.price)}
                    <ArrowRight
                      className="size-4 text-brand transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
