import Panel from '@/components/common/Panel';
import { rangeInfo, type Dashboard } from '@/lib/dashboard';
import { formatCompactPrice } from '@/lib/utils';
import { CHART, Delta } from './chartKit';

const COLORS = [CHART.home, CHART.business, CHART.previous];

// Revenue split by product tag (homes vs businesses): one 100% bar plus the figures behind it.
const CustomerSegments = ({ data, className }: { data: Dashboard; className?: string }) => {
  const range = rangeInfo(data.range);
  const total = data.segments.reduce((sum, s) => sum + s.revenue, 0);
  const prevTotal = data.segments.reduce((sum, s) => sum + s.prevRevenue, 0);
  const segments = data.segments.map((segment, i) => {
    const share = total > 0 ? (segment.revenue / total) * 100 : 0;
    const prevShare = prevTotal > 0 ? (segment.prevRevenue / prevTotal) * 100 : undefined;
    return {
      ...segment,
      share,
      shareChange: prevShare === undefined ? undefined : share - prevShare,
      color: COLORS[i % COLORS.length],
    };
  });

  return (
    <Panel title="Homes vs businesses" className={className}>
      <p className="-mt-2 mb-4 text-sm text-gray-600 dark:text-slate-400">
        Share of revenue by product tag, {range.label.toLowerCase()}.
      </p>
      {total === 0 ? (
        <p className="text-sm text-gray-600 dark:text-slate-400">
          No tagged sales in this period. Tag products “home” or “business” to see the split.
        </p>
      ) : (
        <>
          {/* 2px gap between the segments instead of a border. */}
          <div
            className="flex h-4 gap-0.5"
            role="img"
            aria-label={segments.map((s) => `${s.label} ${s.share.toFixed(0)}%`).join(', ')}
          >
            {segments
              .filter((segment) => segment.share > 0)
              .map((segment, i, shown) => (
                <div
                  key={segment.key}
                  className={
                    shown.length === 1
                      ? 'rounded-[4px]'
                      : i === 0
                        ? 'rounded-l-[4px]'
                        : i === shown.length - 1
                          ? 'rounded-r-[4px]'
                          : ''
                  }
                  style={{ width: `${segment.share}%`, background: segment.color }}
                />
              ))}
          </div>
          <ul className="mt-4 divide-y divide-gray-100 dark:divide-white/10">
            {segments.map((segment) => (
              <li key={segment.key} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-slate-100">
                    <span
                      className="size-2.5 rounded-[3px]"
                      style={{ background: segment.color }}
                      aria-hidden="true"
                    />
                    {segment.label}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                      {segment.share.toFixed(0)}%
                    </span>
                    <Delta value={segment.shareChange} suffix=" pts" />
                  </span>
                </div>
                <p className="mt-1 pl-[1.125rem] text-xs text-gray-500 dark:text-slate-400">
                  {formatCompactPrice(segment.revenue)} · {formatCompactPrice(segment.prevRevenue)}{' '}
                  {range.previous}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
};

export default CustomerSegments;
