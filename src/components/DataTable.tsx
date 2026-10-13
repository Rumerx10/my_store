'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { FILTER_CATEGORIES } from '@/docs/categories';
import { TabsDataType } from '@/types/Types';
import Pagination from './Pagination';

// Filterable table used by the admin lists. `noun` is the plural item name, e.g. "orders".
const DataTable = <T,>({
  table,
  noun,
  statusTabsData,
  activeStatus,
  setActiveStatus,
  columnLength,
  globalFilter,
  setGlobalFilter,
  categoryFilter,
  setCategoryFilter,
  emptyAction,
}: {
  table: TanstackTable<T>;
  noun: string;
  statusTabsData: TabsDataType[];
  activeStatus: string;
  setActiveStatus: (value: string) => void;
  columnLength: number;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  categoryFilter?: string;
  setCategoryFilter?: (value: string) => void;
  emptyAction?: React.ReactNode;
}) => {
  const filtered =
    Boolean(globalFilter) ||
    activeStatus !== 'all' ||
    (categoryFilter !== undefined && categoryFilter !== FILTER_CATEGORIES[0]);

  return (
    <div className="rounded-xl glass">
      <div className="flex flex-col gap-3 p-4 md:p-5">
        <Tabs value={activeStatus} onValueChange={setActiveStatus}>
          <TabsList className="w-full justify-start sm:w-auto">
            {statusTabsData.map(({ value, label, count }) => (
              <TabsTrigger key={value} value={value}>
                {label}
                <span className="tabular-nums text-gray-400">{count}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label={`Search ${noun}`}
              placeholder={`Search ${noun}`}
              value={globalFilter ?? ''}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="h-10 w-full pl-9"
            />
          </div>
          <div className="flex gap-3">
            {categoryFilter !== undefined && setCategoryFilter && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 flex-1 capitalize sm:w-44" aria-label="Category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 shrink-0 shadow-none">
                  <SlidersHorizontal aria-hidden="true" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* The table keeps its columns and scrolls sideways on narrow screens. */}
      <div className="border-t border-gray-200/80">
        <Table className="min-w-[640px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 bg-gray-50 px-4 text-xs font-medium text-gray-500"
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnLength} className="px-4 py-14 text-center">
                  <p className="font-medium text-gray-900">No {noun} found</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {filtered
                      ? 'Try a different search or filter.'
                      : `There are no ${noun} here yet.`}
                  </p>
                  {!filtered && emptyAction && <div className="mt-4">{emptyAction}</div>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination table={table} />
    </div>
  );
};

export default DataTable;
