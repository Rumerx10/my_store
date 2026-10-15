import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Clock, Truck, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatOrderDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// All prices in the store are shown in Bangladeshi taka.
export const formatPrice = (amount: number) =>
  `৳${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Mock data spells it both ways; treat them as the same status.
const normalizeStatus = (status: string) => (status === 'canceled' ? 'cancelled' : status);

export const getStatusIcon = (status: string) => {
  switch (normalizeStatus(status)) {
    case 'delivered':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'shipped':
      return <Truck className="w-4 h-4 text-blue-600" />;
    case 'processing':
      return <Package className="w-4 h-4 text-blue-600" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (normalizeStatus(status)) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getProductStatus = (stock: number) => {
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'active';
};

const STOCK_BADGES: Record<string, { label: string; className: string }> = {
  active: { label: 'In stock', className: 'bg-green-100 text-green-800' },
  low_stock: { label: 'Low stock', className: 'bg-yellow-100 text-yellow-800' },
  out_of_stock: { label: 'Out of stock', className: 'bg-red-100 text-red-800' },
};

export const getStatusBadge = (status: string) => {
  const badge = STOCK_BADGES[status] ?? {
    label: 'Unknown',
    className: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={cn('inline-flex rounded-md px-2 py-1 text-xs font-medium', badge.className)}>
      {badge.label}
    </span>
  );
};
