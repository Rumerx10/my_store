'use client';
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
import { rangeInfo, type SalesPoint, type TimeRange } from '@/lib/dashboard';
import { CHART, TooltipCard, axisTick } from './chartKit';

type NumberKey = {
  [K in keyof SalesPoint]: SalesPoint[K] extends number ? K : never;
}[keyof SalesPoint];

// Legend for PeriodBars: this period as a column swatch, the one before as a grey line.
export const PeriodLegend = ({ range }: { range: TimeRange }) => {
  const info = rangeInfo(range);
  return (
    <ul
      className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-slate-400"
      aria-label="Legend"
    >
      <li className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-[3px]" style={{ background: CHART.current }} />
        {info.label}
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-0.5 w-3.5 rounded-full" style={{ background: CHART.previous }} />
        {info.previous.charAt(0).toUpperCase() + info.previous.slice(1)}
      </li>
    </ul>
  );
};

// One measure per hour, day or month as columns, with the previous period as a grey line to beat.
const PeriodBars = ({
  data,
  range,
  value,
  previous,
  format,
  tick,
  axisWidth = 36,
}: {
  data: SalesPoint[];
  range: TimeRange;
  value: NumberKey;
  previous: NumberKey;
  format: (value: number) => string; // tooltip
  tick: (value: number) => string; // y axis
  axisWidth?: number;
}) => {
  const info = rangeInfo(range);
  return (
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
          width={axisWidth}
          tickLine={false}
          axisLine={false}
          tick={axisTick}
          allowDecimals={false}
          tickFormatter={tick}
        />
        <Tooltip
          cursor={{ fill: 'color-mix(in srgb, var(--chart-current) 7%, transparent)' }}
          content={({ active, payload }) => {
            const point = payload?.[0]?.payload as SalesPoint | undefined;
            if (!active || !point) return null;
            return (
              <TooltipCard
                title={point.full}
                rows={[
                  {
                    key: 'now',
                    label: info.label.toLowerCase(),
                    value: format(point[value]),
                    color: CHART.current,
                  },
                  {
                    key: 'before',
                    label: info.previous,
                    value: format(point[previous]),
                    color: CHART.previous,
                  },
                ]}
              />
            );
          }}
        />
        <Bar
          dataKey={value}
          name={info.label}
          fill={CHART.current}
          radius={[4, 4, 0, 0]}
          maxBarSize={24}
          activeBar={{ fill: 'color-mix(in oklch, var(--chart-current) 82%, white)' }}
        />
        <Line
          dataKey={previous}
          name={info.previous}
          type="monotone"
          stroke={CHART.previous}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          dot={false}
          activeDot={{ r: 4, fill: CHART.previous, stroke: 'var(--card)', strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PeriodBars;
