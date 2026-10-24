import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Star row that reflects the actual rating (rounded to the nearest whole star).
const Rating = ({
  value,
  count,
  size = 'sm',
  className,
}: {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}) => {
  const filled = Math.round(value);
  const starSize = size === 'sm' ? 'size-3.5' : 'size-5';

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div
        className="flex items-center gap-0.5"
        role="img"
        aria-label={`Rated ${value.toFixed(1)} out of 5`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={cn(
              starSize,
              i < filled
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 dark:fill-slate-700 text-gray-200 dark:text-slate-700',
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          'tabular-nums text-gray-600 dark:text-slate-400',
          size === 'sm' ? 'text-xs' : 'text-sm font-medium text-gray-900 dark:text-slate-100',
        )}
      >
        {value.toFixed(1)}
        {count !== undefined && (
          <span className="font-normal text-gray-500 dark:text-slate-400">
            {' '}
            ({count.toLocaleString()} {count === 1 ? 'review' : 'reviews'})
          </span>
        )}
      </span>
    </div>
  );
};

export default Rating;
