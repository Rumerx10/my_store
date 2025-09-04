'use client';

import { Label } from '@/components/ui/label';
import { Search, Eye, MoreHorizontal, Plus, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardDescription, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
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
import { TabsDataType } from '@/types/Types';

const DataTable = <T,>({
  table,
  title,
  desc,
  statusTabsData,
  activeStatus,
  setActiveStatus,
  columnLength,
  globalFilter,
  setGlobalFilter,
  categoryFilter,
  setCategoryFilter,
}: {
  table: TanstackTable<T>;
  title: string;
  desc: string;
  statusTabsData: TabsDataType[];
  activeStatus: string;
  setActiveStatus: (value: string) => void;
  columnLength: number;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  categoryFilter?: string;
  setCategoryFilter?: (value: string) => void;
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
          <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value)}>
            <TabList tabsData={statusTabsData} />
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
                    <TableHead
                      key={header.id}
                      className="h-16 bg-gray-200 pl-0 font-semibold shrink-0 text-gray-900"
                    >
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
                  <TableRow key={row.id} className="hover:bg-black-50">
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No {title.split(' ')[0]} found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {globalFilter || categoryFilter !== 'All Categories'
                        ? 'Try adjusting your search or filter criteria'
                        : 'Get started by adding your first product'}
                    </p>
                    {title.split(' ')[0].toLowerCase() === 'products' && (
                      <Link href="/admin/products/add-product">
                        <Button className="w-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Product
                        </Button>
                      </Link>
                    )}
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
