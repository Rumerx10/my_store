import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ApiHomeSection } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { homeImage, isExternal, shopHref } from './media';

type BillboardSection = Extract<ApiHomeSection, { type: 'billboard' }>;

// One big announcement over a photo: a sale, a launch, a seasonal offer.
const Billboard = ({ section }: { section: BillboardSection }) => {
  const centred = section.align === 'center';
  const headingId = `${section.id}-title`;
  // Only while a section is still being set up in the seller centre.
  if (!section.image.url) return null;
  return (
    <section aria-labelledby={headingId} className="container mt-8 md:mt-12">
      <div
        className={cn(
          'relative isolate flex min-h-[22rem] overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-lift md:min-h-[28rem] md:p-12',
          centred ? 'items-center justify-center text-center' : 'items-end md:items-center',
        )}
      >
        <Image
          {...homeImage(section.image.url)}
          alt={section.image.alt}
          fill
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="-z-10 object-cover"
        />
        {/* Keeps white text readable on any photo. */}
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0 -z-10',
            centred
              ? 'bg-slate-950/55'
              : 'bg-[linear-gradient(0deg,rgb(3_10_32_/_0.85),rgb(3_10_32_/_0.2)_70%)] md:bg-[linear-gradient(90deg,rgb(3_10_32_/_0.88),rgb(3_10_32_/_0.45)_55%,transparent)]',
          )}
        />
        <div className={cn('max-w-xl', centred && 'mx-auto')}>
          <h2
            id={headingId}
            className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl"
          >
            {section.title}
          </h2>
          {section.text && (
            <p className="mt-3 text-base leading-relaxed text-white/85 md:text-lg">
              {section.text}
            </p>
          )}
          {section.link && (
            <Link
              href={shopHref(section.link.href)}
              target={isExternal(section.link.href) ? '_blank' : undefined}
              className="group mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-sun px-6 text-[15px] font-semibold text-slate-950 transition-[background-color,transform,translate,scale] hover:bg-amber-300 active:scale-[0.98]"
            >
              {section.link.label}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Billboard;
