'use client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, CreditCard, MapPin, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cancelOrder, PAYMENT_METHOD_LABELS } from '@/redux/features/order/orderSlice';
import { formatOrderDate, formatPrice } from '@/lib/utils';
import OrderProgress from './OrderProgress';
import OrderStatusBadge from './OrderStatusBadge';

const CustomerOrderDetails = ({ backHref }: { backHref: string }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) =>
    state.orderlist.orders.find((o) => o.id === decodeURIComponent(id)),
  );

  if (!order) notFound();

  const cancelled = order.status === 'cancelled';
  const canCancel = order.status === 'pending' || order.status === 'processing';
  const subTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All orders
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl tabular-nums text-gray-900 md:text-3xl">Order {order.id}</h1>
          <p className="mt-1 text-sm text-gray-600">Placed {formatOrderDate(order.date)}</p>
        </div>
        <OrderStatusBadge status={order.status} className="text-sm" />
      </div>

      <section aria-label="Delivery progress" className="mt-6 rounded-xl glass p-5 md:p-6">
        {cancelled ? (
          <p className="flex items-center gap-2 text-sm text-red">
            <X className="size-4" aria-hidden="true" />
            This order was cancelled
            {order.paymentStatus === 'refunded' && ' and your payment has been refunded'}.
          </p>
        ) : (
          <OrderProgress status={order.status} />
        )}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
        <section aria-labelledby="order-items" className="rounded-xl glass p-5 md:p-6">
          <h2 id="order-items" className="text-lg text-gray-900">
            Items
          </h2>
          <ul className="mt-3 divide-y divide-gray-100">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 py-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                  <Image src={item.image} alt="" fill sizes="56px" className="object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.productId}`}
                    className="block truncate rounded text-sm font-medium text-gray-900 hover:underline"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm tabular-nums text-gray-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2 border-t border-gray-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Items</dt>
              <dd className="tabular-nums text-gray-900">{formatPrice(subTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Delivery and VAT</dt>
              <dd className="tabular-nums text-gray-900">
                {formatPrice(Math.max(order.totalAmount - subTotal, 0))}
              </dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(order.totalAmount)}</dd>
            </div>
          </dl>
        </section>

        <div className="space-y-4">
          <section aria-labelledby="order-address" className="rounded-xl glass p-5">
            <h2 id="order-address" className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MapPin className="size-4 text-gray-400" aria-hidden="true" />
              Delivery to {order.address.label.toLowerCase()}
            </h2>
            <p className="mt-2 text-sm text-gray-700">{order.address.name}</p>
            <p className="text-sm text-gray-600">{order.address.line}</p>
            <p className="text-sm tabular-nums text-gray-500">{order.address.phone}</p>
          </section>
          <section aria-labelledby="order-payment" className="rounded-xl glass p-5">
            <h2 id="order-payment" className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <CreditCard className="size-4 text-gray-400" aria-hidden="true" />
              Payment
            </h2>
            <p className="mt-2 text-sm text-gray-700">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</p>
            <p className="text-sm capitalize text-gray-500">{order.paymentStatus}</p>
          </section>

          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger className="h-11 w-full rounded-lg border border-red/30 bg-white text-sm font-medium text-red transition-colors hover:bg-red/5">
                Cancel order
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel order {order.id}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {order.paymentStatus === 'paid'
                      ? 'Your payment will be refunded to the original payment method within 7 days.'
                      : "The order won't be delivered and you won't be charged."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep order</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      dispatch(cancelOrder(order.id));
                      toast.success(`Order ${order.id} cancelled`);
                    }}
                    className="bg-red text-white hover:bg-red/90"
                  >
                    Cancel order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderDetails;
