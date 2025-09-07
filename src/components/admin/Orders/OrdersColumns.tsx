'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Eye, ArrowUpDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/order';
import { getStatusColor, getStatusIcon } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { TbTruckDelivery } from 'react-icons/tb';
import { PiShippingContainer } from 'react-icons/pi';


const OrdersColumns = () => {
  const columnHelper = createColumnHelper<Order>();
  const router = useRouter();
  return [
    columnHelper.accessor('id', {
      header: ({ column }) => (
        <div
          // variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3 flex items-center gap-2 "
        >
          Order ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    }),

    columnHelper.accessor('date', {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3 flex items-center gap-2 "
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => <div>{new Date(row.getValue('date')).toLocaleDateString()}</div>,
    }),

    columnHelper.accessor('buyerName', {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3 flex items-center gap-2 "
        >
          Buyer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('buyerName')}</div>,
    }),

    columnHelper.accessor('amount', {
      header: ({ column }) => (
        <div
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2 lg:px-3 flex items-center gap-2 "
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    }),

    columnHelper.accessor('status', {
      // header: 'Status',
      header: () => <div className="h-8 px-2 lg:px-3 flex items-center gap-2 ">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue('status') as Order['status'];
        return (
          <Badge className={`${getStatusColor(status)} flex items-center gap-1 w-fit`}>
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    }),

    columnHelper.display({
      id: 'actions',
      // header: 'Actions',
      header: () => <div className="h-8 px-2 lg:px-3 flex items-center gap-2 ">Actions</div>,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center  gap-2">            
            {order.status === 'pending' && (
              <Button
                title="Ship Order"
                variant="outline"
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="flex items-center"
              >
                <PiShippingContainer className="h-4 w-4" />
              </Button>
            )}
             {order.status === 'pending' && (
              <Button
                title="Out for Delivery"
                variant="outline"
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="flex items-center"
              >
                <TbTruckDelivery className="h-4 w-4" />
              </Button>
            )}
            <Button
              title="Order Details"
              variant="outline"
              onClick={() => router.push(`/admin/orders/${order.id}`)}
              className="flex items-center"
            >
              <CheckCircle className="h-4 w-4" />              
            </Button>
            <Button
              title="Order Details"
              variant="outline"
              onClick={() => router.push(`/admin/orders/${order.id}`)}
              className="flex items-center"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ];
};

export default OrdersColumns;
