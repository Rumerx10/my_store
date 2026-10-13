'use client';
import OrderList from '@/components/orders/OrderList';

const MyOrders = () => {
  return <OrderList detailHref={(id) => `/client/my-orders/${id}`} />;
};

export default MyOrders;
