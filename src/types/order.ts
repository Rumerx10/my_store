// Orders as the seller sees them (mapped from the API in lib/api/mappers.ts). A customer's
// own view of an order is IOrder in ./customerOrder.ts.

export type StoreOrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';
export type StorePaymentType = 'cod' | 'card' | 'bank_transfer' | 'bkash' | 'nagad' | 'rocket';
export type StorePaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// One line of the orders and payments tables.
export interface StoreOrderRow {
  id: string;
  // The order number the store counts up, shown as #1001.
  number: number;
  date: string;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  itemCount: number;
  status: StoreOrderStatus;
  paymentType: StorePaymentType;
  paymentStatus: StorePaymentStatus;
  paidAt?: string; // ISO time the latest payment arrived
}

export interface Order extends StoreOrderRow {
  customerId?: string;
  shippingAddress: {
    name: string;
    phone: string;
    line: string;
    method: string;
  };
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    installation: number;
    tax: number;
    couponCode: string | null;
  };
  note: string | null;
  cancelReason: string | null;
  items: OrderItem[];
  timeline: TimelineEvent[];
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  // What one unit cost the store when it was sold, if known.
  unitCost?: number;
  sku: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

export const PAYMENT_TYPE_LABELS: Record<StorePaymentType, string> = {
  cod: 'Cash on delivery',
  card: 'Card',
  bank_transfer: 'Bank transfer',
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
};
