import { ShoppingCart, Wallet, Receipt, Users, type LucideIcon } from 'lucide-react';
import {
  SALES_SERIES,
  TIME_RANGES,
  changeFrom,
  funnelFor,
  totalsFor,
  type TimeRange,
} from '@/docs/adminDashboard';
import { formatCompact, formatCompactPrice, formatPrice } from '@/lib/utils';
import { CHART, Delta } from './chartKit';

// Tiny trend line for a stat tile; drawn in plain SVG so it stays light.
const Sparkline = ({ values }: { values: number[] }) => {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const points = values.map((value, i) => {
    const x = values.length > 1 ? (i / (values.length - 1)) * 100 : 50;
    const y = 30 - ((value - min) / (max - min || 1)) * 28;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full" aria-hidden="true">
      <polygon points={`0,32 ${points.join(' ')} 100,32`} fill={CHART.current} opacity={0.1} />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={CHART.current}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

const StatTile = ({
  title,
  value,
  change,
  changeSuffix,
  previous,
  trend,
  note,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: number | undefined;
  changeSuffix?: string;
  previous: string;
  trend?: number[];
  note?: string;
  icon: LucideIcon;
}) => (
  <div className="flex h-full flex-col rounded-xl glass p-4 md:p-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-gray-600">{title}</p>
      <Icon className="size-4 shrink-0 text-gray-400" aria-hidden="true" />
    </div>
    <p className="mt-2 break-words text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">
      {value}
    </p>
    <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
      <Delta value={change} suffix={changeSuffix} />
      <span>vs {previous}</span>
    </p>
    <div className="mt-auto pt-3">
      {trend ? (
        <Sparkline values={trend} />
      ) : (
        <p className="flex h-8 items-end text-xs text-gray-500">{note}</p>
      )}
    </div>
  </div>
);

const SalesStatistics = ({ timeRange }: { timeRange: TimeRange }) => {
  const range = TIME_RANGES.find((r) => r.value === timeRange)!;
  const series = SALES_SERIES[timeRange];
  const totals = totalsFor(timeRange);
  const funnel = funnelFor(timeRange);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <StatTile
        title="Revenue"
        value={formatCompactPrice(totals.revenue)}
        change={changeFrom(totals.revenue, totals.prevRevenue)}
        previous={range.previous}
        trend={series.map((p) => p.revenue)}
        icon={Wallet}
      />
      <StatTile
        title="Orders"
        value={totals.orders.toLocaleString('en-US')}
        change={changeFrom(totals.orders, totals.prevOrders)}
        previous={range.previous}
        trend={series.map((p) => p.orders)}
        icon={ShoppingCart}
      />
      <StatTile
        title="Average order"
        value={formatPrice(Math.round(totals.averageOrder)).replace(/\.00$/, '')}
        change={changeFrom(totals.averageOrder, totals.prevAverageOrder)}
        previous={range.previous}
        trend={series.filter((p) => p.orders > 0).map((p) => p.revenue / p.orders)}
        icon={Receipt}
      />
      <StatTile
        title="Conversion rate"
        value={`${funnel.conversion.toFixed(1)}%`}
        change={funnel.conversion - funnel.prevConversion}
        changeSuffix=" pts"
        previous={range.previous}
        note={`${formatCompact(funnel.visits)} visits → ${totals.orders.toLocaleString('en-US')} orders`}
        icon={Users}
      />
    </div>
  );
};

export default SalesStatistics;
