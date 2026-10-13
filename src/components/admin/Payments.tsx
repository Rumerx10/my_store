import Link from 'next/link';
import { Clock, Wallet, XCircle } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import PageHeading from '@/components/profilePages/PageHeading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MockOrders } from '@/docs/Orders';
import { capitalize, cn, formatOrderDate, formatPrice } from '@/lib/utils';
import type { Order } from '@/types/order';

const METHOD_LABELS: Record<Order['paymentType'], string> = {
  cod: 'Cash on delivery',
  card: 'Card',
  paypal: 'PayPal',
  bank_transfer: 'Bank transfer',
};

const STATUS_CLASSES: Record<Order['paymentStatus'], string> = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
};

const sumBy = (status: Order['paymentStatus']) =>
  MockOrders.filter((order) => order.paymentStatus === status).reduce(
    (sum, order) => sum + order.amount,
    0,
  );

// Payment status of every order, newest first.
const Payments = () => {
  const payments = [...MockOrders].sort((a, b) => b.date.localeCompare(a.date));
  const headClass = 'h-11 bg-gray-50 px-4 text-xs font-medium text-gray-500';

  return (
    <div>
      <PageHeading title="Payments" desc="Money collected and still owed on your orders." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
        <DashboardCard title="Collected" value={formatPrice(sumBy('paid'))} icon={Wallet} />
        <DashboardCard title="Awaiting payment" value={formatPrice(sumBy('pending'))} icon={Clock} />
        <div className="col-span-2 lg:col-span-1">
          <DashboardCard title="Failed" value={formatPrice(sumBy('failed'))} icon={XCircle} />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl glass">
        <Table className="min-w-[640px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={headClass}>Order</TableHead>
              <TableHead className={headClass}>Date</TableHead>
              <TableHead className={headClass}>Customer</TableHead>
              <TableHead className={headClass}>Method</TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={cn(headClass, 'text-right')}>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((order) => (
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
                <TableCell className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex rounded-md px-2 py-1 text-xs font-medium',
                      STATUS_CLASSES[order.paymentStatus],
                    )}
                  >
                    {capitalize(order.paymentStatus)}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-right font-medium tabular-nums text-gray-900">
                  {formatPrice(order.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Payments;
