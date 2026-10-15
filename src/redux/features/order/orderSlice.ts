import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethodId = 'cod' | 'card' | 'bkash' | 'nagad' | 'rocket';

export interface IOrderItem {
  productId: string | number;
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
const seedOrder = (order: Omit<IOrder, 'totalAmount'> & { delivery: number }): IOrder => {
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
      delivery: 3500,
      items: [
        {
          productId: 12,
          title: 'GoodWe Lynx U G3 Battery 5kWh',
          price: 145000,
          quantity: 2,
          image:
            'https://en.goodwe.com/Public/Uploads/uploadfile/images/20241213/20241213-111922.png',
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
      delivery: 1500,
      items: [
        {
          productId: 24,
          title: 'GoodWe GMK330 Smart Energy Meter',
          price: 9500,
          quantity: 1,
          image: 'https://en.goodwe.com/Public/Uploads/uploadfile/images/20240425/GMK330-1(2).png',
        },
        {
          productId: 27,
          title: 'GoodWe Wi-Fi Kit-20',
          price: 4500,
          quantity: 1,
          image:
            'https://en.goodwe.com/Public/Uploads/uploadfile/images/20211227/64f17b603937f.png',
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
      delivery: 3500,
      items: [
        {
          productId: 4,
          title: 'GoodWe XS G3 Single-phase Inverter 3.3kW',
          price: 58000,
          quantity: 1,
          image: 'https://en.goodwe.com/Public/Uploads/uploadfile/images/20240201/XS-G3-1.png',
        },
        {
          productId: 1,
          title: 'GoodWe Galaxy 570W Ultra-lightweight Solar Panel',
          price: 19500,
          quantity: 6,
          image:
            'https://en.pvbm.com/Public/Uploads/uploadfile/images/20260327/Galaxy570FrontBack.png',
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
      delivery: 1500,
      items: [
        {
          productId: 23,
          title: 'GoodWe HCA G2 Smart EV Charger 7kW',
          price: 85000,
          quantity: 1,
          image:
            'https://en.goodwe.com/Public/Uploads/uploadfile/images/20241206/20241206-151632.png',
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
