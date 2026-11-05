// The seller dashboard's figures, shaped from GET /admin/analytics for the charts. The API
// works in Bangladesh time and sends each period with the one before it, for comparisons.
import type { ApiAnalytics, ApiOrderStatus, ApiReportRange } from '@/lib/api/types';

export type TimeRange = ApiReportRange;

export const TIME_RANGES: { value: TimeRange; label: string; short: string; previous: string }[] = [
  { value: 'today', label: 'Today', short: 'Today', previous: 'yesterday' },
  { value: 'week', label: 'Last 7 days', short: '7 days', previous: 'previous 7 days' },
  { value: 'month', label: 'Last 30 days', short: '30 days', previous: 'previous 30 days' },
  { value: 'year', label: 'Last 12 months', short: '12 months', previous: 'previous 12 months' },
];

export const rangeInfo = (range: TimeRange) => TIME_RANGES.find((r) => r.value === range)!;

// Percentage change from the previous period; undefined when there is nothing to compare to.
export const changeFrom = (current: number, previous: number) =>
  previous > 0 ? ((current - previous) / previous) * 100 : undefined;

// What one bar or point of the period charts stands for.
export const bucketUnit = (range: TimeRange) =>
  range === 'today' ? 'hour' : range === 'year' ? 'month' : 'day';

export interface SalesPoint {
  label: string; // short axis label
  full: string; // tooltip and table label
  revenue: number;
  orders: number;
  units: number;
  profit: number;
  prevRevenue: number;
  prevOrders: number;
  prevUnits: number;
  prevProfit: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const hourLabel = (hour: number) =>
  `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 || hour === 24 ? 'am' : 'pm'}`;

// Bucket keys are Dhaka wall-clock times, "YYYY-MM-DDTHH:MM"; read them as they are.
const bucketLabels = (bucket: string, range: TimeRange) => {
  const [date, time = '00:00'] = bucket.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const hour = Number(time.slice(0, 2));
  const weekday = DAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const dayMonth = `${day} ${MONTHS[month - 1]}`;
  if (range === 'today') {
    return { label: hourLabel(hour), full: `${hourLabel(hour)}–${hourLabel(hour + 1)}` };
  }
  if (range === 'year') return { label: MONTHS[month - 1], full: `${MONTHS[month - 1]} ${year}` };
  return { label: range === 'week' ? weekday : dayMonth, full: `${weekday} ${dayMonth}` };
};

const SEGMENT_LABELS: Record<string, string> = { home: 'Homes', business: 'Businesses' };
export const segmentLabel = (tag: string) =>
  SEGMENT_LABELS[tag] ?? tag.charAt(0).toUpperCase() + tag.slice(1);

export const STATUS_ORDER: ApiOrderStatus[] = [
  'DELIVERED',
  'SHIPPED',
  'PROCESSING',
  'PENDING',
  'CANCELLED',
  'RETURNED',
];

const num = (value: string) => Number(value) || 0;

export const toDashboard = (api: ApiAnalytics) => {
  const t = api.totals;
  const series: SalesPoint[] = api.series.map((point) => ({
    ...bucketLabels(point.bucket, api.range),
    revenue: num(point.revenue),
    orders: point.orders,
    units: point.units,
    profit: num(point.profit),
    prevRevenue: num(point.previousRevenue),
    prevOrders: point.previousOrders,
    prevUnits: point.previousUnits,
    prevProfit: num(point.previousProfit),
  }));
  return {
    range: api.range,
    totals: {
      revenue: num(t.revenue.current),
      prevRevenue: num(t.revenue.previous),
      orders: t.orders.current,
      prevOrders: t.orders.previous,
      averageOrder: num(t.averageOrder.current),
      prevAverageOrder: num(t.averageOrder.previous),
      unitsSold: t.unitsSold.current,
      prevUnitsSold: t.unitsSold.previous,
      profit: num(t.profit.current),
      prevProfit: num(t.profit.previous),
      newCustomers: t.newCustomers.current,
      prevNewCustomers: t.newCustomers.previous,
    },
    series,
    statusCounts: STATUS_ORDER.map((status) => ({
      status,
      count: api.statusCounts[status] ?? 0,
    })),
    categories: api.categories
      .map((c) => ({
        name: c.name,
        revenue: num(c.revenue),
        prevRevenue: num(c.previousRevenue),
        units: c.units,
        prevUnits: c.previousUnits,
      }))
      .sort((a, b) => b.revenue - a.revenue),
    segments: api.segments
      .map((s) => ({
        key: s.name,
        label: segmentLabel(s.name),
        revenue: num(s.revenue),
        prevRevenue: num(s.previousRevenue),
      }))
      .sort((a, b) => b.revenue - a.revenue),
    topProducts: api.topProducts.map((p) => ({
      id: p.productId,
      title: p.title,
      units: p.units,
      revenue: num(p.revenue),
      prevRevenue: num(p.previousRevenue),
    })),
    heatmap: api.heatmap,
    lowStock: api.lowStock,
    // Days in the period, for "sells about n a day".
    days: Math.max(
      1,
      Math.round((new Date(api.to).getTime() - new Date(api.from).getTime()) / 86_400_000),
    ),
  };
};

export type Dashboard = ReturnType<typeof toDashboard>;
