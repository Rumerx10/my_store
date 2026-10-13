import { useId } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE } from '@/docs/site';

const Logo = ({ className }: { className?: string }) => {
  // The logo renders more than once per page, so each copy needs its own gradient id.
  const gradientId = useId();

  return (
    <Link
      href="/"
      aria-label={`${SITE.name} home`}
      className={cn('inline-flex items-center gap-2 rounded-md', className)}
    >
      <svg viewBox="0 0 32 32" className="size-8 shrink-0 drop-shadow-sm" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="55%" stopColor="#c026d3" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="10" fill={`url(#${gradientId})`} />
        <path
          d="M10.5 22V10.5L21.5 21.5V10"
          fill="none"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-white"
        />
      </svg>
      <span className="text-xl font-semibold tracking-tight text-gray-900">
        Next<span className="text-gradient">Mart</span>
      </span>
    </Link>
  );
};

export default Logo;
