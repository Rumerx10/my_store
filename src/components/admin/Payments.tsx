'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Banknote, Clock, Wallet, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from '@/components/DashboardCard';
import PageHeading from '@/components/profilePages/PageHeading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, formatOrderDate, formatPrice } from '@/lib/utils';
import { setPaymentStatus } from '@/redux/features/adminOrder/adminOrderSlice';
import { RootState } from '@/redux/store';
import type { Order } from '@/types/order';

type PaymentStatus = Order['paymentStatus'];

const METHOD_LABELS: Record<Order['paymentType'], string> = {
  cod: 'Cash on delivery',
  card: 'Card',
  paypal: 'PayPal',
  bank_transfer: 'Bank transfer',
};

const STATUSES: { value: PaymentStatus; label: string; dot: string; pill: string }[] = [
  { value: 'pending', label: 'Awaiting', dot: 'bg-sun', pill: 'bg-sun-soft text-sun-ink' },
  { value: 'paid', label: 'Paid', dot: 'bg-green', pill: 'bg-green/10 text-hGreen' },
  { value: 'failed', label: 'Failed', dot: 'bg-red', pill: 'bg-red/10 text-red' },
];
const statusInfo = (status: PaymentStatus) => STATUSES.find((s) => s.value === status)!;

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Awaiting payment' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
] as const;
type Filter = (typeof FILTERS)[number]['value'];

const StatusLabel = ({ status }: { status: PaymentStatus }) => (
  <span className="flex items-center gap-2">
    <span className={cn('size-2 rounded-full', statusInfo(status).dot)} aria-hidden="true" />
    {statusInfo(status).label}
  </span>
);

// Payment status of every order, newest first. Sellers confirm cash on delivery here.
const Payments = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: RootState) => state.adminOrders);
  const [filter, setFilter] = useState<Filter>('all');

  const payments = [...orders].sort((a, b) => b.date.localeCompare(a.date));
  const shown = filter === 'all' ? payments : payments.filter((o) => o.paymentStatus === filter);
  const sumBy = (status: PaymentStatus) =>
    orders.filter((o) => o.paymentStatus === status).reduce((sum, o) => sum + o.amount, 0);
  const awaiting = orders.filter((o) => o.paymentStatus === 'pending');
  const cashDue = awaiting.filter((o) => o.paymentType === 'cod').length;
  const headClass = 'h-11 bg-gray-50 px-4 text-xs font-medium text-gray-500';

  // Every change can be undone from the toast, so there is no confirm step.
  const changeStatus = (order: Order, status: PaymentStatus) => {
    if (order.paymentStatus === status) return;
    const previous = order.paymentStatus;
    dispatch(setPaymentStatus({ id: order.id, status }));
    const message =
      status === 'paid' && order.paymentType === 'cod'
        ? `Cash received for ${order.id}`
        : `${order.id} marked ${statusInfo(status).label.toLowerCase()}`;
    toast.success(
      (t) => (
        <span className="flex items-center gap-3">
          {message}
          <button
            type="button"
            onClick={() => {
              dispatch(setPaymentStatus({ id: order.id, status: previous }));
              toast.dismiss(t.id);
            }}
            className="rounded-md px-2 py-1 text-sm font-semibold text-brand hover:bg-brand-soft"
          >
            Undo
          </button>
        </span>
      ),
      { duration: 6000 },
    );
  };

  return (
    <div>
      <PageHeading
        title="Payments"
        desc="Money collected and still owed on your orders. Mark cash on delivery as paid once the cash is in."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
        <DashboardCard title="Collected" value={formatPrice(sumBy('paid'))} icon={Wallet} />
        <DashboardCard
          title="Awaiting payment"
          value={formatPrice(sumBy('pending'))}
          subtitle={`${awaiting.length} ${awaiting.length === 1 ? 'order' : 'orders'}, ${cashDue} cash on delivery`}
          icon={Clock}
        />
        <div className="col-span-2 lg:col-span-1">
          <DashboardCard title="Failed" value={formatPrice(sumBy('failed'))} icon={XCircle} />
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Filter payments"
        className="no-scrollbar mt-6 flex gap-1 overflow-x-auto"
      >
        {FILTERS.map((option) => {
          const count =
            option.value === 'all'
              ? orders.length
              : orders.filter((o) => o.paymentStatus === option.value).length;
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
                active ? 'bg-brand text-white' : 'text-gray-700 hover:bg-white/70',
              )}
            >
              {option.label}
              <span
                className={cn(
                  'rounded-full px-1.5 text-xs tabular-nums',
                  active ? 'bg-white/20' : 'bg-gray-100 text-gray-600',
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl glass">
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
            {shown.map((order) => {
              const awaitingCash = order.paymentType === 'cod' && order.paymentStatus === 'pending';
              return (
                <TableRow key={order.id}>
                  <TableCell className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="rounded font-medium tabular-nums text-brand hover:text-brand-hover"
                    >
                      {order.id}
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">
                    {formatOrderDate(order.date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-900">{order.buyerName}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-600">
                    {METHOD_LABELS[order.paymentType]}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <Select
                      value={order.paymentStatus}
                      onValueChange={(value) => changeStatus(order, value as PaymentStatus)}
                    >
                      <SelectTrigger
                        aria-label={`Payment status for ${order.id}`}
                        className={cn(
                          'h-8 w-32 rounded-full border-0 text-xs font-medium shadow-none',
                          statusInfo(order.paymentStatus).pill,
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <StatusLabel status={status.value} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right font-medium tabular-nums text-gray-900">
                    {formatPrice(order.amount)}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    {awaitingCash ? (
                      <button
                        type="button"
                        onClick={() => changeStatus(order, 'paid')}
                        className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-3 text-xs font-semibold text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.97]"
                      >
                        <Banknote className="size-3.5" aria-hidden="true" />
                        Cash received
                      </button>
                    ) : order.paymentStatus === 'paid' && order.paidAt ? (
                      <span className="whitespace-nowrap text-xs text-gray-500">
                        Marked paid {formatOrderDate(order.paidAt)}
                      </span>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {shown.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-gray-600">
            No payments with this status.
          </p>
        )}
      </div>
    </div>
  );
};

export default Payments;
