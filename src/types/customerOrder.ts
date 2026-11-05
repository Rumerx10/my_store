// A customer's own order, as the "My orders" pages show it (mapped from the API in
// lib/api/mappers.ts). The seller's view of an order is `Order` in ./order.ts.

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';
export type PaymentMethodId = 'cod' | 'card' | 'bkash' | 'nagad' | 'rocket' | 'bank_transfer';

export interface IOrderItem {
  productId: string;
  // Chosen options, e.g. "Capacity: 9.6 kWh".
  variant?: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrderAddress {
  label: string;
  name: string;
  line: string;
  phone: string;
}

export interface IOrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  installation: number;
  tax: number;
  couponCode: string | null;
}

export interface IOrderEvent {
  status: OrderStatus | null;
  title: string;
  note: string | null;
  date: string;
}

// One order in the order history list.
export interface IOrderSummary {
  id: string;
  number: number;
  date: string;
  itemCount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodId;
  paymentStatus: 'paid' | 'unpaid' | 'refunded' | 'failed';
  previewImages: string[];
}

export interface IOrder {
  id: string;
  // The order number the store counts up, shown as #1001.
  number: number;
  date: string; // ISO date
  items: IOrderItem[];
  itemCount: number;
  totalAmount: number;
  totals: IOrderTotals;
  status: OrderStatus;
  paymentMethod: PaymentMethodId;
  paymentStatus: 'paid' | 'unpaid' | 'refunded' | 'failed';
  address: IOrderAddress;
  events: IOrderEvent[];
  cancelReason: string | null;
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, string> = {
  cod: 'Cash on delivery',
  card: 'Card',
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
  bank_transfer: 'Bank transfer',
};

// What the order number looks like everywhere: #1001.
export const orderLabel = (order: { number?: number; id: string }) =>
  order.number ? `#${order.number}` : order.id.slice(0, 8);
