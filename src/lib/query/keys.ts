// Every query key in one place, so a change can invalidate exactly what it affects. Keys are
// arrays from general to specific: invalidating ['orders'] refreshes every orders query.
export const qk = {
  store: ['store'] as const,
  shippingRates: ['shipping-rates'] as const,
  categories: ['categories'] as const,
  publicCoupons: ['coupons', 'public'] as const,
  homePage: ['home-page'] as const,

  catalog: ['products'] as const,
  product: (id: string) => ['products', id] as const,

  cart: ['cart'] as const,
  wishlist: ['wishlist'] as const,

  me: ['me'] as const,
  addresses: ['addresses'] as const,
  myOrders: ['orders', 'mine'] as const,
  myOrder: (id: string) => ['orders', 'mine', id] as const,

  productReviews: (productId: string) => ['reviews', 'product', productId] as const,
  myReviews: ['reviews', 'mine'] as const,
  toReview: ['reviews', 'to-review'] as const,
  comments: (reviewId: string) => ['reviews', 'comments', reviewId] as const,
  replies: (commentId: string) => ['reviews', 'replies', commentId] as const,

  admin: {
    all: ['admin'] as const,
    orders: ['admin', 'orders'] as const,
    order: (id: string) => ['admin', 'orders', id] as const,
    // Under orders, so any change to an order refreshes its invoice too.
    invoices: (selection: string) => ['admin', 'orders', 'invoices', selection] as const,
    analytics: (range: string) => ['admin', 'analytics', range] as const,
    settings: ['admin', 'settings'] as const,
    domains: ['admin', 'domains'] as const,
    shippingRates: ['admin', 'shipping-rates'] as const,
    coupons: ['admin', 'coupons'] as const,
    reviews: (filter: string) => ['admin', 'reviews', filter] as const,
    users: (filter: string) => ['admin', 'users', filter] as const,
  },
};
