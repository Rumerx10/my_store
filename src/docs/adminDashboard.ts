// Mock figures for the seller dashboard, until a real reporting API exists.
export type TimeRange = 'today' | 'week' | 'month';

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
];

export const SALES_BY_RANGE: Record<TimeRange, number> = {
  today: 2847.5,
  week: 18945.75,
  month: 81436.2,
};

export const ORDERS_BY_RANGE: Record<
  TimeRange,
  { pending: number; shipped: number; delivered: number; cancelled: number }
> = {
  today: { pending: 8, shipped: 12, delivered: 25, cancelled: 2 },
  week: { pending: 45, shipped: 78, delivered: 156, cancelled: 12 },
  month: { pending: 189, shipped: 298, delivered: 567, cancelled: 45 },
};

export const MONTHLY_REVENUE = [
  { name: 'Jan', revenue: 12400 },
  { name: 'Feb', revenue: 15600 },
  { name: 'Mar', revenue: 18900 },
  { name: 'Apr', revenue: 22300 },
  { name: 'May', revenue: 19800 },
  { name: 'Jun', revenue: 25600 },
  { name: 'Jul', revenue: 28900 },
  { name: 'Aug', revenue: 31200 },
  { name: 'Sep', revenue: 27800 },
  { name: 'Oct', revenue: 33400 },
  { name: 'Nov', revenue: 36700 },
  { name: 'Dec', revenue: 42100 },
];

export const WEEKLY_REVENUE = [
  { name: 'Mon', revenue: 2400 },
  { name: 'Tue', revenue: 3200 },
  { name: 'Wed', revenue: 2800 },
  { name: 'Thu', revenue: 4100 },
  { name: 'Fri', revenue: 3800 },
  { name: 'Sat', revenue: 5200 },
  { name: 'Sun', revenue: 4600 },
];

export const TOP_PRODUCTS = [
  {
    name: 'GoodWe Galaxy 570W Ultra-lightweight Solar Panel',
    sales: 642,
    revenue: 12519000,
    growth: 12.5,
  },
  { name: 'GoodWe DNS G4 Single-phase Inverter 5kW', sales: 86, revenue: 9030000, growth: 15.7 },
  { name: 'GoodWe Lynx U G3 Battery 5kWh', sales: 58, revenue: 8410000, growth: 8.3 },
  {
    name: 'GoodWe ESA All-in-One Home Energy Storage 10kW',
    sales: 11,
    revenue: 7920000,
    growth: 5.2,
  },
  { name: 'GoodWe HCA G2 Smart EV Charger 7kW', sales: 23, revenue: 1955000, growth: -2.1 },
];
