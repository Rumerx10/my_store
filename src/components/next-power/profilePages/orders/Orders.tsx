'use client';
import OrderList from '@/components/next-power/orders/OrderList';

const Orders = () => {
  return <OrderList detailHref={(id) => `/next-power/orders/${id}`} />;
};

export default Orders;
