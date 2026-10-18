// Mock figures for the seller dashboard, until a real reporting API exists.
// Every number comes from a fixed seed, so the server and the browser render the same values.

export type TimeRange = 'today' | 'week' | 'month' | 'year';

export const TIME_RANGES: { value: TimeRange; label: string; short: string; previous: string }[] = [
  { value: 'today', label: 'Today', short: 'Today', previous: 'yesterday' },
  { value: 'week', label: 'Last 7 days', short: '7 days', previous: 'previous 7 days' },
  { value: 'month', label: 'Last 30 days', short: '30 days', previous: 'previous 30 days' },
  { value: 'year', label: 'Last 12 months', short: '12 months', previous: 'previous 12 months' },
];

// Small seeded generator (mulberry32): the same seed always gives the same numbers.
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// The reports run up to this day (UTC, so every timezone shows the same labels).
const REPORT_DAY = Date.UTC(2026, 9, 18);
const DAY_MS = 86_400_000;

const hourLabel = (hour: number) =>
  `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 || hour === 24 ? 'am' : 'pm'}`;

export interface SalesPoint {
  label: string; // short axis label
  full: string; // tooltip and table label
  revenue: number;
  orders: number;
  prevRevenue: number;
  prevOrders: number;
}

interface Bucket {
  label: string;
  full: string;
  expectedOrders: number;
}

// Solar systems sell for tens of thousands of taka, so an average order is around ৳48k.
const AVERAGE_ORDER = 48_000;

const buckets = (range: TimeRange): Bucket[] => {
  if (range === 'today') {
    // Shoppers browse at lunch and in the evening; the shop is quiet early and late.
    const shape = [0.3, 0.6, 0.9, 1.2, 1.4, 1.3, 1, 0.9, 1, 1.1, 1.4, 1.6, 1.5, 1.1, 0.6];
    return shape.map((weight, i) => ({
      label: hourLabel(8 + i),
      full: `${hourLabel(8 + i)}–${hourLabel(9 + i)}`,
      expectedOrders: 3.2 * weight,
    }));
  }
  if (range === 'week' || range === 'month') {
    const days = range === 'week' ? 7 : 30;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(REPORT_DAY - (days - 1 - i) * DAY_MS);
      const weekday = date.getUTCDay();
      const dayMonth = `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
      return {
        label: range === 'week' ? DAYS[weekday] : dayMonth,
        full: `${DAYS[weekday]} ${dayMonth}`,
        // Weekends are busier: households plan installs together.
        expectedOrders: 34 * (weekday === 5 || weekday === 6 ? 1.3 : 1) * (1 + i / (days * 6)),
      };
    });
  }
  return Array.from({ length: 12 }, (_, i) => {
    const month = (9 - 11 + i + 12) % 12;
    const year = i < 2 ? 2025 : 2026;
    // Sales climb into the dry season (Feb–May) and grow about 2% a month overall.
    const season = [1.1, 1.25, 1.35, 1.3, 1.2, 0.9, 0.8, 0.8, 0.9, 1, 1, 1.05][month];
    return {
      label: MONTHS[month],
      full: `${MONTHS[month]} ${year}`,
      expectedOrders: 950 * season * (1 + i * 0.02),
    };
  });
};

const RANGE_SEED: Record<TimeRange, number> = { today: 11, week: 23, month: 37, year: 59 };
// How the previous period compares: the shop is growing, so it was a little smaller.
const PREVIOUS_FACTOR: Record<TimeRange, number> = {
  today: 0.93,
  week: 0.9,
  month: 0.88,
  year: 0.79,
};

const buildSeries = (range: TimeRange): SalesPoint[] => {
  const random = seeded(RANGE_SEED[range]);
  const noisy = (value: number, spread: number) => value * (1 - spread + random() * spread * 2);
  return buckets(range).map(({ label, full, expectedOrders }) => {
    const orders = Math.max(0, Math.round(noisy(expectedOrders, 0.25)));
    const prevOrders = Math.max(
      0,
      Math.round(noisy(expectedOrders * PREVIOUS_FACTOR[range], 0.25)),
    );
    return {
      label,
      full,
      orders,
      revenue: Math.round(orders * noisy(AVERAGE_ORDER, 0.18)),
      prevOrders,
      prevRevenue: Math.round(prevOrders * noisy(AVERAGE_ORDER * 0.97, 0.18)),
    };
  });
};

export const SALES_SERIES: Record<TimeRange, SalesPoint[]> = {
  today: buildSeries('today'),
  week: buildSeries('week'),
  month: buildSeries('month'),
  year: buildSeries('year'),
};

const sum = (points: SalesPoint[], key: keyof Omit<SalesPoint, 'label' | 'full'>) =>
  points.reduce((total, point) => total + point[key], 0);

export const totalsFor = (range: TimeRange) => {
  const points = SALES_SERIES[range];
  const revenue = sum(points, 'revenue');
  const orders = sum(points, 'orders');
  const prevRevenue = sum(points, 'prevRevenue');
  const prevOrders = sum(points, 'prevOrders');
  return {
    revenue,
    orders,
    prevRevenue,
    prevOrders,
    averageOrder: orders ? revenue / orders : 0,
    prevAverageOrder: prevOrders ? prevRevenue / prevOrders : 0,
  };
};

// Percentage change from the previous period; undefined when there is nothing to compare to.
export const changeFrom = (current: number, previous: number) =>
  previous > 0 ? ((current - previous) / previous) * 100 : undefined;

// Visitors to orders. Conversion improved this period.
const CONVERSION: Record<TimeRange, { now: number; before: number }> = {
  today: { now: 0.034, before: 0.031 },
  week: { now: 0.033, before: 0.031 },
  month: { now: 0.032, before: 0.03 },
  year: { now: 0.031, before: 0.027 },
};

export const FUNNEL_STEPS = [
  { key: 'visits', label: 'Visited the store', share: 1 },
  { key: 'views', label: 'Viewed a product', share: 0.58 },
  { key: 'carts', label: 'Added to cart', share: 0.12 },
  { key: 'checkouts', label: 'Started checkout', share: 0.061 },
  { key: 'orders', label: 'Placed an order', share: 0 }, // the real order count
] as const;

export const funnelFor = (range: TimeRange) => {
  const { orders, prevOrders } = totalsFor(range);
  const visits = Math.round(orders / CONVERSION[range].now);
  const prevVisits = Math.round(prevOrders / CONVERSION[range].before);
  return {
    visits,
    prevVisits,
    conversion: visits ? (orders / visits) * 100 : 0,
    prevConversion: prevVisits ? (prevOrders / prevVisits) * 100 : 0,
    steps: FUNNEL_STEPS.map((step) => ({
      key: step.key,
      label: step.label,
      count: step.key === 'orders' ? orders : Math.round(visits * step.share),
    })),
  };
};

// Order status mix: short periods still have many orders waiting to ship.
const STATUS_MIX: Record<TimeRange, Record<OrderStatusKey, number>> = {
  today: { delivered: 0.08, shipped: 0.32, pending: 0.56, cancelled: 0.04 },
  week: { delivered: 0.41, shipped: 0.33, pending: 0.22, cancelled: 0.04 },
  month: { delivered: 0.62, shipped: 0.2, pending: 0.14, cancelled: 0.04 },
  year: { delivered: 0.92, shipped: 0.02, pending: 0.01, cancelled: 0.05 },
};
export type OrderStatusKey = 'delivered' | 'shipped' | 'pending' | 'cancelled';

export const orderStatusFor = (range: TimeRange): Record<OrderStatusKey, number> => {
  const { orders } = totalsFor(range);
  const mix = STATUS_MIX[range];
  const shipped = Math.round(orders * mix.shipped);
  const pending = Math.round(orders * mix.pending);
  const cancelled = Math.round(orders * mix.cancelled);
  return { delivered: orders - shipped - pending - cancelled, shipped, pending, cancelled };
};

// Share of revenue by category, now and in the previous period.
const CATEGORY_SHARE: { category: string; now: number; before: number }[] = [
  { category: 'solar-panels', now: 0.29, before: 0.31 },
  { category: 'hybrid-inverters', now: 0.21, before: 0.17 },
  { category: 'batteries', now: 0.19, before: 0.16 },
  { category: 'inverters', now: 0.13, before: 0.16 },
  { category: 'commercial', now: 0.1, before: 0.11 },
  { category: 'ev-chargers', now: 0.05, before: 0.04 },
  { category: 'accessories', now: 0.03, before: 0.05 },
];

export const categorySalesFor = (range: TimeRange) => {
  const { revenue, prevRevenue } = totalsFor(range);
  return CATEGORY_SHARE.map(({ category, now, before }) => ({
    category,
    revenue: Math.round(revenue * now),
    prevRevenue: Math.round(prevRevenue * before),
  }));
};

// Homes place most orders; businesses buy bigger systems.
export const SEGMENTS = [
  { key: 'home', label: 'Homes', orderShare: 0.78, revenueShare: 0.57, prevRevenueShare: 0.61 },
  {
    key: 'business',
    label: 'Businesses',
    orderShare: 0.22,
    revenueShare: 0.43,
    prevRevenueShare: 0.39,
  },
] as const;

export const segmentsFor = (range: TimeRange) => {
  const { revenue, orders } = totalsFor(range);
  return SEGMENTS.map((segment) => {
    const segmentOrders = Math.round(orders * segment.orderShare);
    const segmentRevenue = Math.round(revenue * segment.revenueShare);
    return {
      key: segment.key,
      label: segment.label,
      revenue: segmentRevenue,
      orders: segmentOrders,
      share: segment.revenueShare * 100,
      shareChange: (segment.revenueShare - segment.prevRevenueShare) * 100,
      averageOrder: segmentOrders ? segmentRevenue / segmentOrders : 0,
    };
  });
};

// Orders by weekday and time of day over the last 8 weeks: shows when to run offers and ads.
export const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HEATMAP_SLOTS = ['8–10am', '10–12', '12–2pm', '2–4pm', '4–6pm', '6–8pm', '8–10pm'];

export const ORDERS_HEATMAP: number[][] = (() => {
  const random = seeded(97);
  const daily = [1, 0.95, 1, 1.05, 1.3, 1.45, 1.15];
  const slots = [0.45, 0.9, 1.35, 0.95, 0.85, 1.4, 1.2];
  return daily.map((day) =>
    slots.map((slot) => Math.round(26 * day * slot * (0.8 + random() * 0.4))),
  );
})();

// Units sold per day for a product, used to estimate when stock runs out.
export const dailyDemand = (productId: number) => {
  const random = seeded(productId * 131);
  return Math.round((0.4 + random() * 2.6) * 10) / 10;
};

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

// Units sold per product. Panels sell by the dozen, systems one at a time.
const UNITS_PER_ORDER = 1.9;
const CATEGORY_PULL: Record<string, number> = {
  'solar-panels': 6,
  inverters: 1.2,
  'hybrid-inverters': 1.1,
  batteries: 1.4,
  commercial: 0.35,
  'ev-chargers': 0.6,
  accessories: 1.6,
};

export const unitsSoldFor = (
  range: TimeRange,
  products: { id: number; title: string; category: string; thumbnail?: string }[],
) => {
  const { orders, prevOrders } = totalsFor(range);
  const weights = products.map((product) => {
    const random = seeded(product.id * 977);
    const pull = CATEGORY_PULL[product.category] ?? 1;
    return { now: pull * (0.3 + random()), before: pull * (0.3 + random()) };
  });
  const totalNow = weights.reduce((sum, w) => sum + w.now, 0) || 1;
  const totalBefore = weights.reduce((sum, w) => sum + w.before, 0) || 1;
  return products
    .map((product, i) => ({
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      units: Math.round((orders * UNITS_PER_ORDER * weights[i].now) / totalNow),
      prevUnits: Math.round((prevOrders * UNITS_PER_ORDER * weights[i].before) / totalBefore),
    }))
    .sort((a, b) => b.units - a.units);
};
