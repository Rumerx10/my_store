'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Search, Eye, MoreHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Order, OrderStatus } from '@/types/order';
import { MockOrders } from '@/docs/Orders';
import OrderStatisticsCards from './OrderStatisticsCards';
import OrdersColumns from './OrdersColumns';
import Pagination from '../../Pagination';
import TabsList from './OrderTabsList';
import { Button } from '@/components/ui/button';
import { FILTER_CATEGORIES } from '@/docs/categories';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(MockOrders);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');

  const handleShipOrder = (orderId: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: 'shipped' as const } : order,
      ),
    );
  };

  const columns = useMemo(() => OrdersColumns(handleShipOrder, router), [router]);

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

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

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  };

  const orderCounts = getOrderCounts();
  // const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  // const avgOrderValue = totalRevenue / orders.length;

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

        {/* Search and Filters */}
        <Card>
          <CardHeader className="One">
            <div className="flex gap-16 items-center justify-between">
              <div className="shrink-0">
                <CardTitle>Order Management</CardTitle>
                <CardDescription className="mt-2">View and manage all your orders</CardDescription>
              </div>
            </div>
            <div className="flex gap-5 w-full mt-10">
              <div className="w-1/2">
                <Label className="text-sm font-medium mb-2 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={globalFilter ?? ''}
                    onChange={(event) => setGlobalFilter(String(event.target.value))}
                    className="pl-8 w-full h-10"
                  />
                </div>
              </div>
              <div className="w-1/2 flex gap-5">
                <div className="w-full">
                  <Label className="text-sm font-medium mb-2 block">Show Columns</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 px-3 w-full justify-between bg-transparent"
                      >
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Columns
                        </span>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="w-full">
                  <Label className="text-sm font-medium mb-2 block">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FILTER_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className='mt-5'>
              <Label className="text-sm font-medium mb-2 block">Status</Label>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OrderStatus)}>
                <TabsList orderCounts={orderCounts} />
                <TabsContent value={activeTab} className="space-y-4"></TabsContent>
              </Tabs>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        Data not found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <Pagination table={table} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
