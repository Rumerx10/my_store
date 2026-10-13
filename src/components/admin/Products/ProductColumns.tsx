import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import SortHeader from '@/components/dashboard/SortHeader';
import { categoryLabel } from '@/docs/navLinks';
import { cn, formatPrice, getProductStatus, getStatusBadge } from '@/lib/utils';
import { IProduct } from '@/types/api_types';

const ProductColumns = (onDelete: (product: IProduct) => void) => {
  const columnHelper = createColumnHelper<IProduct>();
  return [
    columnHelper.accessor('title', {
      id: 'product',
      header: ({ column }) => <SortHeader column={column} label="Product" />,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-gray-50">
            <Image
              src={row.original.thumbnail || '/placeholder.svg'}
              alt=""
              fill
              sizes="40px"
              className="object-contain p-0.5"
            />
          </div>
          <div className="min-w-0">
            <p className="max-w-56 truncate font-medium text-gray-900">{row.original.title}</p>
            <p className="text-xs text-gray-500">{categoryLabel(row.original.category)}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('sku', {
      header: ({ column }) => <SortHeader column={column} label="SKU" />,
      cell: ({ getValue }) => <span className="text-xs tabular-nums text-gray-600">{getValue()}</span>,
    }),
    columnHelper.accessor('price', {
      header: ({ column }) => <SortHeader column={column} label="Price" />,
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums text-gray-900">{formatPrice(getValue())}</span>
      ),
    }),
    columnHelper.accessor('stock', {
      header: ({ column }) => <SortHeader column={column} label="Stock" />,
      cell: ({ getValue }) => {
        const stock = getValue();
        return (
          <span
            className={cn(
              'tabular-nums',
              stock === 0 ? 'text-red' : stock <= 5 ? 'text-yellow-700' : 'text-gray-900',
            )}
          >
            {stock}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(getProductStatus(row.original.stock)),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/products/edit-product/${row.original.id}`}
            aria-label={`Edit ${row.original.title}`}
            className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => onDelete(row.original)}
            aria-label={`Delete ${row.original.title}`}
            className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red/5 hover:text-red"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ),
    }),
  ];
};

export default ProductColumns;
