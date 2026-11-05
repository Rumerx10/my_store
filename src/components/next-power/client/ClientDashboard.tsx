'use client';
import Link from 'next/link';
import { Heart, Package, Ticket, Truck } from 'lucide-react';
import DashboardCard from '@/components/common/DashboardCard';
import Panel from '@/components/common/Panel';
import OrderStatusBadge from '@/components/common/orders/OrderStatusBadge';
import PageHeading from '@/components/common/PageHeading';
import { PageLoader } from '@/components/common/QueryState';
import { useMyOrders } from '@/lib/query/orders';
import { usePublicCoupons } from '@/lib/query/shop';
import { useWishlist } from '@/lib/query/wishlist';
import { formatOrderDate, formatPrice } from '@/lib/utils';
import { orderLabel } from '@/types/customerOrder';

// Customer overview: orders on their way, saved items and the store's coupons.
const ClientDashboard = () => {
  const { orders, isPending, hasNextPage } = useMyOrders();
  const wishlistCount = useWishlist().data?.length ?? 0;
  const couponCount = usePublicCoupons().data?.length ?? 0;
  const inTransit = orders.filter((order) =>
    ['pending', 'processing', 'shipped'].includes(order.status),
  ).length;

  const tiles = [
    {
      title: 'Orders',
      value: `${orders.length}${hasNextPage ? '+' : ''}`,
      icon: Package,
      href: '/next-power/client/my-orders',
    },
    { title: 'On the way', value: inTransit, icon: Truck, href: '/next-power/client/my-orders' },
    { title: 'Wishlist', value: wishlistCount, icon: Heart, href: '/next-power/wish-list' },
    { title: 'Coupons', value: couponCount, icon: Ticket, href: '/next-power/client/coupons' },
  ];

  if (isPending) return <PageLoader label="Loading your dashboard" />;

  return (
    <div>
      <PageHeading title="Dashboard" desc="Your orders and saved items in one place." />

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {tiles.map(({ href, ...tile }) => (
          <li key={tile.title}>
            <Link
              href={href}
              className="block h-full rounded-xl transition-shadow hover:shadow-lift"
            >
              <DashboardCard {...tile} />
            </Link>
          </li>
        ))}
      </ul>

      <Panel
        title="Recent orders"
        className="mt-4"
        action={
          <Link
            href="/next-power/client/my-orders"
            className="rounded text-sm font-medium text-brand hover:text-brand-hover"
          >
            View all
          </Link>
        }
      >
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-100 dark:divide-white/10">
            {orders.slice(0, 4).map((order) => (
              <li key={order.id} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/next-power/client/my-orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded"
                >
                  <div>
                    <p className="text-sm font-medium tabular-nums text-gray-900 dark:text-slate-100">
                      Order {orderLabel(order)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Placed {formatOrderDate(order.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 dark:text-slate-400">
            You haven&apos;t placed an order yet.{' '}
            <Link
              href="/next-power/products"
              className="rounded font-medium text-brand hover:text-brand-hover"
            >
              Start shopping
            </Link>
          </p>
        )}
      </Panel>
    </div>
  );
};

export default ClientDashboard;
