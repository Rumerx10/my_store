'use client';
import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import DataTable from '@/components/DataTable';
import PageHeading from '@/components/profilePages/PageHeading';
import { FILTER_CATEGORIES } from '@/docs/categories';
import { getProductStatus } from '@/lib/utils';
import { removeProduct } from '@/redux/features/product/productSlice';
import { RootState } from '@/redux/store';
import { IProduct } from '@/types/api_types';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import ProductColumns from './ProductColumns';
import ProductStatisticsCards from './ProductStatisticsCards';

const STOCK_TABS = [
  { value: 'active', label: 'In stock' },
  { value: 'low_stock', label: 'Low stock' },
  { value: 'out_of_stock', label: 'Out of stock' },
];

const AddProductLink = () => (
  <Link
    href="/admin/products/add-product"
    className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98]"
  >
    <Plus className="size-4" aria-hidden="true" />
    Add product
  </Link>
);

const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);
  const [globalFilter, setGlobalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(FILTER_CATEGORIES[0]);
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  const statusTabs = [
    { value: 'all', label: 'All', count: products.length },
    ...STOCK_TABS.map((tab) => ({
      ...tab,
      count: products.filter((product) => getProductStatus(product.stock) === tab.value).length,
    })),
  ];

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    dispatch(removeProduct(productToDelete.id));
    toast.success(`Deleted ${productToDelete.title}`);
    setProductToDelete(null);
  };

  const handleDeleteClick = useCallback((product: IProduct) => setProductToDelete(product), []);
  const columns = useMemo(() => ProductColumns(handleDeleteClick), [handleDeleteClick]);

  const filteredData = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          categoryFilter === FILTER_CATEGORIES[0] || product.category === categoryFilter;
        const matchesStock =
          stockStatusFilter === 'all' || getProductStatus(product.stock) === stockStatusFilter;
        return matchesCategory && matchesStock;
      }),
    [products, categoryFilter, stockStatusFilter],
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

  return (
    <div>
      <PageHeading
        title="Products"
        desc="Manage the catalog and stock levels."
        action={<AddProductLink />}
      />
      <div className="space-y-4">
        <ProductStatisticsCards products={products} />
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
