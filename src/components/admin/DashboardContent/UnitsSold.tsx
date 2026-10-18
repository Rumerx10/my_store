'use client';
import { useSelector } from 'react-redux';
import Panel from '@/components/dashboard/Panel';
import { TIME_RANGES, changeFrom, unitsSoldFor, type TimeRange } from '@/docs/adminDashboard';
import { RootState } from '@/redux/store';
import { CHART, DataTable, Delta } from './chartKit';

const SHOWN = 8;

// How many units of each product sold in the period: the best sellers, then everything else.
const UnitsSold = ({ timeRange, className }: { timeRange: TimeRange; className?: string }) => {
  const products = useSelector((state: RootState) => state.products);
  const range = TIME_RANGES.find((r) => r.value === timeRange)!;
  const rows = unitsSoldFor(
    timeRange,
    products.filter((product) => product.status !== 'draft'),
  );
  const total = rows.reduce((sum, row) => sum + row.units, 0);
  const prevTotal = rows.reduce((sum, row) => sum + row.prevUnits, 0);
  const top = rows.slice(0, SHOWN);
  const rest = rows.slice(SHOWN);
  const other = rest.reduce((sum, row) => sum + row.units, 0);
  const bars = [
    ...top.map((row) => ({
      key: String(row.id),
      label: row.title,
      units: row.units,
      muted: false,
    })),
    ...(rest.length
      ? [{ key: 'other', label: `Other ${rest.length} products`, units: other, muted: true }]
      : []),
  ];
  const max = Math.max(...bars.map((bar) => bar.units), 1);

  return (
    <Panel title="Units sold" className={className}>
      <div className="-mt-1 mb-5">
        <p className="text-3xl font-semibold tracking-tight text-gray-900">
          {total.toLocaleString('en-US')}
          <span className="ml-1.5 text-base font-normal text-gray-500">units</span>
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-gray-600">
          <Delta value={changeFrom(total, prevTotal)} />
          vs {range.previous} · across {rows.filter((row) => row.units > 0).length} products
        </p>
      </div>

      <ol className="space-y-3">
        {bars.map((bar) => (
          <li key={bar.key}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className={bar.muted ? 'text-gray-500' : 'truncate text-gray-700'}>
                {bar.label}
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                {bar.units.toLocaleString('en-US')}
              </span>
            </div>
            <div className="mt-1.5 h-2.5" aria-hidden="true">
              <div
                className="h-full rounded-r-[4px] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{
                  width: `${Math.max((bar.units / max) * 100, 1)}%`,
                  background: bar.muted ? CHART.previous : CHART.current,
                }}
              />
            </div>
          </li>
        ))}
      </ol>

      <DataTable
        caption={`Units sold per product, ${range.label.toLowerCase()} and ${range.previous}`}
        headers={['Product', range.label, range.previous]}
        rows={rows.map((row) => [
          row.title,
          row.units.toLocaleString('en-US'),
          row.prevUnits.toLocaleString('en-US'),
        ])}
      />
    </Panel>
  );
};

export default UnitsSold;
