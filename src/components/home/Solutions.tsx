import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { SOLUTIONS } from '@/docs/homeMedia';

// Two entry points: home solar and business solar, each over a real installation photo.
const Solutions = () => {
  return (
    <section aria-labelledby="solutions" className="container mt-8 md:mt-12">
      <h2 id="solutions" className="sr-only">
        Solutions for homes and businesses
      </h2>
      <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
        {SOLUTIONS.map((solution) => (
          <li key={solution.key}>
            <Link
              href={solution.href}
              className="group relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl p-4 shadow-lift md:min-h-[30rem] md:p-6"
            >
              <Image
                src={solution.image.src}
                alt={solution.image.alt}
                fill
                sizes="(min-width: 768px) 600px, 100vw"
                className="-z-10 object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent"
              />
              <div className="rounded-2xl border border-white/20 bg-slate-950/30 p-5 text-white backdrop-blur-xl md:p-6">
                <h3 className="text-2xl">{solution.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-base">
                  {solution.text}
                </p>
                <ul className="mt-4 grid gap-1.5 text-sm">
                  {solution.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-sun" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-brand-ink">
                  {solution.cta}
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
