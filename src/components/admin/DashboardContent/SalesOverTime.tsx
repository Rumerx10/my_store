'use client';
import { useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Panel from '@/components/dashboard/Panel';
import {
  SALES_SERIES,
  TIME_RANGES,
  changeFrom,
  totalsFor,
  type SalesPoint,
  type TimeRange,
} from '@/docs/adminDashboard';
import { cn, formatCompact, formatCompactPrice, formatPrice } from '@/lib/utils';
import { CHART, DataTable, Delta, TooltipCard, axisTick } from './chartKit';

type Metric = 'revenue' | 'orders';

const METRICS: { value: Metric; label: string }[] = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'orders', label: 'Orders' },
];

// Sales per hour, day or month as columns, with the previous period as a grey line to beat.
const SalesOverTime = ({ timeRange, className }: { timeRange: TimeRange; className?: string }) => {
  const [metric, setMetric] = useState<Metric>('revenue');
  const range = TIME_RANGES.find((r) => r.value === timeRange)!;
  const data = SALES_SERIES[timeRange];
  const totals = totalsFor(timeRange);
  const prevKey = metric === 'revenue' ? 'prevRevenue' : 'prevOrders';
  const total = totals[metric];
  const format = (value: number) =>
    metric === 'revenue' ? formatPrice(value) : value.toLocaleString('en-US');
  const unit = timeRange === 'today' ? 'hour' : timeRange === 'year' ? 'month' : 'day';

  return (
    <Panel
      title="Sales over time"
      className={className}
      action={
        <div
          role="radiogroup"
          aria-label="Measure"
          className="flex h-9 items-center rounded-full bg-gray-100/90 p-1"
        >
          {METRICS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={metric === option.value}
              onClick={() => setMetric(option.value)}
              className={cn(
                'h-7 rounded-full px-3 text-sm font-medium transition-colors',
                metric === option.value
                  ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgb(15_23_42_/_0.12)]'
                  : 'text-gray-600 hover:text-gray-900',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-gray-900">
            {metric === 'revenue' ? formatCompactPrice(total) : total.toLocaleString('en-US')}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-gray-600">
            <Delta value={changeFrom(total, totals[prevKey])} />
            vs {range.previous}
          </p>
        </div>
        <ul className="flex flex-wrap gap-4 text-xs text-gray-600" aria-label="Legend">
          <li className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: CHART.current }} />
            {range.label}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 rounded-full" style={{ background: CHART.previous }} />
            {range.previous.charAt(0).toUpperCase() + range.previous.slice(1)}
          </li>
        </ul>
      </div>

      <div className="mt-5 h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
            barCategoryGap="22%"
          >
            <CartesianGrid vertical={false} stroke={CHART.grid} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
              tick={axisTick}
              minTickGap={14}
            />
            <YAxis
              width={metric === 'revenue' ? 52 : 36}
              tickLine={false}
              axisLine={false}
              tick={axisTick}
              tickFormatter={(value: number) =>
                metric === 'revenue' ? formatCompactPrice(value) : formatCompact(value)
              }
            />
            <Tooltip
              cursor={{ fill: 'rgb(29 78 216 / 0.06)' }}
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as SalesPoint | undefined;
                if (!active || !point) return null;
                return (
                  <TooltipCard
                    title={point.full}
                    rows={[
                      {
                        key: 'now',
                        label: range.label.toLowerCase(),
                        value: format(point[metric]),
                        color: CHART.current,
                      },
                      {
                        key: 'before',
                        label: range.previous,
                        value: format(point[prevKey]),
                        color: CHART.previous,
                      },
                    ]}
                  />
                );
              }}
            />
            <Bar
              dataKey={metric}
              name={range.label}
              fill={CHART.current}
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              activeBar={{ fill: '#3b63e6' }}
            />
            <Line
              dataKey={prevKey}
              name={range.previous}
              type="monotone"
              stroke={CHART.previous}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={false}
              activeDot={{ r: 4, fill: CHART.previous, stroke: '#fff', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <DataTable
        caption={`Sales per ${unit}, ${range.label.toLowerCase()} and ${range.previous}`}
        headers={[unit.charAt(0).toUpperCase() + unit.slice(1), range.label, range.previous]}
        rows={data.map((point) => [point.full, format(point[metric]), format(point[prevKey])])}
      />
    </Panel>
  );
};

export default SalesOverTime;
