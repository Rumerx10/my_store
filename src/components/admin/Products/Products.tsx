'use client';
import { CheckCircle, XCircle, Plus, AlertTriangle } from 'lucide-react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { getProductStatus } from '@/lib/utils';
import ProductColumns from './ProductColumns';
import ProductStatisticsCards from './ProductStatisticsCards';
import DataTable from '@/components/DataTable';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { IProduct } from '@/types/api_types';

const Products = () => {
  const api_products = useSelector((state: RootState) => state.products);
  const [products, setProducts] = useState<IProduct[]>(api_products);
  const [globalFilter, setGlobalFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [stockStatusFilter, setStockStatusFilter] = useState('all');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    category: false,
    createdAt: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);

  const ProductTabsData = [
    { value: 'all', label: 'All', count: products.length, icon: undefined },
    {
      value: 'active',
      label: 'Active',
      count: products.filter((p) => getProductStatus(p.stock) === 'active').length,
      icon: CheckCircle,
    },
    {
      value: 'low_stock',
      label: 'Low Stock',
      count: products.filter((p) => getProductStatus(p.stock) === 'active').length,
      icon: AlertTriangle,
    },
    {
      value: 'out_of_stock',
      label: 'Out of Stock',
      count: products.filter((p) => getProductStatus(p.stock) === 'active').length,
      icon: XCircle,
    },
  ];

  // const handleDeleteClick = (product: IProduct) => {
  //   setProductToDelete(product);
  //   setDeleteDialogOpen(true);
  // };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Define columns
  const columns = useMemo(() => ProductColumns(), []);

  // Filter data based on category and stock status
  const filteredData = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        categoryFilter === 'All Categories' || product.category === categoryFilter;
      const productStatus = getProductStatus(product.stock);
      const matchesStockStatus = stockStatusFilter === 'all' || productStatus === stockStatusFilter;
      return matchesCategory && matchesStockStatus;
    });
  }, [products, categoryFilter, stockStatusFilter]);

  // Create table instance
  const table = useReactTable<IProduct>({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const name = row.original.title.toLowerCase();
      const sku = row.original.sku.toLowerCase();
      return name.includes(searchValue) || sku.includes(searchValue);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container flex flex-col py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your product inventory ({table.getFilteredRowModel().rows.length} products)
            </p>
          </div>
          <Link href="/admin/products/add-product">
            <Button className="w-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <ProductStatisticsCards />

        {/* Products Table */}
        <DataTable
          table={table}
          title="Products Management"
          desc="Manage your product inventory"
          statusTabsData={ProductTabsData}
          activeStatus={stockStatusFilter}
          setActiveStatus={setStockStatusFilter}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          columnLength={columns.length}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          productToDelete={productToDelete}
          handleDeleteConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default Products;
