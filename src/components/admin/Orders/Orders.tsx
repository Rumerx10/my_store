'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Printer } from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState } from '@/components/common/QueryState';
import type { ApiOrderStatus } from '@/lib/api/types';
import { useStoreOrders, useStoreOrdersSummary } from '@/lib/query/admin';
import OrderStatisticsCards from './OrderStatisticsCards';
import OrdersColumns from './OrdersColumns';
import { useAdminHref } from '@/components/admin/adminStore';

const STATUSES: { value: ApiOrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PROCESSING', label: 'Packing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'RETURNED', label: 'Returned' },
];

// One click for the day's labels: every order being packed, oldest first, in a new tab.
const PrintPackingInvoices = ({ count }: { count: number }) => {
  const href = useAdminHref();
  const className =
    'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors';
  const label = (
    <>
      <Printer className="size-4" aria-hidden="true" />
      Print packing invoices
      <span className="tabular-nums text-gray-500 dark:text-slate-400">{count}</span>
    </>
  );
  if (count === 0) {
    return (
      <span
        aria-disabled="true"
        title="No orders are being packed"
        className={`${className} cursor-not-allowed border-gray-200 text-gray-400 dark:border-white/10 dark:text-slate-500`}
      >
        {label}
      </span>
    );
  }
  return (
    <a
      href={href('/print/invoices?status=PROCESSING&print=1')}
      target="_blank"
      rel="noopener"
      className={`${className} border-gray-300 bg-white text-gray-800 hover:bg-gray-50 dark:border-white/15 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-white/5`}
    >
      {label}
    </a>
  );
};

// Waits until typing pauses, so each key press doesn't send a search.
const useDebounced = (value: string, ms = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), ms);
    return () => window.clearTimeout(timer);
  }, [value, ms]);
  return debounced;
};

// The store's orders, newest first. Search (order number, phone or name) and the status tabs
// run on the server; the next 50 load on demand.
export default function OrdersPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const debouncedSearch = useDebounced(search.trim());
  const summary = useStoreOrdersSummary();
  const orders = useStoreOrders({
    status: activeStatus === 'all' ? undefined : (activeStatus as ApiOrderStatus),
    search: debouncedSearch || undefined,
  });

  const byStatus = summary.data?.byStatus;
  const statusTabs = [
    { value: 'all', label: 'All', count: summary.data?.orders ?? 0 },
    ...STATUSES.filter(
      (status) => status.value !== 'RETURNED' || (byStatus?.RETURNED ?? 0) > 0,
    ).map((status) => ({
      value: status.value,
      label: status.label,
      count: byStatus?.[status.value] ?? 0,
    })),
  ];

  const href = useAdminHref();
  const columns = useMemo(() => OrdersColumns(href), [href]);

  const table = useReactTable({
    data: orders.rows,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
    autoResetPageIndex: false,
  });

  return (
    <div>
      <PageHeading
        title="Orders"
        desc="Track and fulfil customer orders."
        action={<PrintPackingInvoices count={byStatus?.PROCESSING ?? 0} />}
      />
      <div className="space-y-4">
        <OrderStatisticsCards summary={summary.data} />
        {orders.error ? (
          <ErrorState error={orders.error} onRetry={() => orders.refetch()} />
        ) : (
          <DataTable
            table={table}
            noun="orders"
            statusTabsData={statusTabs}
            activeStatus={activeStatus}
            setActiveStatus={(status) => {
              setActiveStatus(status);
              table.setPageIndex(0);
            }}
            globalFilter={search}
            setGlobalFilter={(value) => {
              setSearch(value);
              table.setPageIndex(0);
            }}
            columnLength={columns.length}
            footer={
              orders.hasNextPage && (
                <button
                  type="button"
                  onClick={() => orders.fetchNextPage()}
                  disabled={orders.isFetchingNextPage}
                  className="h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-60 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  {orders.isFetchingNextPage ? 'Loading…' : 'Load more orders'}
                </button>
              )
            }
          />
        )}
      </div>
    </div>
  );
}
