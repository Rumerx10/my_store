'use client';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Panel from '@/components/dashboard/Panel';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { formatPrice } from '@/lib/utils';
import { RootState } from '@/redux/store';

const RecentOrders = () => {
  const orders = [...useSelector((state: RootState) => state.adminOrders)]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <Panel
      title="Recent orders"
      action={
        <Link
          href="/admin/orders"
          className="rounded text-sm font-medium text-brand hover:text-brand-hover"
        >
          View all
        </Link>
      }
    >
      <ul className="divide-y divide-gray-100 dark:divide-white/10">
        {orders.map((order) => (
          <li key={order.id} className="py-3 first:pt-0 last:pb-0">
            <Link
              href={`/admin/orders/${order.id}`}
              className="flex items-center justify-between gap-3 rounded"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium tabular-nums text-gray-900 dark:text-slate-100">
                  {order.id}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                  {order.buyerName}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <OrderStatusBadge status={order.status} />
                <p className="w-24 text-right text-sm font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                  {formatPrice(order.amount)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
};

export default RecentOrders;
