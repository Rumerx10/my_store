import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { SITE } from '@/docs/site';

// Closing band: points shoppers to a person when they need help deciding.
const Trusted = () => {
  return (
    <section aria-labelledby="help-band" className="container mt-14 md:mt-20">
      <div className="relative overflow-hidden rounded-3xl bg-brand p-6 text-white shadow-lift md:p-12">
        {/* Glossy highlights */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-white/20 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/3 size-64 rounded-full bg-amber-300/30 blur-3xl"
        />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-8">
          <div>
            <h2 id="help-band" className="text-2xl md:text-3xl">
              Not sure what to pick?
            </h2>
            <p className="mt-2 max-w-lg text-white/90 md:text-lg">
              Our team answers product questions and order queries. {SITE.hours}.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link
              href="/chat"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-brand-ink transition-transform hover:bg-white/90 active:scale-[0.98]"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Chat with us
            </Link>
            <a
              href={`tel:${SITE.phoneHref}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/15 px-6 font-semibold tabular-nums text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              <Phone className="size-4" aria-hidden="true" />
              {SITE.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trusted;
