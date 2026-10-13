'use client';
import OrderList from '@/components/orders/OrderList';

const Orders = () => {
  return <OrderList detailHref={(id) => `/orders/${id}`} />;
};

export default Orders;
