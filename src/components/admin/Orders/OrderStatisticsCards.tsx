import { Clock, Package, Wallet, Receipt } from 'lucide-react';
import { Order } from '@/types/order';
import DashboardCard from '@/components/DashboardCard';
import { formatPrice } from '@/lib/utils';

const OrderStatisticsCards = ({ orders }: { orders: Order[] }) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const pending = orders.filter((order) => order.status === 'pending').length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <DashboardCard title="Total orders" value={orders.length} icon={Package} />
      <DashboardCard title="Revenue" value={formatPrice(totalRevenue)} icon={Wallet} />
      <DashboardCard
        title="Average order"
        value={formatPrice(orders.length ? totalRevenue / orders.length : 0)}
        icon={Receipt}
      />
      <DashboardCard title="Pending" value={pending} subtitle="Awaiting dispatch" icon={Clock} />
    </div>
  );
};

export default OrderStatisticsCards;
