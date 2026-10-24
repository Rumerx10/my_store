'use client';
import { useState } from 'react';
import Panel from '@/components/dashboard/Panel';
import { HEATMAP_DAYS, HEATMAP_SLOTS, ORDERS_HEATMAP } from '@/docs/adminDashboard';
import { cn } from '@/lib/utils';
import { BLUE_RAMP, DataTable } from './chartKit';

const SLOT_STARTS = ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'];

const max = Math.max(...ORDERS_HEATMAP.flat());
const min = Math.min(...ORDERS_HEATMAP.flat());
const step = (value: number) =>
  Math.min(BLUE_RAMP.length - 1, Math.floor(((value - min) / (max - min || 1)) * BLUE_RAMP.length));

const peak = (() => {
  let best = { day: 0, slot: 0 };
  ORDERS_HEATMAP.forEach((row, day) =>
    row.forEach((value, slot) => {
      if (value > ORDERS_HEATMAP[best.day][best.slot]) best = { day, slot };
    }),
  );
  return best;
})();

const describe = (day: number, slot: number) =>
  `${HEATMAP_DAYS[day]} ${HEATMAP_SLOTS[slot]}: ${ORDERS_HEATMAP[day][slot]} orders`;

// Orders by weekday and time of day: when to schedule offers, ads and support staff.
const BusiestTimes = ({ className }: { className?: string }) => {
  const [active, setActive] = useState<{ day: number; slot: number } | null>(null);
  const shown = active ?? peak;

  return (
    <Panel title="Busiest times" className={className}>
      <p className="-mt-2 mb-4 text-sm text-gray-600 dark:text-slate-400">
        Orders by day and time over the last 8 weeks. Run offers and ads just before the peaks.
      </p>

      <p className="mb-3 h-5 text-sm text-gray-700 dark:text-slate-300" aria-live="polite">
        {active ? (
          <span className="font-semibold text-gray-900 dark:text-slate-100">
            {describe(active.day, active.slot)}
          </span>
        ) : (
          <>
            Busiest:{' '}
            <span className="font-semibold text-gray-900 dark:text-slate-100">
              {describe(shown.day, shown.slot)}
            </span>
          </>
        )}
      </p>

      <div
        className="grid grid-cols-[2.25rem_repeat(7,minmax(0,1fr))] gap-0.5"
        role="grid"
        aria-label="Orders by weekday and time of day"
        onMouseLeave={() => setActive(null)}
      >
        <span role="presentation" />
        {SLOT_STARTS.map((slot) => (
          <span
            key={slot}
            role="columnheader"
            className="pb-1 text-center text-[11px] tabular-nums text-gray-500 dark:text-slate-400"
          >
            {slot}
          </span>
        ))}
        {ORDERS_HEATMAP.map((row, day) => (
          <div key={HEATMAP_DAYS[day]} role="row" className="contents">
            <span
              role="rowheader"
              className="flex items-center text-xs text-gray-600 dark:text-slate-400"
            >
              {HEATMAP_DAYS[day]}
            </span>
            {row.map((value, slot) => {
              const level = step(value);
              const isActive = active?.day === day && active.slot === slot;
              return (
                <span
                  key={slot}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={describe(day, slot)}
                  onMouseEnter={() => setActive({ day, slot })}
                  onFocus={() => setActive({ day, slot })}
                  onBlur={() => setActive(null)}
                  className={cn(
                    'h-8 rounded-[4px] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 md:h-9',
                    isActive && 'ring-2 ring-gray-900/70 ring-offset-1 dark:ring-white/70',
                  )}
                  style={{ background: BLUE_RAMP[level] }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-[11px] text-gray-500 dark:text-slate-400">
        Fewer
        <span className="flex gap-0.5" aria-hidden="true">
          {BLUE_RAMP.map((color) => (
            <span key={color} className="size-3 rounded-[3px]" style={{ background: color }} />
          ))}
        </span>
        More orders
      </div>

      <DataTable
        caption="Orders by weekday and time of day, last 8 weeks"
        headers={['Day', ...SLOT_STARTS]}
        rows={ORDERS_HEATMAP.map((row, day) => [HEATMAP_DAYS[day], ...row])}
      />
    </Panel>
  );
};

export default BusiestTimes;
