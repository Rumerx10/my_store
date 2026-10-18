import Panel from '@/components/dashboard/Panel';
import { segmentsFor, type TimeRange } from '@/docs/adminDashboard';
import { formatCompactPrice } from '@/lib/utils';
import { CHART, Delta } from './chartKit';

const COLORS: Record<string, string> = { home: CHART.home, business: CHART.business };

// Revenue split between homes and businesses: one 100% bar plus the figures behind it.
const CustomerSegments = ({
  timeRange,
  className,
}: {
  timeRange: TimeRange;
  className?: string;
}) => {
  const segments = segmentsFor(timeRange);

  return (
    <Panel title="Homes vs businesses" className={className}>
      <p className="-mt-2 mb-4 text-sm text-gray-600">Share of revenue by customer type.</p>
      {/* 2px gap between the segments instead of a border. */}
      <div
        className="flex h-4 gap-0.5"
        role="img"
        aria-label={segments.map((s) => `${s.label} ${s.share.toFixed(0)}%`).join(', ')}
      >
        {segments.map((segment, i) => (
          <div
            key={segment.key}
            className={i === 0 ? 'rounded-l-[4px]' : 'rounded-r-[4px]'}
            style={{ width: `${segment.share}%`, background: COLORS[segment.key] }}
          />
        ))}
      </div>
      <ul className="mt-4 divide-y divide-gray-100">
        {segments.map((segment) => (
          <li key={segment.key} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <span
                  className="size-2.5 rounded-[3px]"
                  style={{ background: COLORS[segment.key] }}
                  aria-hidden="true"
                />
                {segment.label}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold tabular-nums text-gray-900">
                  {segment.share.toFixed(0)}%
                </span>
                <Delta value={segment.shareChange} suffix=" pts" />
              </span>
            </div>
            <p className="mt-1 pl-[1.125rem] text-xs text-gray-500">
              {formatCompactPrice(segment.revenue)} from {segment.orders.toLocaleString('en-US')}{' '}
              orders · {formatCompactPrice(segment.averageOrder)} average
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

export default CustomerSegments;
