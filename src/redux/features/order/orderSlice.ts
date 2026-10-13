import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethodId = 'cod' | 'card' | 'bkash' | 'nagad' | 'rocket';

export interface IOrderItem {
  productId: string | number;
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

export interface IOrder {
  id: string;
  date: string; // ISO date
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethodId;
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  address: IOrderAddress;
}

interface OrderState {
  orders: IOrder[];
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, string> = {
  cod: 'Cash on delivery',
  card: 'Card',
  bkash: 'bKash',
  nagad: 'Nagad',
  rocket: 'Rocket',
};

const HOME_ADDRESS: IOrderAddress = {
  label: 'Home',
  name: 'Tanvir Hasan',
  line: 'House 18, Road 7, Mirpur 12, Pallabi, Dhaka 1216',
  phone: '+880 1712-345678',
};

// Past orders so the order history isn't empty in the demo. Totals follow the
// checkout rules: subtotal + delivery + 5% VAT.
const seedOrder = (
  order: Omit<IOrder, 'totalAmount'> & { delivery: number },
): IOrder => {
  const { delivery, ...rest } = order;
  const subTotal = rest.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subTotal + delivery + subTotal * 0.05;
  return { ...rest, totalAmount: Math.round(total * 100) / 100 };
};

const initialState: OrderState = {
  orders: [
    seedOrder({
      id: 'NM-2610-1530',
      date: '2026-10-07',
      status: 'processing',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      address: HOME_ADDRESS,
      delivery: 12.99,
      items: [
        {
          productId: 13,
          title: 'Bedside Table African Cherry',
          price: 299.99,
          quantity: 1,
          image:
            'https://cdn.dummyjson.com/product-images/furniture/bedside-table-african-cherry/thumbnail.webp',
        },
      ],
    }),
    seedOrder({
      id: 'NM-2610-1182',
      date: '2026-10-03',
      status: 'shipped',
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      address: HOME_ADDRESS,
      delivery: 5.99,
      items: [
        {
          productId: 27,
          title: 'Honey Jar',
          price: 6.99,
          quantity: 2,
          image: 'https://cdn.dummyjson.com/product-images/groceries/honey-jar/thumbnail.webp',
        },
        {
          productId: 23,
          title: 'Eggs',
          price: 2.99,
          quantity: 1,
          image: 'https://cdn.dummyjson.com/product-images/groceries/eggs/thumbnail.webp',
        },
        {
          productId: 29,
          title: 'Juice',
          price: 3.99,
          quantity: 3,
          image: 'https://cdn.dummyjson.com/product-images/groceries/juice/thumbnail.webp',
        },
      ],
    }),
    seedOrder({
      id: 'NM-2609-4417',
      date: '2026-09-27',
      status: 'delivered',
      paymentMethod: 'bkash',
      paymentStatus: 'paid',
      address: HOME_ADDRESS,
      delivery: 5.99,
      items: [
        {
          productId: 6,
          title: 'Calvin Klein CK One',
          price: 49.99,
          quantity: 1,
          image:
            'https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp',
        },
        {
          productId: 4,
          title: 'Red Lipstick',
          price: 12.99,
          quantity: 2,
          image: 'https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp',
        },
      ],
    }),
    seedOrder({
      id: 'NM-2608-0921',
      date: '2026-08-19',
      status: 'cancelled',
      paymentMethod: 'nagad',
      paymentStatus: 'refunded',
      address: HOME_ADDRESS,
      delivery: 5.99,
      items: [
        {
          productId: 10,
          title: 'Gucci Bloom Eau de',
          price: 79.99,
          quantity: 1,
          image:
            'https://cdn.dummyjson.com/product-images/fragrances/gucci-bloom-eau-de/thumbnail.webp',
        },
      ],
    }),
  ],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<IOrder>) => {
      // Newest first, so the latest order is at the top of every list.
      state.orders.unshift(action.payload);
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order && (order.status === 'pending' || order.status === 'processing')) {
        order.status = 'cancelled';
        if (order.paymentStatus === 'paid') order.paymentStatus = 'refunded';
      }
    },
  },
});

export const { addOrder, cancelOrder } = orderSlice.actions;
export default orderSlice.reducer;
