import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SectionHeader = ({
  title,
  desc,
  href,
  linkLabel = 'View all',
  className,
  id,
}: {
  title: string;
  desc?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  id?: string;
}) => {
  return (
    <div className={cn('mb-6 flex items-end justify-between gap-4 md:mb-8', className)}>
      <div className="max-w-2xl">
        <h2 id={id} className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl">
          {title}
        </h2>
        {desc && (
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400 md:text-base">{desc}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-white/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 px-4 text-sm font-semibold text-brand-ink shadow-card backdrop-blur-md transition-colors hover:bg-white dark:hover:bg-slate-900"
        >
          {linkLabel}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
