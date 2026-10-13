import { ShoppingCart, Wallet, Receipt, Users } from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import { ORDERS_BY_RANGE, SALES_BY_RANGE, type TimeRange } from '@/docs/adminDashboard';
import { formatPrice } from '@/lib/utils';

const SalesStatistics = ({ timeRange }: { timeRange: TimeRange }) => {
  const sales = SALES_BY_RANGE[timeRange];
  const orders = Object.values(ORDERS_BY_RANGE[timeRange]).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <DashboardCard
        title="Total sales"
        value={formatPrice(sales)}
        subtitle="+12.5% from last period"
        trend="up"
        icon={Wallet}
      />
      <DashboardCard
        title="Total orders"
        value={orders.toLocaleString('en-US')}
        subtitle="+8.2% from last period"
        trend="up"
        icon={ShoppingCart}
      />
      <DashboardCard
        title="Average order"
        value={formatPrice(sales / orders)}
        subtitle="+3.1% from last period"
        trend="up"
        icon={Receipt}
      />
      <DashboardCard
        title="Conversion rate"
        value="3.2%"
        subtitle="-1.2% from last period"
        trend="down"
        icon={Users}
      />
    </div>
  );
};

export default SalesStatistics;
