'use client';

import { useState } from 'react';
import PageHeading from '@/components/profilePages/PageHeading';
import type { TimeRange } from '@/docs/adminDashboard';
import TimeRangeSelector from './DashboardContent/TimeRangeSelector';
import SalesStatistics from './DashboardContent/SalesStatistics';
import OrderStatus from './DashboardContent/OrderStatus';
import RevenueTrendsChart from './DashboardContent/RevenueTrendsChart';
import TopProducts from './DashboardContent/TopProducts';
import RecentOrders from './DashboardContent/RecentOrders';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  return (
    <div>
      <PageHeading
        title="Dashboard"
        desc="Sales and orders at a glance."
        action={<TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />}
      />
      <div className="space-y-4">
        <SalesStatistics timeRange={timeRange} />
        <div className="grid gap-4 xl:grid-cols-3">
          <RevenueTrendsChart timeRange={timeRange} className="xl:col-span-2" />
          <OrderStatus timeRange={timeRange} />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <TopProducts />
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
