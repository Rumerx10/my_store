'use client';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Panel from '@/components/common/Panel';
import {
  bucketUnit,
  changeFrom,
  rangeInfo,
  type Dashboard,
  type SalesPoint,
} from '@/lib/dashboard';
import { formatCompactPrice, formatPrice } from '@/lib/utils';
import { CHART, DataTable, Delta, TooltipCard, axisTick } from './chartKit';

const margin = (profit: number, revenue: number) =>
  revenue > 0 ? `${((profit / revenue) * 100).toFixed(1)}%` : '—';

// Revenue and profit per hour, day or month on one money axis: the gap between the lines is
// what the goods cost, plus delivery and fees.
const RevenueAndProfit = ({
  data: dashboard,
  className,
}: {
  data: Dashboard;
  className?: string;
}) => {
  const range = rangeInfo(dashboard.range);
  const unit = bucketUnit(dashboard.range);
  const t = dashboard.totals;
  const series = [
    {
      key: 'revenue',
      label: 'Revenue',
      color: CHART.current,
      total: t.revenue,
      prev: t.prevRevenue,
    },
    { key: 'profit', label: 'Profit', color: CHART.profit, total: t.profit, prev: t.prevProfit },
  ] as const;

  return (
    <Panel title="Revenue and profit" className={className}>
      {/* The legend doubles as the headline: each line's swatch, name and total. */}
      <ul className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Legend">
        {series.map((item) => (
          <li key={item.key}>
            <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
              <span
                className="h-0.5 w-3.5 rounded-full"
                style={{ background: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
              {formatCompactPrice(item.total)}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
              <Delta value={changeFrom(item.total, item.prev)} />
              vs {range.previous}
            </p>
          </li>
        ))}
        <li>
          <p className="text-sm text-gray-600 dark:text-slate-400">Margin</p>
          <p className="mt-0.5 text-2xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
            {margin(t.profit, t.revenue)}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">profit on revenue</p>
        </li>
      </ul>

      <div className="mt-5 h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={dashboard.series} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.current} stopOpacity={0.16} />
                <stop offset="100%" stopColor={CHART.current} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="profit-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.profit} stopOpacity={0.22} />
                <stop offset="100%" stopColor={CHART.profit} stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={CHART.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
              tick={axisTick}
              minTickGap={14}
            />
            <YAxis
              width={52}
              tickLine={false}
              axisLine={false}
              tick={axisTick}
              tickFormatter={(value: number) => formatCompactPrice(value)}
            />
            <Tooltip
              cursor={{ stroke: CHART.axis, strokeWidth: 1, strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as SalesPoint | undefined;
                if (!active || !point) return null;
                return (
                  <TooltipCard
                    title={point.full}
                    rows={[
                      {
                        key: 'revenue',
                        label: 'revenue',
                        value: formatPrice(point.revenue),
                        color: CHART.current,
                      },
                      {
                        key: 'profit',
                        label: `profit, ${margin(point.profit, point.revenue)} margin`,
                        value: formatPrice(point.profit),
                        color: CHART.profit,
                      },
                    ]}
                  />
                );
              }}
            />
            {series.map((item) => (
              <Area
                key={item.key}
                dataKey={item.key}
                name={item.label}
                type="monotone"
                stroke={item.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={`url(#${item.key}-fill)`}
                dot={false}
                activeDot={{ r: 4, fill: item.color, stroke: 'var(--card)', strokeWidth: 2 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
        Profit counts products that have a cost price.
      </p>
      <DataTable
        caption={`Revenue and profit per ${unit}, ${range.label.toLowerCase()}`}
        headers={[unit.charAt(0).toUpperCase() + unit.slice(1), 'Revenue', 'Profit', 'Margin']}
        rows={dashboard.series.map((point) => [
          point.full,
          formatPrice(point.revenue),
          formatPrice(point.profit),
          margin(point.profit, point.revenue),
        ])}
      />
    </Panel>
  );
};

export default RevenueAndProfit;
