'use client';

import { useState } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Printer,
  RotateCcw,
  Truck,
  Undo2,
  User,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import BackButton from '@/components/common/BackButton';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import CancelOrderModal from '@/components/admin/Orders/CancelOrderModal';
import Panel from '@/components/common/Panel';
import OrderProgress from '@/components/common/orders/OrderProgress';
import OrderStatusBadge from '@/components/common/orders/OrderStatusBadge';
import type { ApiOrderStatus } from '@/lib/api/types';
import { useOrderActions, useStoreOrder } from '@/lib/query/admin';
import { isNotFound } from '@/lib/query/catalog';
import { formatOrderDate, formatPrice } from '@/lib/utils';
import { PAYMENT_TYPE_LABELS, type Order } from '@/types/order';
import { useAdminHref } from '@/components/admin/adminStore';

// The one move forward from each status; the API checks it again.
const NEXT_STEP: Partial<
  Record<Order['status'], { to: ApiOrderStatus; label: string; done: string; icon: typeof Truck }>
> = {
  pending: { to: 'PROCESSING', label: 'Confirm and pack', done: 'confirmed', icon: Package },
  processing: { to: 'SHIPPED', label: 'Mark as shipped', done: 'marked as shipped', icon: Truck },
  shipped: {
    to: 'DELIVERED',
    label: 'Mark as delivered',
    done: 'marked as delivered',
    icon: CheckCircle2,
  },
};

const PAYMENT_STATUS_TEXT: Record<Order['paymentStatus'], string> = {
  pending: 'Awaiting payment',
  paid: 'Paid',
  failed: 'Not paid (cancelled)',
  refunded: 'Refunded',
};

const actionClass =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-50 dark:hover:bg-white/5';

const sideHeading =
  'flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-slate-100';

// Seller view of one order: progress, items, buyer details and fulfilment actions.
const OrderDetails = () => {
  const href = useAdminHref();
  const { id } = useParams<{ id: string }>();
  const { data: order, isPending, error, refetch } = useStoreOrder(decodeURIComponent(id));
  const { changeStatus, setPayment } = useOrderActions();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const busy = changeStatus.isPending || setPayment.isPending;

  if (isPending) return <PageLoader label="Loading the order" />;
  if (isNotFound(error)) notFound();
  if (!order) return <ErrorState error={error} onRetry={() => refetch()} />;

  const status = order.status;
  const label = `#${order.number}`;
  const next = NEXT_STEP[status];
  const canCancel = status === 'pending' || status === 'processing';
  const canReturn = status === 'shipped' || status === 'delivered';
  const canMarkPaid = order.paymentStatus === 'pending' && status !== 'cancelled';
  const canRefund = order.paymentStatus === 'paid';
  // Opens in a new tab and goes straight to the print dialog.
  const invoiceHref = href(`/print/invoices?ids=${order.id}&print=1`);

  const move = (
    to: ApiOrderStatus,
    done: string,
    extra: { note?: string; restock?: boolean } = {},
  ) =>
    changeStatus.mutate(
      { id: order.id, status: to, ...extra },
      { onSuccess: () => toast.success(`Order ${label} ${done}`) },
    );

  const pay = (paymentStatus: 'PAID' | 'REFUNDED') =>
    setPayment.mutate(
      { id: order.id, status: paymentStatus },
      {
        onSuccess: () =>
          toast.success(
            paymentStatus === 'PAID' ? `Payment received for ${label}` : `${label} marked refunded`,
          ),
      },
    );

  const handleReturn = () => {
    const restock = window.confirm(
      'Put the returned items back in stock? Choose Cancel if they are damaged and can’t be sold again.',
    );
    move('RETURNED', 'marked as returned', { restock });
  };

  const handleRefund = () => {
    if (window.confirm(`Mark ${label} refunded? Do this once the money is back with the buyer.`)) {
      pay('REFUNDED');
    }
  };

  const { totals } = order;
  const costKnown = order.items.every((item) => item.unitCost !== undefined);
  const cost = order.items.reduce((sum, item) => sum + (item.unitCost ?? 0) * item.quantity, 0);
  const goods = totals.subtotal - totals.discount;
  const rows = [
    { label: 'Items', value: formatPrice(totals.subtotal) },
    ...(totals.discount > 0
      ? [
          {
            label: `Promo${totals.couponCode ? ` ${totals.couponCode}` : ''}`,
            value: `−${formatPrice(totals.discount)}`,
          },
        ]
      : []),
    { label: `Delivery · ${order.shippingAddress.method}`, value: formatPrice(totals.shipping) },
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
            <OrderStatusBadge status={status} className="text-sm" />
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
            Placed {formatOrderDate(order.date)}
          </p>
        </div>
        <BackButton href={href('/orders')} className="print:hidden">
          All orders
        </BackButton>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 print:hidden">
        <a href={`tel:${order.buyerPhone}`} className={actionClass}>
          <Phone className="size-4" aria-hidden="true" />
          Call buyer
        </a>
        {status !== 'cancelled' && (
          <a href={invoiceHref} target="_blank" rel="noopener" className={actionClass}>
            <Printer className="size-4" aria-hidden="true" />
            Print invoice
          </a>
        )}
      </div>

      <Panel className="mt-6">
        {status === 'cancelled' ? (
          <p className="flex items-center gap-2 text-sm text-red">
            <X className="size-4" aria-hidden="true" />
            This order was cancelled{order.cancelReason ? `: ${order.cancelReason}` : '.'}
          </p>
        ) : status === 'returned' ? (
          <p className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
            <RotateCcw className="size-4" aria-hidden="true" />
            This order was returned.
          </p>
        ) : (
          <OrderProgress status={status} />
        )}
        {order.timeline.length > 0 && (
          <ol className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-white/5">
            {[...order.timeline].reverse().map((event) => (
              <li key={event.id} className="flex flex-wrap gap-x-3">
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
                  {event.description && (
                    <span className="text-gray-500 dark:text-slate-400">
                      {' '}
                      · {event.description}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ol>
        )}
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Panel title="Items">
          <ul className="divide-y divide-gray-100 dark:divide-white/10">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3 first:pt-0">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 dark:bg-white/5">
                  <Image
                    src={item.image || '/placeholder.svg'}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-slate-100">
                    {item.name}
                  </p>
                  <p className="text-sm tabular-nums text-gray-500 dark:text-slate-400">
                    {item.quantity} × {formatPrice(item.price)} · SKU {item.sku}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-gray-100 dark:border-white/5 pt-4 text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between">
                <dt className="text-gray-600 dark:text-slate-400">{row.label}</dt>
                <dd className="tabular-nums text-gray-900 dark:text-slate-100">{row.value}</dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-semibold dark:border-white/5">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(order.amount)}</dd>
            </div>
            {costKnown && goods > 0 && (
              <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 print:hidden">
                <dt>Profit on the goods</dt>
                <dd className="tabular-nums">
                  {formatPrice(goods - cost)} ({Math.round(((goods - cost) / goods) * 100)}%)
                </dd>
              </div>
            )}
          </dl>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <h2 className={sideHeading}>
              <User className="size-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
              Buyer
            </h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">{order.buyerName}</p>
            <p className="text-sm tabular-nums text-gray-500 dark:text-slate-400">
              {order.buyerPhone}
            </p>

            <h2 className={`mt-5 ${sideHeading}`}>
              <MapPin className="size-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
              Delivery address
            </h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">
              {order.shippingAddress.name} · {order.shippingAddress.phone}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {order.shippingAddress.line}
            </p>

            {order.note && (
              <>
                <h2 className={`mt-5 ${sideHeading}`}>
                  <MessageSquare
                    className="size-4 text-gray-400 dark:text-slate-500"
                    aria-hidden="true"
                  />
                  Note from the buyer
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm text-gray-700 dark:text-slate-300">
                  {order.note}
                </p>
              </>
            )}

            <h2 className={`mt-5 ${sideHeading}`}>
              <CreditCard className="size-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
              Payment
            </h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">
              {PAYMENT_TYPE_LABELS[order.paymentType]}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {PAYMENT_STATUS_TEXT[order.paymentStatus]}
              {order.paymentStatus === 'paid' &&
                order.paidAt &&
                ` · ${formatOrderDate(order.paidAt)}`}
            </p>
            {(canMarkPaid || canRefund) && (
              <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                {canMarkPaid && (
                  <button
                    type="button"
                    onClick={() => pay('PAID')}
                    disabled={busy}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.97] disabled:opacity-60"
                  >
                    <Banknote className="size-4" aria-hidden="true" />
                    {order.paymentType === 'cod' ? 'Cash received' : 'Mark paid'}
                  </button>
                )}
                {canRefund && (
                  <button
                    type="button"
                    onClick={handleRefund}
                    disabled={busy}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-300 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    <Undo2 className="size-4" aria-hidden="true" />
                    Mark refunded
                  </button>
                )}
              </div>
            )}
          </Panel>

          {(next || canCancel || canReturn) && (
            <div className="flex flex-col gap-2 print:hidden">
              {status === 'processing' && (
                <div className="mb-2 rounded-xl border border-brand/25 bg-brand-soft p-4">
                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    Packed and ready to go?
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-400">
                    Print the invoice, tape the top half to the parcel and put the bottom half
                    inside. Then mark the order shipped.
                  </p>
                  <a
                    href={invoiceHref}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 inline-flex h-9 items-center gap-2 rounded-full border border-brand/40 bg-white px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white dark:bg-slate-900"
                  >
                    <Printer className="size-4" aria-hidden="true" />
                    Print invoice
                  </a>
                </div>
              )}
              {next && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => move(next.to, next.done)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60"
                >
                  <next.icon className="size-4" aria-hidden="true" />
                  {next.label}
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setShowCancelModal(true)}
                  className="h-11 rounded-lg border border-red/30 bg-white dark:bg-slate-900 text-sm font-medium text-red transition-colors hover:bg-red/5 disabled:opacity-60"
                >
                  Cancel order
                </button>
              )}
              {canReturn && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleReturn}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Mark as returned
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <CancelOrderModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        onConfirm={(reason) => {
          setShowCancelModal(false);
          move('CANCELLED', 'cancelled', { note: reason });
        }}
        orderId={label}
      />
    </div>
  );
};

export default OrderDetails;
