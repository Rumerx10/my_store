'use client';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { MockOrders } from '@/docs/Orders';
import OrderStatisticsCards from './OrderStatisticsCards';
import OrdersColumns from './OrdersColumns';
import DataTable from '@/components/DataTable';
                                            
export default function OrdersPage() {
  const orders = MockOrders;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');

  // const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');

  const OrderTabsData = [
    { value: 'all', label: 'All', count: orders.length, icon: undefined },
    {
      value: 'pending',
      label: 'Pending',
      count: orders.filter((o) => o.status === 'pending').length,
      icon: Clock,
    },
    {
      value: 'shipped',
      label: 'Shipped',
      count: orders.filter((o) => o.status === 'shipped').length,
      icon: Package,
    },
    {
      value: 'delivered',
      label: 'Delivered',
      count: orders.filter((o) => o.status === 'delivered').length,
      icon: CheckCircle,
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      count: orders.filter((o) => o.status === 'cancelled').length,
      icon: XCircle,
    },
  ];

  const columns = useMemo(() => OrdersColumns(), []);

  // const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  // const avgOrderValue = totalRevenue / orders.length;

  const filteredOrders = useMemo(() => {
    if (activeStatus === 'all') return orders;
    return orders.filter((order) => order.status === activeStatus);
  }, [orders, activeStatus]);

  const table = useReactTable({
    data: filteredOrders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container flex flex-col mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
            <p className="text-muted-foreground">Manage and track all your orders</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <OrderStatisticsCards orders={orders} />

        <DataTable
          table={table}
          title="Order Management"
          desc="View and manage all your orders"
          statusTabsData={OrderTabsData}
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
