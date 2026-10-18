export interface Order {
  id: string;
  date: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  paymentType: 'cod' | 'card' | 'paypal' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paidAt?: string; // ISO time the payment was marked paid
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  timeline: TimelineEvent[];
}

export interface OrderItem {
  id: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  sku: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}
