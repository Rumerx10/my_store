import { useId } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE } from '@/docs/site';

// Brand mark: a deep-blue tile with a rising sun behind a lightning bolt (solar power).
// Kept in sync with src/app/icon.svg.
export const LogoMark = ({ className }: { className?: string }) => {
  // The mark renders more than once per page, so each copy needs its own gradient ids.
  const id = useId();
  const tile = `${id}-tile`;
  const sun = `${id}-sun`;

  return (
    <svg viewBox="0 0 40 40" className={cn('size-9 shrink-0', className)} aria-hidden="true">
      <defs>
        <linearGradient id={tile} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="55%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0b1d4a" />
        </linearGradient>
        <radialGradient id={sun} cx="0.4" cy="0.4" r="0.65">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </radialGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill={`url(#${tile})`} />
      <circle cx="27" cy="13" r="7.5" fill={`url(#${sun})`} />
      {/* The blue outline separates the bolt from the sun where they overlap. */}
      <path
        d="M19 7 9.5 22h7L14 33l11.5-15.5h-7L21 7Z"
        fill="#fff"
        stroke="#1d4ed8"
        strokeWidth="2.2"
        strokeLinejoin="round"
        paintOrder="stroke"
      />
    </svg>
  );
};

// Mark plus wordmark. `tone="light"` is for dark backgrounds.
const Logo = ({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) => (
  <Link
    href="/"
    aria-label={`${SITE.name} home`}
    className={cn('group inline-flex items-center gap-2.5 rounded-lg', className)}
  >
    <LogoMark className="transition-transform duration-300 ease-out-soft group-hover:-rotate-6" />
    <span
      className={cn(
        'text-[1.35rem] leading-none tracking-[-0.04em]',
        tone === 'light' ? 'text-white' : 'text-slate-900 dark:text-slate-100',
      )}
    >
      <span className="font-normal">next</span>
      <span className="font-bold">power</span>
    </span>
  </Link>
);

export default Logo;
