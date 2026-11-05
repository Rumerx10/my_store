'use client';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import Panel from '@/components/common/Panel';
import { rangeInfo, type Dashboard } from '@/lib/dashboard';
import { cn } from '@/lib/utils';
import { CATEGORY_COLORS, CHART, DataTable } from './chartKit';

type Mode = 'units' | 'percent';

const MODES: { value: Mode; label: string; name: string }[] = [
  { value: 'units', label: '123', name: 'Show numbers' },
  { value: 'percent', label: '%', name: 'Show percentages' },
];

const count = (value: number) => value.toLocaleString('en-US');

// Units sold per category as a donut: the five biggest, then the rest as "Other". The middle
// shows the total (or the slice under the pointer) and switches the figures between units and
// shares of the total.
const CategoryUnits = ({ data, className }: { data: Dashboard; className?: string }) => {
  const [mode, setMode] = useState<Mode>('units');
  const [active, setActive] = useState<number | null>(null);
  const range = rangeInfo(data.range);
  const sold = data.categories.filter((c) => c.units > 0).sort((a, b) => b.units - a.units);
  const total = sold.reduce((sum, c) => sum + c.units, 0);
  const rest = sold.slice(CATEGORY_COLORS.length);
  const slices = [
    ...sold
      .slice(0, CATEGORY_COLORS.length)
      .map((c, i) => ({ name: c.name, units: c.units, color: CATEGORY_COLORS[i] })),
    ...(rest.length > 0
      ? [
          {
            name: rest.length === 1 ? rest[0].name : `Other (${rest.length})`,
            units: rest.reduce((sum, c) => sum + c.units, 0),
            color: CHART.previous,
          },
        ]
      : []),
  ];
  const share = (units: number) => `${((units / total) * 100).toFixed(1)}%`;
  const show = (units: number) => (mode === 'units' ? count(units) : share(units));
  const focus = active === null ? undefined : slices[active];

  return (
    <Panel title="Units by category" className={className}>
      <p className="-mt-2 mb-4 text-sm text-gray-600 dark:text-slate-400">
        What sold, {range.label.toLowerCase()}.
      </p>
      {total === 0 ? (
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Nothing sold in this period yet.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
          <div className="relative size-56 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={slices}
                  dataKey="units"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="var(--card)"
                  strokeWidth={2}
                  onMouseEnter={(_, index) => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                >
                  {slices.map((slice, i) => (
                    <Cell
                      key={slice.name}
                      fill={slice.color}
                      fillOpacity={active === null || active === i ? 1 : 0.35}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* The hole: a readout, and the numbers / percent switch. */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-2xl font-semibold tabular-nums tracking-tight text-gray-900 dark:text-slate-100">
                {focus ? show(focus.units) : count(total)}
              </p>
              <p className="max-w-28 truncate text-xs text-gray-500 dark:text-slate-400">
                {focus ? focus.name : 'units sold'}
              </p>
              <div
                role="radiogroup"
                aria-label="Show figures as"
                className="pointer-events-auto mt-2 flex rounded-full bg-gray-100/90 p-0.5 dark:bg-white/10"
              >
                {MODES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={mode === option.value}
                    aria-label={option.name}
                    onClick={() => setMode(option.value)}
                    className={cn(
                      'h-6 min-w-9 rounded-full px-2 text-xs font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                      mode === option.value
                        ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgb(15_23_42_/_0.12)] dark:bg-slate-900 dark:text-slate-100'
                        : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ul className="w-full min-w-0 space-y-1" aria-label="Legend">
            {slices.map((slice, i) => (
              <li
                key={slice.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors',
                  active === i && 'bg-gray-100/80 dark:bg-white/5',
                )}
              >
                <span
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ background: slice.color }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-gray-700 dark:text-slate-300">
                  {slice.name}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                  {show(slice.units)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {total > 0 && (
        <DataTable
          caption={`Units sold by category, ${range.label.toLowerCase()}`}
          headers={['Category', 'Units', 'Share']}
          rows={sold.map((c) => [c.name, count(c.units), share(c.units)])}
        />
      )}
    </Panel>
  );
};

export default CategoryUnits;
