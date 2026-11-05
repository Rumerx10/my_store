'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { CreditCard, MapPin, X } from 'lucide-react';
import BackButton from '@/components/common/BackButton';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import toast from 'react-hot-toast';
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
import { Textarea } from '@/components/ui/textarea';
import { isNotFound } from '@/lib/query/catalog';
import { useCancelOrder, useMyOrder } from '@/lib/query/orders';
import { formatOrderDate, formatPrice } from '@/lib/utils';
import { orderLabel, PAYMENT_METHOD_LABELS } from '@/types/customerOrder';
import OrderProgress from '@/components/common/orders/OrderProgress';
import OrderStatusBadge from '@/components/common/orders/OrderStatusBadge';

const PAYMENT_STATUS_TEXT = {
  paid: 'Paid',
  unpaid: 'To pay on delivery',
  refunded: 'Refunded',
  failed: 'Not charged',
} as const;

const CustomerOrderDetails = ({ backHref }: { backHref: string }) => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isPending, error, refetch } = useMyOrder(decodeURIComponent(id));
  const cancel = useCancelOrder();
  const [reason, setReason] = useState('');

  if (isPending) return <PageLoader label="Loading the order" />;
  if (isNotFound(error)) notFound();
  if (!order) return <ErrorState error={error} onRetry={() => refetch()} />;

  const label = orderLabel(order);
  const cancelled = order.status === 'cancelled';
  const canCancel =
    (order.status === 'pending' || order.status === 'processing') && order.paymentStatus !== 'paid';
  const { totals } = order;
  const rows = [
    { label: `Items (${order.itemCount})`, value: formatPrice(totals.subtotal) },
    ...(totals.discount > 0
      ? [
          {
            label: `Promo ${totals.couponCode ?? ''}`.trim(),
            value: `−${formatPrice(totals.discount)}`,
          },
        ]
      : []),
    { label: `Delivery · ${order.address.label}`, value: formatPrice(totals.shipping) },
    ...(totals.installation > 0
      ? [{ label: 'Installation', value: formatPrice(totals.installation) }]
      : []),
    ...(totals.tax > 0 ? [{ label: 'VAT', value: formatPrice(totals.tax) }] : []),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl tabular-nums text-gray-900 dark:text-slate-100 md:text-3xl">
              Order {label}
            </h1>
            <OrderStatusBadge status={order.status} className="text-sm" />
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
            Placed {formatOrderDate(order.date)}
          </p>
        </div>
        <BackButton href={backHref}>All orders</BackButton>
      </div>

      <section aria-label="Delivery progress" className="mt-6 rounded-xl glass p-5 md:p-6">
        {cancelled ? (
          <p className="flex items-center gap-2 text-sm text-red">
            <X className="size-4" aria-hidden="true" />
            This order was cancelled
            {order.cancelReason ? `: ${order.cancelReason}` : ''}
            {order.paymentStatus === 'refunded' && '. Your payment has been refunded'}.
          </p>
        ) : (
          <OrderProgress status={order.status} />
        )}
        {order.events.length > 0 && (
          <ol className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-white/5">
            {[...order.events].reverse().map((event, index) => (
              <li key={`${event.date}-${index}`} className="flex flex-wrap gap-x-3">
                <time
                  dateTime={event.date}
                  className="w-36 shrink-0 tabular-nums text-gray-500 dark:text-slate-400"
                >
                  {new Date(event.date).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </time>
                <span className="text-gray-900 dark:text-slate-100">
                  {event.title}
                  {event.note && (
                    <span className="text-gray-500 dark:text-slate-400"> · {event.note}</span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
        <section aria-labelledby="order-items" className="rounded-xl glass p-5 md:p-6">
          <h2 id="order-items" className="text-lg text-gray-900 dark:text-slate-100">
            Items
          </h2>
          <ul className="mt-3 divide-y divide-gray-100 dark:divide-white/10">
            {order.items.map((item, index) => (
              <li
                key={`${item.productId}-${item.variant ?? ''}-${index}`}
                className="flex items-center gap-4 py-3"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5">
                  <Image src={item.image} alt="" fill sizes="56px" className="object-contain p-1" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/next-power/products/${item.productId}`}
                    className="block truncate rounded text-sm font-medium text-gray-900 dark:text-slate-100 hover:underline"
                  >
                    {item.title}
                  </Link>
                  {item.variant && (
                    <p className="truncate text-xs text-gray-500 dark:text-slate-400">
                      {item.variant}
                    </p>
                  )}
                  <p className="text-sm tabular-nums text-gray-500 dark:text-slate-400">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2 border-t border-gray-100 dark:border-white/5 pt-4 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between">
                <dt className="text-gray-600 dark:text-slate-400">{row.label}</dt>
                <dd className="tabular-nums text-gray-900 dark:text-slate-100">{row.value}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-gray-100 dark:border-white/5 pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(order.totalAmount)}</dd>
            </div>
          </dl>
        </section>

        <div className="space-y-4">
          <section aria-labelledby="order-address" className="rounded-xl glass p-5">
            <h2
              id="order-address"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-slate-100"
            >
              <MapPin className="size-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
              Delivery address
            </h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">{order.address.name}</p>
            <p className="text-sm text-gray-600 dark:text-slate-400">{order.address.line}</p>
            <p className="text-sm tabular-nums text-gray-500 dark:text-slate-400">
              {order.address.phone}
            </p>
          </section>
          <section aria-labelledby="order-payment" className="rounded-xl glass p-5">
            <h2
              id="order-payment"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-slate-100"
            >
              <CreditCard className="size-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
              Payment
            </h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {PAYMENT_STATUS_TEXT[order.paymentStatus]}
            </p>
          </section>

          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger className="h-11 w-full rounded-lg border border-red/30 bg-white dark:bg-slate-900 text-sm font-medium text-red transition-colors hover:bg-red/5">
                Cancel order
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel order {label}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    The order won&apos;t be delivered and you won&apos;t be charged.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why are you cancelling? (optional)"
                  maxLength={300}
                  aria-label="Reason for cancelling"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep order</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      cancel.mutate(
                        { id: order.id, reason: reason.trim() || 'Cancelled by the customer' },
                        { onSuccess: () => toast.success(`Order ${label} cancelled`) },
                      )
                    }
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
