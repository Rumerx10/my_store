'use client';

import { useState } from 'react';
import PageHeading from '@/components/profilePages/PageHeading';
import type { TimeRange } from '@/docs/adminDashboard';
import TimeRangeSelector from './DashboardContent/TimeRangeSelector';
import SalesStatistics from './DashboardContent/SalesStatistics';
import SalesOverTime from './DashboardContent/SalesOverTime';
import OrderStatus from './DashboardContent/OrderStatus';
import CategorySales from './DashboardContent/CategorySales';
import ConversionFunnel from './DashboardContent/ConversionFunnel';
import BusiestTimes from './DashboardContent/BusiestTimes';
import CustomerSegments from './DashboardContent/CustomerSegments';
import UnitsSold from './DashboardContent/UnitsSold';
import TopProducts from './DashboardContent/TopProducts';
import RestockSoon from './DashboardContent/RestockSoon';
import RecentOrders from './DashboardContent/RecentOrders';

// Grid rows use minmax(0, 1fr) so wide content (charts, long names) never widens the page on phones.
const ROW = 'grid grid-cols-[minmax(0,1fr)] gap-4';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  return (
    <div>
      <PageHeading
        title="Dashboard"
        desc="Sales, customers and stock at a glance."
        action={<TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />}
      />
      <div className="space-y-4">
        <SalesStatistics timeRange={timeRange} />
        <div className={`${ROW} xl:grid-cols-3`}>
          <SalesOverTime timeRange={timeRange} className="xl:col-span-2" />
          <OrderStatus timeRange={timeRange} />
        </div>
        <div className={`${ROW} xl:grid-cols-2`}>
          <CategorySales timeRange={timeRange} />
          <ConversionFunnel timeRange={timeRange} />
        </div>
        <div className={`${ROW} xl:grid-cols-3`}>
          <UnitsSold timeRange={timeRange} className="xl:col-span-2" />
          <CustomerSegments timeRange={timeRange} />
        </div>
        <div className={`${ROW} xl:grid-cols-3`}>
          <BusiestTimes className="xl:col-span-2" />
          <RestockSoon />
        </div>
        <div className={`${ROW} xl:grid-cols-2`}>
          <TopProducts />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
