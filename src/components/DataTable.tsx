'use client';

import { Label } from '@/components/ui/label';
import { Search, Eye, MoreHorizontal, Plus, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardDescription, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Table as TanstackTable } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { FILTER_CATEGORIES } from '@/docs/categories';
import TabList from './TabList';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import Pagination from './Pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DataTable = <T,>({
  table,
  columnLength,
  stockStatusFilter,
  globalFilter,
  setGlobalFilter,
  categoryFilter,
  setCategoryFilter,
  activeTab,
  setActiveTab,
  title,
  desc,
}: {
  table: TanstackTable<T>;
  columnLength: number;
  stockStatusFilter:string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  categoryFilter?: string;
  setCategoryFilter?: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  title: string;
  desc: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex gap-16 items-center justify-between">
          <div className="shrink-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-2">{desc}</CardDescription>
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
            {categoryFilter !== undefined && setCategoryFilter && (
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
            )}
          </div>
        </div>

        <div className="mt-5">
          <Label className="text-sm font-medium mb-2 block">Status</Label>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
            <TabList />
            <TabsContent value={activeTab} />
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold text-gray-900">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columnLength} className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      {globalFilter || categoryFilter !== 'All Categories'
                        ? 'Try adjusting your search or filter criteria'
                        : 'Get started by adding your first product'}
                    </p>
                    <Link href="/admin/products/add">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <div className="border-t bg-white px-4 mx-4 mb-6 pb-6 mt-10">
        <Pagination table={table} />
      </div>
    </Card>
  );
};

export default DataTable;