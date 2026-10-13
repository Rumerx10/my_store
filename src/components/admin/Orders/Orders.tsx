'use client';
import { useState, useMemo } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { MockOrders } from '@/docs/Orders';
import DataTable from '@/components/DataTable';
import PageHeading from '@/components/profilePages/PageHeading';
import { capitalize } from '@/lib/utils';
import OrderStatisticsCards from './OrderStatisticsCards';
import OrdersColumns from './OrdersColumns';

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'] as const;

export default function OrdersPage() {
  const orders = MockOrders;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');

  const statusTabs = [
    { value: 'all', label: 'All', count: orders.length },
    ...STATUSES.map((status) => ({
      value: status,
      label: capitalize(status),
      count: orders.filter((order) => order.status === status).length,
    })),
  ];

  const columns = useMemo(() => OrdersColumns(), []);

  const filteredOrders = useMemo(
    () =>
      activeStatus === 'all' ? orders : orders.filter((order) => order.status === activeStatus),
    [orders, activeStatus],
  );

  const table = useReactTable({
    data: filteredOrders,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: { sorting, columnVisibility, globalFilter },
  });

  return (
    <div>
      <PageHeading title="Orders" desc="Track and fulfil customer orders." />
      <div className="space-y-4">
        <OrderStatisticsCards orders={orders} />
        <DataTable
          table={table}
          noun="orders"
          statusTabsData={statusTabs}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnLength={columns.length}
        />
      </div>
    </div>
  );
}
