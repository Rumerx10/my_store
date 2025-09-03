'use client';

import { useState } from 'react';
import TimeRangeSelector from './DashboardContent/TimeRangeSelector';
import SalesStatistics from './DashboardContent/SalesStatistics';
import OrderStatus from './DashboardContent/OrderStatus';
import RevenueTrendsChart from './DashboardContent/RevenueTrendsChart';
import OrderStatusDistribution from './DashboardContent/OrderStatusDistribution';
import TopProducts from './DashboardContent/TopProducts';
import RecentOrders from './DashboardContent/RecentOrders';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="w-full flex flex-col min-w-0">
        <main className="p-0 lg:p-6 overflow-auto w-full">
          <div className="flex flex-col gap-5">
            <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
              <SalesStatistics timeRange={timeRange} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
              <OrderStatus timeRange={timeRange} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <RevenueTrendsChart timeRange={timeRange} />
              <OrderStatusDistribution />
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <TopProducts />
              <RecentOrders />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
