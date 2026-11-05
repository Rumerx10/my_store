import { Clock, Package, Wallet, Receipt } from 'lucide-react';
import DashboardCard from '@/components/common/DashboardCard';
import type { ApiOrdersSummary } from '@/lib/api/types';
import { formatPrice } from '@/lib/utils';

// Totals over all of the store's orders (cancelled and returned ones left out of revenue).
const OrderStatisticsCards = ({ summary }: { summary?: ApiOrdersSummary }) => {
  const toShip = summary ? summary.byStatus.PENDING + summary.byStatus.PROCESSING : 0;
  const dash = summary ? undefined : '…';

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      <DashboardCard title="Total orders" value={dash ?? summary!.orders} icon={Package} />
      <DashboardCard
        title="Revenue"
        value={dash ?? formatPrice(Number(summary!.revenue))}
        icon={Wallet}
      />
      <DashboardCard
        title="Average order"
        value={dash ?? formatPrice(Number(summary!.averageOrder))}
        icon={Receipt}
      />
      <DashboardCard
        title="To ship"
        value={dash ?? toShip}
        subtitle="Pending and being packed"
        icon={Clock}
      />
    </div>
  );
};

export default OrderStatisticsCards;
