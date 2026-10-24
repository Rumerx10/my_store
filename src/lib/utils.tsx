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

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

// Short figures for charts and stat tiles: 1,284 / 12.9K / 4.2M.
export const formatCompact = (value: number) => compact.format(value);
export const formatCompactPrice = (amount: number) => `৳${compact.format(amount)}`;

// Mock data spells it both ways; treat them as the same status.
const normalizeStatus = (status: string) => (status === 'canceled' ? 'cancelled' : status);

export const getStatusIcon = (status: string) => {
  switch (normalizeStatus(status)) {
    case 'delivered':
      return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
    case 'shipped':
      return <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case 'processing':
      return <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-600 dark:text-slate-400" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (normalizeStatus(status)) {
    case 'delivered':
      return 'bg-green-100 dark:bg-green-500/15 text-green-800 dark:text-green-300';
    case 'shipped':
    case 'processing':
      return 'bg-blue-100 dark:bg-blue-500/15 text-blue-800 dark:text-blue-300';
    case 'pending':
      return 'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-800 dark:text-yellow-300';
    case 'cancelled':
      return 'bg-red-100 dark:bg-red-500/15 text-red-800 dark:text-red-300';
    default:
      return 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-slate-200';
  }
};

export const getProductStatus = (stock: number) => {
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'active';
};

const STOCK_BADGES: Record<string, { label: string; className: string }> = {
  active: {
    label: 'In stock',
    className: 'bg-green-100 dark:bg-green-500/15 text-green-800 dark:text-green-300',
  },
  low_stock: {
    label: 'Low stock',
    className: 'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-800 dark:text-yellow-300',
  },
  out_of_stock: {
    label: 'Out of stock',
    className: 'bg-red-100 dark:bg-red-500/15 text-red-800 dark:text-red-300',
  },
};

export const getStatusBadge = (status: string) => {
  const badge = STOCK_BADGES[status] ?? {
    label: 'Unknown',
    className: 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-slate-200',
  };
  return (
    <span className={cn('inline-flex rounded-md px-2 py-1 text-xs font-medium', badge.className)}>
      {badge.label}
    </span>
  );
};
