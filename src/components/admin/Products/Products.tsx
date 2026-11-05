'use client';
import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Sheet } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import DataTable from '@/components/admin/DataTable';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { useStoreSettings } from '@/lib/query/admin';
import { useCatalog, useDeleteProduct } from '@/lib/query/catalog';
import { useCategories } from '@/lib/query/shop';
import { getProductStatus } from '@/lib/utils';
import { IProduct } from '@/types/api_types';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ProductColumns from './ProductColumns';
import ProductStatisticsCards from './ProductStatisticsCards';
import { useAdminHref } from '@/components/admin/adminStore';

const STOCK_TABS = [
  { value: 'active', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

const AddProductLink = () => {
  const href = useAdminHref();
  return (
    <Link
      href={href('/products/add-product')}
      className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.98]"
    >
      <Plus className="size-4" aria-hidden="true" />
      Add product
    </Link>
  );
};

const Products = () => {
  const href = useAdminHref();
  const { data: products = [], isPending, error, refetch } = useCatalog();
  const { data: categories = [] } = useCategories();
  const lowStockAt = useStoreSettings().data?.lowStockThreshold ?? 5;
  const deleteProduct = useDeleteProduct();
  const [globalFilter, setGlobalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  const statusTabs = [
    { value: 'all', label: 'All', count: products.length },
    ...STOCK_TABS.map((tab) => ({
      ...tab,
      count: products.filter((product) => getProductStatus(product.stock, lowStockAt) === tab.value)
        .length,
    })),
  ];

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    const { id, title } = productToDelete;
    setProductToDelete(null);
    // Products that were ordered are archived instead, so old orders keep their item.
    deleteProduct.mutate(id, { onSuccess: () => toast.success(`Removed ${title}`) });
  };

  const handleDeleteClick = useCallback((product: IProduct) => setProductToDelete(product), []);
  const categoryName = useCallback(
    (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug,
    [categories],
  );
  const columns = useMemo(
    () => ProductColumns(handleDeleteClick, categoryName, lowStockAt, href),
    [handleDeleteClick, categoryName, lowStockAt, href],
  );

  const filteredData = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStock =
          stockStatusFilter === 'all' ||
          getProductStatus(product.stock, lowStockAt) === stockStatusFilter;
        return matchesCategory && matchesStock;
      }),
    [products, categoryFilter, stockStatusFilter, lowStockAt],
  );

  const table = useReactTable<IProduct>({
    data: filteredData,
    columns,
    state: { sorting, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const search = filterValue.toLowerCase();
      return (
        row.original.title.toLowerCase().includes(search) ||
        row.original.sku.toLowerCase().includes(search)
      );
    },
  });

  if (isPending) return <PageLoader label="Loading products" />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeading
        title="Products"
        desc="Manage the catalog and stock levels."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href={href('/products/bulk-edit')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 px-4 text-sm font-medium text-gray-800 dark:text-slate-200 transition-colors hover:bg-white dark:hover:bg-slate-900"
            >
              <Sheet className="size-4" aria-hidden="true" />
              Bulk edit
            </Link>
            <AddProductLink />
          </div>
        }
      />
      <div className="space-y-4">
        <ProductStatisticsCards products={products} lowStockAt={lowStockAt} />
        <DataTable
          table={table}
          noun="products"
          statusTabsData={statusTabs}
          activeStatus={stockStatusFilter}
          setActiveStatus={setStockStatusFilter}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categoryOptions={categories.map((c) => ({ value: c.slug, label: c.name }))}
          columnLength={columns.length}
          emptyAction={<AddProductLink />}
        />
      </div>

      <DeleteConfirmationDialog
        productToDelete={productToDelete}
        onCancel={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Products;
