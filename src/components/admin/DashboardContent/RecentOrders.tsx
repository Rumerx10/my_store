'use client';
import Link from 'next/link';
import Panel from '@/components/common/Panel';
import OrderStatusBadge from '@/components/common/orders/OrderStatusBadge';
import { useStoreOrders } from '@/lib/query/admin';
import { formatPrice } from '@/lib/utils';
import { useAdminHref } from '@/components/admin/adminStore';

// The five newest orders, whatever the dashboard's period.
const RecentOrders = () => {
  const href = useAdminHref();
  const { rows, isPending } = useStoreOrders();
  const orders = rows.slice(0, 5);

  return (
    <Panel
      title="Recent orders"
      action={
        <Link
          href={href('/orders')}
          className="rounded text-sm font-medium text-brand hover:text-brand-hover"
        >
          View all
        </Link>
      }
    >
      {!isPending && orders.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-slate-400">No orders yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-white/10">
          {orders.map((order) => (
            <li key={order.id} className="py-3 first:pt-0 last:pb-0">
              <Link
                href={href(`/orders/${order.id}`)}
                className="flex items-center justify-between gap-3 rounded"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium tabular-nums text-gray-900 dark:text-slate-100">
                    #{order.number}
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
      )}
    </Panel>
  );
};

export default RecentOrders;
