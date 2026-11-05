'use client';
import OrderList from '@/components/next-power/orders/OrderList';

const MyOrders = () => {
  return <OrderList detailHref={(id) => `/next-power/client/my-orders/${id}`} />;
};

export default MyOrders;
