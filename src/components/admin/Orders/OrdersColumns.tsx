import Link from 'next/link';
import { Printer } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import SortHeader from '@/components/admin/SortHeader';
import OrderStatusBadge from '@/components/common/orders/OrderStatusBadge';
import { capitalize, formatOrderDate, formatPrice } from '@/lib/utils';
import type { StoreOrderRow } from '@/types/order';

// `href` makes seller-centre links for the store on screen (useAdminHref).
const OrdersColumns = (href: (path?: string) => string) => {
  const columnHelper = createColumnHelper<StoreOrderRow>();
  return [
    columnHelper.accessor('number', {
      id: 'order',
      header: ({ column }) => <SortHeader column={column} label="Order" />,
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums text-gray-900 dark:text-slate-100">
          #{getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('date', {
      header: ({ column }) => <SortHeader column={column} label="Date" />,
      cell: ({ getValue }) => (
        <span className="text-gray-600 dark:text-slate-400">{formatOrderDate(getValue())}</span>
      ),
    }),
    columnHelper.accessor('buyerName', {
      id: 'customer',
      header: ({ column }) => <SortHeader column={column} label="Customer" />,
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate text-gray-900 dark:text-slate-100">{row.original.buyerName}</p>
          <p className="text-xs tabular-nums text-gray-500 dark:text-slate-400">
            {row.original.buyerPhone}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('amount', {
      header: ({ column }) => <SortHeader column={column} label="Amount" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium tabular-nums text-gray-900 dark:text-slate-100">
            {formatPrice(row.original.amount)}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            {row.original.itemCount} {row.original.itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor('paymentStatus', {
      id: 'payment',
      header: 'Payment',
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600 dark:text-slate-400">
          {getValue() === 'pending' ? 'Awaiting' : capitalize(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => <OrderStatusBadge status={getValue()} />,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-3">
          {row.original.status !== 'cancelled' && (
            <a
              href={href(`/print/invoices?ids=${row.original.id}&print=1`)}
              target="_blank"
              rel="noopener"
              title="Print invoice"
              className="rounded p-1 text-gray-500 transition-colors hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <Printer className="size-4" aria-hidden="true" />
              <span className="sr-only">Print invoice for order #{row.original.number}</span>
            </a>
          )}
          <Link
            href={href(`/orders/${row.original.id}`)}
            className="rounded text-sm font-medium text-brand hover:text-brand-hover"
          >
            View<span className="sr-only"> order #{row.original.number}</span>
          </Link>
        </div>
      ),
    }),
  ];
};

export default OrdersColumns;
