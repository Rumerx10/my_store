import { cn } from '@/lib/utils';

// Small item count shown on the cart and wishlist icons; hidden when empty.
// `className` moves it, e.g. off the corner of a small icon so it doesn't cover it.
const CountBadge = ({ count, className }: { count: number; className?: string }) => {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red px-1 text-[11px] font-semibold tabular-nums leading-none text-white ring-2 ring-white dark:ring-slate-900',
        className,
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default CountBadge;
