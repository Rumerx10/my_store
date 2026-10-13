'use client';
import Link from 'next/link';
import { Heart, Package, Ticket, Truck } from 'lucide-react';
import { useSelector } from 'react-redux';
import DashboardCard from '@/components/DashboardCard';
import Panel from '@/components/dashboard/Panel';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import PageHeading from '@/components/profilePages/PageHeading';
import { COUPONS } from '@/lib/checkout';
import { formatOrderDate, formatPrice } from '@/lib/utils';
import { RootState } from '@/redux/store';

// Customer overview built from the same orders and wishlist the storefront uses.
const ClientDashboard = () => {
  const orders = useSelector((state: RootState) => state.orderlist.orders);
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);
  const inTransit = orders.filter((order) =>
    ['pending', 'processing', 'shipped'].includes(order.status),
  ).length;

  const tiles = [
    { title: 'Orders', value: orders.length, icon: Package, href: '/client/my-orders' },
    { title: 'On the way', value: inTransit, icon: Truck, href: '/client/my-orders' },
    { title: 'Wishlist', value: wishlistCount, icon: Heart, href: '/wish-list' },
    { title: 'Coupons', value: COUPONS.length, icon: Ticket, href: '/client/coupons' },
  ];

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
            href="/client/my-orders"
            className="rounded text-sm font-medium text-brand hover:text-brand-hover"
          >
            View all
          </Link>
        }
      >
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {orders.slice(0, 4).map((order) => (
              <li key={order.id} className="py-3 first:pt-0 last:pb-0">
                <Link
                  href={`/client/my-orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded"
                >
                  <div>
                    <p className="text-sm font-medium tabular-nums text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">Placed {formatOrderDate(order.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <p className="text-sm font-semibold tabular-nums text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">
            You haven&apos;t placed an order yet.{' '}
            <Link href="/products" className="rounded font-medium text-brand hover:text-brand-hover">
              Start shopping
            </Link>
          </p>
        )}
      </Panel>
    </div>
  );
};

export default ClientDashboard;
