import Panel from '@/components/dashboard/Panel';
import { ORDERS_BY_RANGE, type TimeRange } from '@/docs/adminDashboard';
import { capitalize } from '@/lib/utils';

const BAR_COLORS: Record<string, string> = {
  delivered: 'bg-green',
  shipped: 'bg-brand',
  pending: 'bg-yellow',
  cancelled: 'bg-red',
};

// Share of orders in each status for the selected period.
const OrderStatus = ({ timeRange, className }: { timeRange: TimeRange; className?: string }) => {
  const stats = ORDERS_BY_RANGE[timeRange];
  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const rows = (['delivered', 'shipped', 'pending', 'cancelled'] as const).map((status) => ({
    status,
    count: stats[status],
    share: total > 0 ? Math.round((stats[status] / total) * 100) : 0,
  }));

  return (
    <Panel title="Orders by status" className={className}>
      <ul className="space-y-4">
        {rows.map((row) => (
          <li key={row.status}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-gray-700">{capitalize(row.status)}</span>
              <span className="tabular-nums text-gray-500">
                <span className="font-medium text-gray-900">{row.count}</span> · {row.share}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
              <div
                className={`h-full rounded-full ${BAR_COLORS[row.status]}`}
                style={{ width: `${row.share}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

export default OrderStatus;
