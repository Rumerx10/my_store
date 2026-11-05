'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Banknote, Clock, RotateCcw, Undo2, Wallet, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardCard from '@/components/common/DashboardCard';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ApiPaymentStatus } from '@/lib/api/types';
import { useOrderActions, useStoreOrders, useStoreOrdersSummary } from '@/lib/query/admin';
import { cn, formatOrderDate, formatPrice } from '@/lib/utils';
import { PAYMENT_TYPE_LABELS, type StoreOrderRow, type StorePaymentStatus } from '@/types/order';
import { useAdminHref } from '@/components/admin/adminStore';

const STATUS_INFO: Record<StorePaymentStatus, { label: string; dot: string }> = {
  pending: { label: 'Awaiting', dot: 'bg-sun' },
  paid: { label: 'Paid', dot: 'bg-green' },
  failed: { label: 'Not paid', dot: 'bg-red' },
  refunded: { label: 'Refunded', dot: 'bg-gray-400' },
};

const FILTERS: { value: 'all' | ApiPaymentStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Awaiting payment' },
  { value: 'PAID', label: 'Paid' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'FAILED', label: 'Not paid' },
];

const StatusLabel = ({ status }: { status: StorePaymentStatus }) => (
  <span className="flex items-center gap-2">
    <span className={cn('size-2 rounded-full', STATUS_INFO[status].dot)} aria-hidden="true" />
    {STATUS_INFO[status].label}
  </span>
);

// Payment status of every order, newest first. Sellers confirm cash on delivery here.
const Payments = () => {
  const href = useAdminHref();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['value']>('all');
  const summary = useStoreOrdersSummary();
  const orders = useStoreOrders({ paymentStatus: filter === 'all' ? undefined : filter });
  const { setPayment } = useOrderActions();
  const headClass =
    'h-11 bg-gray-50 dark:bg-white/5 px-4 text-xs font-medium text-gray-500 dark:text-slate-400';

  const pay = (order: StoreOrderRow, status: 'PAID' | 'REFUNDED') => {
    if (
      status === 'REFUNDED' &&
      !window.confirm(
        `Mark #${order.number} refunded? Do this once the money is back with the buyer.`,
      )
    ) {
      return;
    }
    setPayment.mutate(
      { id: order.id, status },
      {
        onSuccess: () =>
          toast.success(
            status === 'REFUNDED'
              ? `#${order.number} marked refunded`
              : order.paymentType === 'cod'
                ? `Cash received for #${order.number}`
                : `#${order.number} marked paid`,
          ),
      },
    );
  };

  const buckets = summary.data?.byPaymentStatus;
  const money = (status: ApiPaymentStatus) =>
    buckets ? formatPrice(Number(buckets[status].amount)) : '…';
  const awaiting = buckets?.PENDING.count ?? 0;
  const cashDue = summary.data?.awaitingCod ?? 0;

  return (
    <div>
      <PageHeading
        title="Payments"
        desc="Money collected and still owed on your orders. Mark cash on delivery as paid once the cash is in."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <DashboardCard title="Collected" value={money('PAID')} icon={Wallet} />
        <DashboardCard
          title="Awaiting payment"
          value={money('PENDING')}
          subtitle={`${awaiting} ${awaiting === 1 ? 'order' : 'orders'}, ${cashDue} cash on delivery`}
          icon={Clock}
        />
        <DashboardCard title="Refunded" value={money('REFUNDED')} icon={RotateCcw} />
        <DashboardCard
          title="Not paid"
          value={money('FAILED')}
          subtitle="Cancelled before paying"
          icon={XCircle}
        />
      </div>

      <div
        role="radiogroup"
        aria-label="Filter payments"
        className="no-scrollbar mt-6 flex gap-1 overflow-x-auto"
      >
        {FILTERS.map((option) => {
          const count =
            option.value === 'all' ? summary.data?.orders : buckets?.[option.value].count;
          const active = filter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFilter(option.value)}
              className={cn(
                'flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors',
                active
                  ? 'bg-brand text-white'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-900/70',
              )}
            >
              {option.label}
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs tabular-nums',
                  active
                    ? 'bg-white/20'
                    : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-400',
                )}
              >
                {count ?? '…'}
              </span>
            </button>
          );
        })}
      </div>

      {orders.isPending ? (
        <PageLoader label="Loading payments" />
      ) : orders.error ? (
        <ErrorState error={orders.error} onRetry={() => orders.refetch()} className="mt-3" />
      ) : (
        <div className="mt-3 overflow-x-auto rounded-xl glass">
          <Table className="min-w-[780px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className={headClass}>Order</TableHead>
                <TableHead className={headClass}>Date</TableHead>
                <TableHead className={headClass}>Customer</TableHead>
                <TableHead className={headClass}>Method</TableHead>
                <TableHead className={headClass}>Status</TableHead>
                <TableHead className={cn(headClass, 'text-right')}>Amount</TableHead>
                <TableHead className={cn(headClass, 'text-right')}>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.rows.map((order) => {
                const canMarkPaid =
                  order.paymentStatus === 'pending' && order.status !== 'cancelled';
                return (
                  <TableRow key={order.id}>
                    <TableCell className="px-4 py-3">
                      <Link
                        href={href(`/orders/${order.id}`)}
                        className="rounded font-medium tabular-nums text-brand hover:text-brand-hover"
                      >
                        #{order.number}
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600 dark:text-slate-400">
                      {formatOrderDate(order.date)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-900 dark:text-slate-100">
                      {order.buyerName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-600 dark:text-slate-400">
                      {PAYMENT_TYPE_LABELS[order.paymentType]}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300">
                      <StatusLabel status={order.paymentStatus} />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-medium tabular-nums text-gray-900 dark:text-slate-100">
                      {formatPrice(order.amount)}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right">
                      {canMarkPaid ? (
                        <button
                          type="button"
                          onClick={() => pay(order, 'PAID')}
                          disabled={setPayment.isPending}
                          className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-3 text-xs font-semibold text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.97] disabled:opacity-60"
                        >
                          <Banknote className="size-3.5" aria-hidden="true" />
                          {order.paymentType === 'cod' ? 'Cash received' : 'Mark paid'}
                        </button>
                      ) : order.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-3">
                          {order.paidAt && (
                            <span className="whitespace-nowrap text-xs text-gray-500 dark:text-slate-400">
                              Paid {formatOrderDate(order.paidAt)}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => pay(order, 'REFUNDED')}
                            disabled={setPayment.isPending}
                            className="inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-full px-2 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-60 dark:text-slate-400 dark:hover:bg-white/10"
                          >
                            <Undo2 className="size-3.5" aria-hidden="true" />
                            Refund
                          </button>
                        </span>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {orders.rows.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-gray-600 dark:text-slate-400">
              No payments with this status.
            </p>
          )}
          {orders.hasNextPage && (
            <div className="border-t border-gray-200/80 px-4 py-3 dark:border-white/10">
              <button
                type="button"
                onClick={() => orders.fetchNextPage()}
                disabled={orders.isFetchingNextPage}
                className="h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
              >
                {orders.isFetchingNextPage ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
