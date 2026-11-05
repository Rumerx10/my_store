import Panel from '@/components/common/Panel';
import type { Dashboard } from '@/lib/dashboard';
import type { ApiOrderStatus } from '@/lib/api/types';

const STATUS: Record<ApiOrderStatus, { label: string; bar: string }> = {
  DELIVERED: { label: 'Delivered', bar: 'bg-green' },
  SHIPPED: { label: 'Shipped', bar: 'bg-brand' },
  PROCESSING: { label: 'Being packed', bar: 'bg-sky-400' },
  PENDING: { label: 'Pending', bar: 'bg-yellow' },
  CANCELLED: { label: 'Cancelled', bar: 'bg-red' },
  RETURNED: { label: 'Returned', bar: 'bg-gray-400' },
};

// Orders placed in the period, by the status they have now.
const OrderStatus = ({ data, className }: { data: Dashboard; className?: string }) => {
  const total = data.statusCounts.reduce((sum, row) => sum + row.count, 0);
  const rows = data.statusCounts
    // Returned orders are rare; only show the row when there are some.
    .filter((row) => row.status !== 'RETURNED' || row.count > 0)
    .map((row) => ({
      ...row,
      share: total > 0 ? Math.round((row.count / total) * 100) : 0,
    }));

  return (
    <Panel title="Orders by status" className={className}>
      {total === 0 ? (
        <p className="text-sm text-gray-600 dark:text-slate-400">No orders in this period yet.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.status}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="text-gray-700 dark:text-slate-300">
                  {STATUS[row.status].label}
                </span>
                <span className="tabular-nums text-gray-500 dark:text-slate-400">
                  <span className="font-medium text-gray-900 dark:text-slate-100">{row.count}</span>{' '}
                  · {row.share}%
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10"
                aria-hidden="true"
              >
                <div
                  className={`h-full rounded-full ${STATUS[row.status].bar}`}
                  style={{ width: `${row.share}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

export default OrderStatus;
