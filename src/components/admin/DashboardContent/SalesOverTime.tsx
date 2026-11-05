'use client';
import { useState } from 'react';
import Panel from '@/components/common/Panel';
import { bucketUnit, changeFrom, rangeInfo, type Dashboard } from '@/lib/dashboard';
import { cn, formatCompact, formatCompactPrice, formatPrice } from '@/lib/utils';
import { DataTable, Delta } from './chartKit';
import PeriodBars, { PeriodLegend } from './PeriodBars';

type Metric = 'revenue' | 'orders';

const METRICS: { value: Metric; label: string }[] = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'orders', label: 'Orders' },
];

// Sales per hour, day or month as columns, with the previous period as a grey line to beat.
const SalesOverTime = ({ data: dashboard, className }: { data: Dashboard; className?: string }) => {
  const [metric, setMetric] = useState<Metric>('revenue');
  const timeRange = dashboard.range;
  const range = rangeInfo(timeRange);
  const data = dashboard.series;
  const totals = dashboard.totals;
  const prevKey = metric === 'revenue' ? 'prevRevenue' : 'prevOrders';
  const total = totals[metric];
  const format = (value: number) =>
    metric === 'revenue' ? formatPrice(value) : value.toLocaleString('en-US');
  const unit = bucketUnit(timeRange);

  return (
    <Panel
      title="Sales over time"
      className={className}
      action={
        <div
          role="radiogroup"
          aria-label="Measure"
          className="flex h-9 items-center rounded-full bg-gray-100/90 dark:bg-white/10 p-1"
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
                  ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-[0_1px_3px_rgb(15_23_42_/_0.12)]'
                  : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100',
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
          <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
            {metric === 'revenue' ? formatCompactPrice(total) : total.toLocaleString('en-US')}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
            <Delta value={changeFrom(total, totals[prevKey])} />
            vs {range.previous}
          </p>
        </div>
        <PeriodLegend range={timeRange} />
      </div>

      <div className="mt-5 h-64 md:h-72">
        <PeriodBars
          data={data}
          range={timeRange}
          value={metric}
          previous={prevKey}
          format={format}
          tick={metric === 'revenue' ? formatCompactPrice : formatCompact}
          axisWidth={metric === 'revenue' ? 52 : 36}
        />
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
