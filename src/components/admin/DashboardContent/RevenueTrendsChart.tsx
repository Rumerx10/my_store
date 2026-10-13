import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import Panel from '@/components/dashboard/Panel';
import { MONTHLY_REVENUE, WEEKLY_REVENUE, type TimeRange } from '@/docs/adminDashboard';
import { formatPrice } from '@/lib/utils';

const RevenueTrendsChart = ({
  timeRange,
  className,
}: {
  timeRange: TimeRange;
  className?: string;
}) => {
  const yearly = timeRange === 'month';

  return (
    <Panel title={yearly ? 'Revenue this year' : 'Revenue this week'} className={className}>
      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={yearly ? MONTHLY_REVENUE : WEEKLY_REVENUE}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip
              formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid var(--border)',
                boxShadow: 'none',
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.08}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
};

export default RevenueTrendsChart;
