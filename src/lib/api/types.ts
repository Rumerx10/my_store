// Response shapes of the store API (see the server's Swagger at /api/docs). Money arrives as
// strings with two decimals ("19500.00"); the mappers turn it into numbers for display.

export type ApiProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
export type ApiOrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';
export type ApiPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type ApiPaymentMethod = 'COD' | 'CARD' | 'BKASH' | 'NAGAD' | 'ROCKET' | 'BANK_TRANSFER';

export interface ApiProductOption {
  id: string;
  name: string;
  values: {
    id: string;
    label: string;
    priceDelta: string;
    swatch: string | null;
    imageUrl: string | null;
  }[];
}

export interface ApiProduct {
  id: string;
  slug: string;
  title: string;
  sku: string;
  brand: string | null;
  category: { id: string; name: string; slug: string };
  price: string;
  originalPrice: string | null;
  discountPercent: string;
  priceRange: { min: string; max: string };
  stock: number;
  inStock: boolean;
  status: ApiProductStatus;
  tags: string[];
  popular: boolean;
  trending: boolean;
  latest: boolean;
  ratingAvg: string;
  ratingCount: number;
  soldCount: number;
  thumbnail: string | null;
  hasOptions: boolean;
  highlights: string[];
  images: { id: string; url: string; alt: string | null; position: number }[];
  options: ApiProductOption[];
  costPrice?: string | null;
  createdAt: string;
  updatedAt: string;
  // Detail only
  description?: string | null;
  barcode?: string | null;
  weight?: string | null;
  specs?: [string, string][];
  warrantyInfo?: string | null;
}

export interface Page<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface CursorPage<T> {
  data: T[];
  nextCursor: string | null;
}

export interface ApiCategory {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
}

export interface ApiCartLine {
  id: string;
  productId: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  variant: string;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  stock: number;
  problem: string | null;
}

export interface ApiCart {
  guestToken: string | null;
  items: ApiCartLine[];
  itemCount: number;
  subtotal: string;
}

export interface ApiWishlist {
  guestToken: string | null;
  items: {
    productId: string;
    title: string;
    slug: string;
    price: string;
    thumbnail: string | null;
    available: boolean;
    addedAt: string;
  }[];
}

export interface ApiShippingRate {
  id: string;
  name: string;
  description: string | null;
  price: string;
  estimate: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ApiStore {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  // The store's own colour (#rrggbb); the seller centre themes itself with it.
  brandColor: string | null;
  currency: string;
  email: string;
  phone: string;
  address: string | null;
  supportHours: string | null;
  taxRate: string;
  installationFee: string | null;
  primaryHost: string;
}

export interface ApiStoreSettings extends ApiStore {
  status: string;
  lowStockThreshold: number;
  taxId: string | null;
  invoiceNote: string | null;
  notifyNewOrder: boolean;
  notifyLowStock: boolean;
  notifyWeeklySummary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAddress {
  id: string;
  label: string | null;
  name: string;
  phone: string;
  district: string;
  thana: string;
  villageOrWard: string;
  addressLine: string | null;
  postCode: string | null;
  isDefault: boolean;
}

export interface ApiOrderSummary {
  id: string;
  orderNumber: number;
  status: ApiOrderStatus;
  paymentMethod: ApiPaymentMethod;
  paymentStatus: ApiPaymentStatus;
  currency: string;
  totalAmount: string;
  itemCount: number;
  previewImages: string[];
  paidAt: string | null;
  shipName: string;
  customer?: { id: string; name: string; phone: string };
  createdAt: string;
}

export interface ApiOrder extends ApiOrderSummary {
  subtotal: string;
  discountAmount: string;
  shippingAmount: string;
  installationFee: string;
  taxAmount: string;
  couponCode: string | null;
  note: string | null;
  shipping: {
    name: string;
    phone: string;
    district: string;
    thana: string;
    villageOrWard: string;
    addressLine: string | null;
    postCode: string | null;
    method: string;
  };
  items: {
    id: string;
    productId: string;
    title: string;
    sku: string;
    variant: string | null;
    imageUrl: string | null;
    unitPrice: string;
    quantity: number;
    totalPrice: string;
    unitCost?: string | null;
  }[];
  events: {
    status: ApiOrderStatus | null;
    title: string;
    note: string | null;
    createdAt: string;
  }[];
  payments: {
    id: string;
    method: ApiPaymentMethod;
    status: ApiPaymentStatus;
    amount: string;
    transactionId: string | null;
    paidAt: string | null;
  }[];
  cancelReason: string | null;
  cancelledAt: string | null;
  updatedAt: string;
}

export interface ApiAuth {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    sellerId: string;
    role: 'OWNER' | 'MANAGER' | 'CUSTOMER';
    name: string;
    phone: string;
    username: string | null;
    email: string | null;
    avatarUrl: string | null;
    isActive: boolean;
    createdAt: string;
  };
}

export interface ApiCheckout {
  order: ApiOrder;
  auth: ApiAuth | null;
  created: boolean;
}

export interface ApiReview {
  id: string;
  productId: string;
  product: { id: string; title: string; slug: string; thumbnail: string | null };
  rating: number;
  title: string | null;
  comment: string;
  author: string;
  images: string[];
  commentCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProductReviews extends CursorPage<ApiReview> {
  summary: {
    ratingAvg: string;
    ratingCount: number;
    distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
  };
}

export interface ApiComment {
  id: string;
  reviewId: string;
  parentId: string | null;
  body: string;
  author: string;
  authorId: string;
  fromStore: boolean;
  replyCount: number;
  replies: ApiComment[];
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiToReviewItem {
  productId: string;
  title: string;
  imageUrl: string | null;
  orderedAt: string;
}

export type ApiDiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface ApiCoupon {
  id: string;
  code: string;
  description: string | null;
  discountType: ApiDiscountType;
  discountValue: string;
  minOrderAmount: string | null;
  maxDiscountAmount: string | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  isPublic: boolean;
  createdAt: string;
}

export type ApiPublicCoupon = Pick<
  ApiCoupon,
  | 'code'
  | 'description'
  | 'discountType'
  | 'discountValue'
  | 'minOrderAmount'
  | 'maxDiscountAmount'
  | 'endsAt'
>;

export type ApiRole = 'OWNER' | 'MANAGER' | 'CUSTOMER';

export interface ApiUser {
  id: string;
  sellerId: string;
  role: ApiRole;
  name: string;
  phone: string;
  username: string | null;
  email: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiDomain {
  id: string;
  hostname: string;
  isPrimary: boolean;
  verifiedAt: string | null;
  verification: { type: 'TXT'; name: string; value: string };
  createdAt: string;
}

export type ApiReportRange = 'today' | 'week' | 'month' | 'year';

// The owner's downloadable sales report: one calendar day, week (Monday to Sunday), month or
// year in Dhaka time, or everything.
export type ApiSalesPeriod = 'day' | 'week' | 'month' | 'year' | 'all';

interface ApiGroupSales {
  name: string;
  revenue: string;
  previousRevenue: string;
  units: number;
  previousUnits: number;
}

interface Compared<T> {
  current: T;
  previous: T;
}

export interface ApiAnalytics {
  range: ApiReportRange;
  timezone: string;
  from: string;
  to: string;
  currency: string;
  totals: {
    revenue: Compared<string>;
    orders: Compared<number>;
    averageOrder: Compared<string>;
    unitsSold: Compared<number>;
    profit: Compared<string>;
    newCustomers: Compared<number>;
  };
  series: {
    bucket: string;
    previousBucket: string;
    revenue: string;
    orders: number;
    units: number;
    profit: string;
    previousRevenue: string;
    previousOrders: number;
    previousUnits: number;
    previousProfit: string;
  }[];
  statusCounts: Record<ApiOrderStatus, number>;
  topProducts: {
    productId: string;
    title: string;
    units: number;
    revenue: string;
    previousRevenue: string;
  }[];
  categories: ApiGroupSales[];
  segments: ApiGroupSales[];
  heatmap: number[][];
  lowStock: { id: string; title: string; stock: number }[];
}

// GET /admin/orders/invoices: the store once, then each order as its invoice prints it.
export interface ApiInvoice {
  orderId: string;
  orderNumber: number;
  createdAt: string;
  status: ApiOrderStatus;
  paymentMethod: ApiPaymentMethod;
  paymentStatus: ApiPaymentStatus;
  paidAt: string | null;
  customerEmail: string | null;
  shipTo: {
    name: string;
    phone: string;
    district: string;
    thana: string;
    villageOrWard: string;
    addressLine: string | null;
    postCode: string | null;
  };
  shippingMethod: string;
  note: string | null;
  items: {
    title: string;
    sku: string;
    variant: string | null;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
  }[];
  subtotal: string;
  discountAmount: string;
  couponCode: string | null;
  shippingAmount: string;
  installationFee: string;
  taxAmount: string;
  totalAmount: string;
  amountPaid: string;
  amountDue: string;
}

export interface ApiInvoiceBatch {
  store: {
    name: string;
    logoUrl: string | null;
    address: string | null;
    phone: string;
    email: string;
    website: string;
    taxId: string | null;
    invoiceNote: string | null;
    currency: string;
  };
  invoices: ApiInvoice[];
}

export interface ApiOrdersSummary {
  orders: number;
  byStatus: Record<ApiOrderStatus, number>;
  byPaymentStatus: Record<ApiPaymentStatus, { count: number; amount: string }>;
  revenue: string;
  averageOrder: string;
  awaitingCod: number;
}

export type ApiMessageKind = 'CONTACT' | 'FEEDBACK';

export interface ApiMessage {
  id: string;
  kind: ApiMessageKind;
  topic: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  body: string;
  wantsReply: boolean;
  isRead: boolean;
  userId: string | null;
  createdAt: string;
}

export interface ApiMessageList extends CursorPage<ApiMessage> {
  unread: number;
}

export interface ApiChatMessage {
  id: string;
  body: string;
  fromStore: boolean;
  senderName: string;
  createdAt: string;
}

export interface ApiChatCustomer {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string | null;
}

export interface ApiChatThread {
  conversationId: string | null;
  unread: number;
  messages: ApiChatMessage[];
  customer?: ApiChatCustomer;
}

export interface ApiConversation {
  id: string;
  customer: ApiChatCustomer;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export interface ApiConversationList extends CursorPage<ApiConversation> {
  unread: number;
}

// ---- Home page (GET/PUT /store/home) --------------------------------------------------
// Links are pages of the shop ("/products?category=x", without the shop's own prefix) or
// https links. Images are uploads (/api/v1/uploads/<id>) or https links.

export type ApiHomeIcon =
  | 'banknote'
  | 'battery'
  | 'building'
  | 'clipboard'
  | 'clock'
  | 'gift'
  | 'headphones'
  | 'home'
  | 'leaf'
  | 'map-pin'
  | 'message'
  | 'percent'
  | 'phone'
  | 'shield'
  | 'smartphone'
  | 'star'
  | 'sun'
  | 'truck'
  | 'wrench'
  | 'zap';

export interface ApiHomeLink {
  label: string;
  href: string;
}

export interface ApiHomeImage {
  url: string;
  alt: string;
}

export interface ApiHomeIconItem {
  icon: ApiHomeIcon;
  title: string;
  text: string;
}

export interface ApiHomeHero {
  badge: string;
  title: string;
  // Ends the title in the accent colour.
  highlight: string;
  subtitle: string;
  image?: ApiHomeImage | null;
  primary?: ApiHomeLink | null;
  secondary?: ApiHomeLink | null;
  showProduct: boolean;
  // null picks the best-rated product.
  featuredProductId?: string | null;
  showCoupon: boolean;
}

interface ApiHomeSectionBase {
  id: string;
  visible: boolean;
}

export type ApiProductSource = 'popular' | 'trending' | 'latest' | 'deals' | 'category' | 'manual';

export type ApiHomeSection =
  | (ApiHomeSectionBase & { type: 'features'; items: ApiHomeIconItem[] })
  | (ApiHomeSectionBase & { type: 'categories'; title: string })
  | (ApiHomeSectionBase & {
      type: 'promoCards';
      title: string;
      cards: {
        title: string;
        text: string;
        points: string[];
        image: ApiHomeImage;
        link: ApiHomeLink;
      }[];
    })
  | (ApiHomeSectionBase & {
      type: 'products';
      title: string;
      subtitle: string;
      source: ApiProductSource;
      categorySlug?: string;
      productIds?: string[];
      limit: number;
    })
  | (ApiHomeSectionBase & {
      type: 'banners';
      title: string;
      slides: { image: string; mobileImage?: string | null; alt: string; href?: string | null }[];
      autoplaySeconds: number;
    })
  | (ApiHomeSectionBase & {
      type: 'billboard';
      title: string;
      text: string;
      image: ApiHomeImage;
      link?: ApiHomeLink | null;
      align: 'left' | 'center';
    })
  | (ApiHomeSectionBase & {
      type: 'combo';
      title: string;
      text: string;
      productIds: string[];
      comboPrice: number;
      couponCode?: string | null;
      image?: ApiHomeImage | null;
    })
  | (ApiHomeSectionBase & {
      type: 'videos';
      title: string;
      subtitle: string;
      videos: { title: string; text: string; videoUrl: string; poster: string }[];
      image?: ApiHomeImage | null;
      points: ApiHomeIconItem[];
    })
  | (ApiHomeSectionBase & {
      type: 'steps';
      title: string;
      subtitle: string;
      steps: ApiHomeIconItem[];
    })
  | (ApiHomeSectionBase & { type: 'help'; title: string; text: string });

export type ApiHomeSectionType = ApiHomeSection['type'];

export interface ApiHomePageContent {
  hero: ApiHomeHero;
  sections: ApiHomeSection[];
}

export interface ApiHomePage extends ApiHomePageContent {
  // false while the store still shows the default page.
  customised: boolean;
  updatedAt: string | null;
}
