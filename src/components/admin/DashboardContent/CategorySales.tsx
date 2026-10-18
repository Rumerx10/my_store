import Panel from '@/components/dashboard/Panel';
import { categoryLabel } from '@/docs/navLinks';
import { TIME_RANGES, categorySalesFor, changeFrom, type TimeRange } from '@/docs/adminDashboard';
import { formatCompactPrice, formatPrice } from '@/lib/utils';
import { CHART, DataTable, Delta } from './chartKit';

// Revenue per category as horizontal bars, biggest first, with the change on the period before.
const CategorySales = ({ timeRange, className }: { timeRange: TimeRange; className?: string }) => {
  const range = TIME_RANGES.find((r) => r.value === timeRange)!;
  const rows = categorySalesFor(timeRange).sort((a, b) => b.revenue - a.revenue);
  const max = Math.max(...rows.map((row) => row.revenue), 1);

  return (
    <Panel title="Sales by category" className={className}>
      <p className="-mt-2 mb-4 text-sm text-gray-600">
        Where revenue came from, and which categories are growing.
      </p>
      <ul className="space-y-3.5">
        {rows.map((row) => (
          <li
            key={row.category}
            className="grid grid-cols-[minmax(6.5rem,8.5rem)_minmax(0,1fr)_auto] items-center gap-3"
          >
            <span className="truncate text-sm text-gray-700">{categoryLabel(row.category)}</span>
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-3 shrink-0 rounded-r-[4px] transition-[width] duration-500 ease-out motion-reduce:transition-none"
                // Leave room after the longest bar for its value label.
                style={{
                  width: `calc((100% - 3.75rem) * ${row.revenue / max})`,
                  background: CHART.current,
                }}
                aria-hidden="true"
              />
              <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-900">
                {formatCompactPrice(row.revenue)}
              </span>
            </span>
            <Delta value={changeFrom(row.revenue, row.prevRevenue)} className="justify-self-end" />
          </li>
        ))}
      </ul>
      <DataTable
        caption={`Revenue by category, ${range.label.toLowerCase()}`}
        headers={['Category', range.label, range.previous]}
        rows={rows.map((row) => [
          categoryLabel(row.category),
          formatPrice(row.revenue),
          formatPrice(row.prevRevenue),
        ])}
      />
    </Panel>
  );
};

export default CategorySales;
