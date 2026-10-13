import Link from 'next/link';
import { createColumnHelper } from '@tanstack/react-table';
import SortHeader from '@/components/dashboard/SortHeader';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { formatOrderDate, formatPrice } from '@/lib/utils';
import { Order } from '@/types/order';

const OrdersColumns = () => {
  const columnHelper = createColumnHelper<Order>();
  return [
    columnHelper.accessor('id', {
      header: ({ column }) => <SortHeader column={column} label="Order" />,
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums text-gray-900">{getValue()}</span>
      ),
    }),
    columnHelper.accessor('date', {
      header: ({ column }) => <SortHeader column={column} label="Date" />,
      cell: ({ getValue }) => <span className="text-gray-600">{formatOrderDate(getValue())}</span>,
    }),
    columnHelper.accessor('buyerName', {
      id: 'customer',
      header: ({ column }) => <SortHeader column={column} label="Customer" />,
      cell: ({ getValue }) => <span className="text-gray-900">{getValue()}</span>,
    }),
    columnHelper.accessor('amount', {
      header: ({ column }) => <SortHeader column={column} label="Amount" />,
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums text-gray-900">{formatPrice(getValue())}</span>
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
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="rounded text-sm font-medium text-brand hover:text-brand-hover"
        >
          View<span className="sr-only"> order {row.original.id}</span>
        </Link>
      ),
    }),
  ];
};

export default OrdersColumns;
