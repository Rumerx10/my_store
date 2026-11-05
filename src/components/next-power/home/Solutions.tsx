import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { ApiHomeSection } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { homeImage, isExternal, shopHref } from './media';

type PromoCards = Extract<ApiHomeSection, { type: 'promoCards' }>;

const COLUMNS = ['', '', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-2 xl:grid-cols-4'];

// Large photo cards that each lead somewhere, e.g. home solar and business solar.
const Solutions = ({ section }: { section: PromoCards }) => {
  const headingId = `${section.id}-title`;
  if (section.cards.length === 0) return null;
  return (
    <section aria-labelledby={headingId} className="container mt-8 md:mt-12">
      <h2 id={headingId} className="sr-only">
        {section.title || 'Featured collections'}
      </h2>
      <ul className={cn('grid gap-4 md:gap-6', COLUMNS[section.cards.length])}>
        {section.cards.map((card, index) => (
          <li key={`${index}-${card.title}`}>
            <Link
              href={shopHref(card.link.href)}
              target={isExternal(card.link.href) ? '_blank' : undefined}
              className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-4 shadow-lift md:min-h-[30rem] md:p-6"
            >
              {card.image.url && (
                <Image
                  {...homeImage(card.image.url)}
                  alt={card.image.alt}
                  fill
                  sizes="(min-width: 768px) 600px, 100vw"
                  className="-z-10 object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                />
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent"
              />
              <div className="rounded-2xl border border-white/20 bg-slate-950/30 p-5 text-white backdrop-blur-xl md:p-6">
                <h3 className="text-2xl">{card.title}</h3>
                {card.text && (
                  <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-base">
                    {card.text}
                  </p>
                )}
                {card.points.length > 0 && (
                  <ul className="mt-4 grid gap-1.5 text-sm">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <Check className="size-4 shrink-0 text-sun" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white dark:bg-slate-900 px-5 text-sm font-semibold text-brand-ink">
                  {card.link.label}
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Solutions;
