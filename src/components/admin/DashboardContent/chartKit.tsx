import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Chart colours, checked with the dataviz palette validator against the light surface.
export const CHART = {
  current: '#1d4ed8', // brand: this period, single-series bars
  previous: '#94a3b8', // de-emphasis grey: the period before
  home: '#1d4ed8',
  business: '#d97706',
  grid: '#e5e7eb',
  axis: '#5b6472',
};

// Sequential blue ramp for magnitude (heatmap), light to dark.
export const BLUE_RAMP = [
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#2563eb',
  '#1d4ed8',
];

export const axisTick = { fontSize: 12, fill: CHART.axis };

// Signed change against the previous period, with an arrow so it never relies on colour alone.
export const Delta = ({
  value,
  className,
  suffix = '%',
}: {
  value: number | undefined;
  className?: string;
  suffix?: string;
}) => {
  if (value === undefined || Number.isNaN(value)) {
    return <span className={cn('text-xs text-gray-500', className)}>No earlier data</span>;
  }
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold',
        up ? 'bg-green/10 text-hGreen' : 'bg-red/10 text-red',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      <span className="sr-only">{up ? 'Up' : 'Down'} </span>
      {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  );
};

// Tooltip body for the recharts charts: values lead, labels follow, keyed with a short line.
export interface TooltipRow {
  key: string;
  label: string;
  value: string;
  color: string;
}

export const TooltipCard = ({ title, rows }: { title: string; rows: TooltipRow[] }) => (
  <div className="min-w-44 rounded-xl border border-gray-200 bg-white/95 px-3 py-2.5 shadow-[0_12px_28px_-14px_rgb(30_58_138_/_0.45)] backdrop-blur">
    <p className="text-xs text-gray-500">{title}</p>
    <ul className="mt-1.5 space-y-1">
      {rows.map((row) => (
        <li key={row.key} className="flex items-center gap-2">
          <span
            className="h-0.5 w-3 rounded-full"
            style={{ background: row.color }}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold tabular-nums text-gray-900">{row.value}</span>
          <span className="text-xs text-gray-500">{row.label}</span>
        </li>
      ))}
    </ul>
  </div>
);

// "Show as table" twin for a chart, so no value is only reachable by hovering.
export const DataTable = ({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}) => (
  <details className="group mt-3">
    <summary className="inline-flex cursor-pointer list-none items-center rounded-md text-xs font-medium text-brand hover:text-brand-hover [&::-webkit-details-marker]:hidden">
      <span className="group-open:hidden">Show as table</span>
      <span className="hidden group-open:inline">Hide table</span>
    </summary>
    <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white/80">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-gray-50 text-xs text-gray-600">
          <tr>
            {headers.map((header, i) => (
              <th
                key={header}
                scope="col"
                className={cn('px-3 py-2 font-semibold', i === 0 ? 'text-left' : 'text-right')}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row[0])} className="border-t border-gray-100">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={cn(
                    'px-3 py-1.5',
                    i === 0 ? 'text-left text-gray-700' : 'text-right tabular-nums text-gray-900',
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </details>
);
