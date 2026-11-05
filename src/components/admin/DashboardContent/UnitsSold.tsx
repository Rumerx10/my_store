'use client';
import Panel from '@/components/common/Panel';
import { bucketUnit, changeFrom, rangeInfo, type Dashboard } from '@/lib/dashboard';
import { cn, formatCompact } from '@/lib/utils';
import { DataTable, Delta } from './chartKit';
import PeriodBars, { PeriodLegend } from './PeriodBars';

const count = (value: number) => value.toLocaleString('en-US');

// Items sold per hour, day or month, against the period before.
const UnitsSold = ({ data, className }: { data: Dashboard; className?: string }) => {
  const range = rangeInfo(data.range);
  const unit = bucketUnit(data.range);
  const { unitsSold: total, prevUnitsSold: prevTotal } = data.totals;
  const busiest = data.series.reduce(
    (best, point) => (point.units > (best?.units ?? 0) ? point : best),
    undefined as (typeof data.series)[number] | undefined,
  );

  return (
    <Panel title="Units sold" className={cn('flex flex-col', className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
            {count(total)}
            <span className="ml-1.5 text-base font-normal text-gray-500 dark:text-slate-400">
              units
            </span>
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
            <Delta value={changeFrom(total, prevTotal)} />
            vs {range.previous}
            {busiest && (
              <span>
                · busiest {unit} {busiest.full}, {count(busiest.units)}
              </span>
            )}
          </p>
        </div>
        <PeriodLegend range={data.range} />
      </div>

      {/* Grows to the height of the panel beside it; absolute so the chart gets a real size. */}
      <div className="relative mt-5 min-h-56 flex-1 md:min-h-64">
        <div className="absolute inset-0">
          <PeriodBars
            data={data.series}
            range={data.range}
            value="units"
            previous="prevUnits"
            format={(value) => `${count(value)} units`}
            tick={formatCompact}
          />
        </div>
      </div>

      <DataTable
        caption={`Units sold per ${unit}, ${range.label.toLowerCase()} and ${range.previous}`}
        headers={[unit.charAt(0).toUpperCase() + unit.slice(1), range.label, range.previous]}
        rows={data.series.map((point) => [point.full, count(point.units), count(point.prevUnits)])}
      />
    </Panel>
  );
};

export default UnitsSold;
