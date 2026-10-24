'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IOrder, PAYMENT_METHOD_LABELS } from '@/redux/features/order/orderSlice';
import { capitalize, formatOrderDate, formatPrice } from '@/lib/utils';
import OrderStatusBadge from './OrderStatusBadge';

const STATUS_TABS = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

const OrderCard = ({ order, href }: { order: IOrder; href: string }) => {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <li>
      <Link
        href={href}
        className="group block rounded-xl glass p-4 transition-[border-color,box-shadow] hover:border-gray-300 dark:hover:border-white/15 hover:shadow-lift md:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold tabular-nums text-gray-900 dark:text-slate-100">
              {order.id}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Placed {formatOrderDate(order.date)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex -space-x-3">
            {order.items.slice(0, 4).map((item) => (
              <span
                key={`${item.productId}-${item.variant ?? ''}`}
                className="relative size-12 overflow-hidden rounded-lg border-2 border-white dark:border-white/10 bg-gray-50 dark:bg-white/5"
              >
                <Image src={item.image} alt="" fill sizes="48px" className="object-contain p-1" />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                {formatPrice(order.totalAmount)}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} ·{' '}
                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              </p>
            </div>
            <ChevronRight
              className="size-5 text-gray-400 dark:text-slate-500 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </li>
  );
};

// Order history with status tabs. `detailHref` decides where each order links to.
const OrderList = ({ detailHref }: { detailHref: (id: string) => string }) => {
  const orders = useSelector((state: RootState) => state.orderlist.orders);

  return (
    <Tabs defaultValue="all">
      <TabsList className="w-full justify-start sm:w-auto">
        {STATUS_TABS.map((status) => {
          const count =
            status === 'all' ? orders.length : orders.filter((o) => o.status === status).length;
          return (
            <TabsTrigger key={status} value={status}>
              {status === 'all' ? 'All orders' : capitalize(status)}
              <span className="tabular-nums text-gray-400 dark:text-slate-500">{count}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {STATUS_TABS.map((status) => {
        const list = status === 'all' ? orders : orders.filter((o) => o.status === status);
        return (
          <TabsContent key={status} value={status} className="mt-5">
            {list.length > 0 ? (
              <ul className="space-y-3">
                {list.map((order) => (
                  <OrderCard key={order.id} order={order} href={detailHref(order.id)} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 px-6 py-14 text-center">
                <Package className="size-10 text-gray-300 dark:text-slate-600" aria-hidden="true" />
                <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">
                  {status === 'all' ? 'No orders yet' : `No ${status} orders`}
                </p>
                <Link
                  href="/products"
                  className="mt-2 rounded text-sm font-medium text-brand hover:text-brand-hover"
                >
                  Start shopping
                </Link>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default OrderList;
