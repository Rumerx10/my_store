import { TIME_RANGES, type TimeRange } from '@/docs/adminDashboard';
import { cn } from '@/lib/utils';

// Date range for the whole dashboard: every tile and chart below follows it.
const TimeRangeSelector = ({
  timeRange,
  setTimeRange,
}: {
  timeRange: TimeRange;
  setTimeRange: (value: TimeRange) => void;
}) => (
  <div
    role="radiogroup"
    aria-label="Time range"
    className="grid w-full grid-cols-4 rounded-full bg-white/70 p-1 ring-1 ring-gray-200 sm:inline-grid sm:w-auto"
  >
    {TIME_RANGES.map((range) => (
      <button
        key={range.value}
        type="button"
        role="radio"
        aria-checked={timeRange === range.value}
        aria-label={range.label}
        onClick={() => setTimeRange(range.value)}
        className={cn(
          'h-8 whitespace-nowrap rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          timeRange === range.value
            ? 'bg-brand text-white shadow-[0_6px_16px_-8px_rgb(29_78_216_/_0.8)]'
            : 'text-gray-600 hover:bg-white hover:text-gray-900',
        )}
      >
        {range.short}
      </button>
    ))}
  </div>
);

export default TimeRangeSelector;
