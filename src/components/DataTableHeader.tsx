'use client';

import { Label } from '@/components/ui/label';
import { Search, Eye, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Table as TanstackTable } from '@tanstack/react-table';
import type { Order } from '@/types/order';
import { Button } from '@/components/ui/button';
import { FILTER_CATEGORIES } from '@/docs/categories';
import TabList from './TabList';
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

const DataTableHeader = <T,>({
  table,
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
          {categoryFilter && (
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
          <TabsContent value={activeTab} className="space-y-4" />
        </Tabs>
      </div>
    </CardHeader>
  );
};

export default DataTableHeader;
