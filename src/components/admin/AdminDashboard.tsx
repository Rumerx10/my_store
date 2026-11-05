'use client';

import { useState } from 'react';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { toDashboard, type TimeRange } from '@/lib/dashboard';
import { useAnalytics } from '@/lib/query/admin';
import { cn } from '@/lib/utils';
import TimeRangeSelector from './DashboardContent/TimeRangeSelector';
import SalesStatistics from './DashboardContent/SalesStatistics';
import SalesOverTime from './DashboardContent/SalesOverTime';
import OrderStatus from './DashboardContent/OrderStatus';
import CategorySales from './DashboardContent/CategorySales';
import CustomersAndProfit from './DashboardContent/CustomersAndProfit';
import BusiestTimes from './DashboardContent/BusiestTimes';
import CustomerSegments from './DashboardContent/CustomerSegments';
import UnitsSold from './DashboardContent/UnitsSold';
import RevenueAndProfit from './DashboardContent/RevenueAndProfit';
import CategoryUnits from './DashboardContent/CategoryUnits';
import SalesReportDialog from './DashboardContent/SalesReportDialog';
import TopProducts from './DashboardContent/TopProducts';
import RestockSoon from './DashboardContent/RestockSoon';
import RecentOrders from './DashboardContent/RecentOrders';

// Grid rows use minmax(0, 1fr) so wide content (charts, long names) never widens the page on phones.
const ROW = 'grid grid-cols-[minmax(0,1fr)] gap-4';

// The seller's dashboard, from GET /admin/analytics for the chosen period (Dhaka time).
export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const analytics = useAnalytics(timeRange);
  const data = analytics.data ? toDashboard(analytics.data) : undefined;
  // While another period loads, the last one stays on screen, faded.
  const switching = analytics.isPlaceholderData;

  return (
    <div>
      <PageHeading
        title="Dashboard"
        desc="Sales, customers and stock at a glance."
        action={
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
            <SalesReportDialog />
          </div>
        }
      />
      {!data ? (
        analytics.error ? (
          <ErrorState error={analytics.error} onRetry={() => analytics.refetch()} />
        ) : (
          <PageLoader label="Loading your figures" />
        )
      ) : (
        <div
          className={cn('space-y-4 transition-opacity', switching && 'opacity-60')}
          aria-busy={switching}
        >
          <SalesStatistics data={data} />
          <div className={`${ROW} xl:grid-cols-3`}>
            <SalesOverTime data={data} className="xl:col-span-2" />
            <OrderStatus data={data} />
          </div>
          <div className={`${ROW} xl:grid-cols-3`}>
            <RevenueAndProfit data={data} className="xl:col-span-2" />
            <CustomersAndProfit data={data} />
          </div>
          <div className={`${ROW} xl:grid-cols-3`}>
            <UnitsSold data={data} className="xl:col-span-2" />
            <CategoryUnits data={data} />
          </div>
          <div className={`${ROW} xl:grid-cols-2`}>
            <CategorySales data={data} />
            <CustomerSegments data={data} />
          </div>
          <div className={`${ROW} xl:grid-cols-3`}>
            <BusiestTimes data={data} className="xl:col-span-2" />
            <RestockSoon data={data} />
          </div>
          <div className={`${ROW} xl:grid-cols-2`}>
            <TopProducts data={data} />
            <RecentOrders />
          </div>
        </div>
      )}
    </div>
  );
}
