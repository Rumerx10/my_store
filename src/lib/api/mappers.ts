// Turns API responses into the shapes the components were built on (IProduct, ICartItem,
// IOrder, Order), so pages keep working while their data comes from the server.
import type { ICartItem, IProduct, IWishlistItem, ProductStatus } from '@/types/api_types';
import type { InvoiceData, InvoiceStore } from '@/components/invoice/types';
import {
  PAYMENT_METHOD_LABELS,
  type IOrder,
  type IOrderSummary,
  type OrderStatus,
  type PaymentMethodId,
} from '@/types/customerOrder';
import type { Order, StoreOrderRow } from '@/types/order';
import { absoluteUrl } from './client';
import type {
  ApiCart,
  ApiCartLine,
  ApiInvoiceBatch,
  ApiOrder,
  ApiOrderSummary,
  ApiProduct,
  ApiWishlist,
} from './types';

const num = (value: string | null | undefined) => (value ? Number(value) : 0);
export const PLACEHOLDER = '/placeholder.svg';
const image = (url: string | null | undefined) => (url ? absoluteUrl(url) : PLACEHOLDER);

const availability = (stock: number) =>
  stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';

export const toProduct = (api: ApiProduct): IProduct => {
  const images = api.images.map((img) => absoluteUrl(img.url));
  return {
    id: api.id,
    slug: api.slug,
    title: api.title,
    description: api.description ?? '',
    category: api.category.slug,
    categoryName: api.category.name,
    price: num(api.price),
    discountPercentage: num(api.discountPercent),
    rating: num(api.ratingAvg),
    ratingCount: api.ratingCount,
    stock: api.stock,
    tags: api.tags,
    brand: api.brand ?? undefined,
    sku: api.sku,
    weight: num(api.weight),
    dimensions: { width: 0, height: 0, depth: 0 },
    warrantyInformation: api.warrantyInfo ?? '',
    shippingInformation: '',
    availabilityStatus: availability(api.stock),
    reviews: [],
    returnPolicy: '',
    minimumOrderQuantity: 1,
    meta: {
      createdAt: api.createdAt,
      updatedAt: api.updatedAt,
      barcode: api.barcode ?? '',
      qrCode: '',
    },
    images,
    thumbnail: images[0] ?? PLACEHOLDER,
    createdAt: api.createdAt,
    popular: api.popular,
    trending: api.trending,
    latest: api.latest,
    highlights: api.highlights,
    specs: api.specs,
    costPerItem:
      api.costPrice === undefined || api.costPrice === null ? undefined : num(api.costPrice),
    status: api.status.toLowerCase() as ProductStatus,
    options: api.options.map((option) => ({
      name: option.name,
      values: option.values.map((value) => ({
        label: value.label,
        priceDelta: num(value.priceDelta),
        swatch: value.swatch ?? undefined,
        image: value.imageUrl ? absoluteUrl(value.imageUrl) : undefined,
      })),
    })),
  };
};

export const toCartItem = (line: ApiCartLine): ICartItem => ({
  id: line.id,
  productId: line.productId,
  variant: line.variant || undefined,
  title: line.title,
  price: num(line.unitPrice),
  rating: 0,
  sold: 0,
  quantity: line.quantity,
  image: image(line.thumbnail),
  problem: line.problem,
  stock: line.stock,
});

export const toCartItems = (cart: ApiCart) => cart.items.map(toCartItem);

export const toWishlistItems = (wishlist: ApiWishlist): IWishlistItem[] =>
  wishlist.items.map((item) => ({
    id: item.productId,
    title: item.title,
    price: num(item.price),
    rating: 0,
    sold: 0,
    stock: item.available ? 1 : 0,
    image: image(item.thumbnail),
  }));

const customerPaymentStatus = (
  status: ApiOrderSummary['paymentStatus'],
): IOrder['paymentStatus'] =>
  status === 'PAID'
    ? 'paid'
    : status === 'REFUNDED'
      ? 'refunded'
      : status === 'FAILED'
        ? 'failed'
        : 'unpaid';

const addressLine = (order: ApiOrder) =>
  [
    order.shipping.addressLine,
    order.shipping.villageOrWard,
    order.shipping.thana,
    order.shipping.district,
    order.shipping.postCode,
  ]
    .filter(Boolean)
    .join(', ');

const lower = <T extends string>(value: string) => value.toLowerCase() as T;

// One order in the customer's order history.
export const toCustomerOrderSummary = (order: ApiOrderSummary): IOrderSummary => ({
  id: order.id,
  number: order.orderNumber,
  date: order.createdAt,
  itemCount: order.itemCount,
  totalAmount: num(order.totalAmount),
  status: lower<OrderStatus>(order.status),
  paymentMethod: lower<PaymentMethodId>(order.paymentMethod),
  paymentStatus: customerPaymentStatus(order.paymentStatus),
  previewImages: order.previewImages.map((url) => absoluteUrl(url)),
});

// The customer's own order, as its page shows it.
export const toCustomerOrder = (order: ApiOrder): IOrder => ({
  id: order.id,
  number: order.orderNumber,
  date: order.createdAt,
  items: order.items.map((item) => ({
    productId: item.productId,
    variant: item.variant ?? undefined,
    title: item.title,
    price: num(item.unitPrice),
    quantity: item.quantity,
    image: image(item.imageUrl),
  })),
  itemCount: order.itemCount,
  totalAmount: num(order.totalAmount),
  totals: {
    subtotal: num(order.subtotal),
    discount: num(order.discountAmount),
    shipping: num(order.shippingAmount),
    installation: num(order.installationFee),
    tax: num(order.taxAmount),
    couponCode: order.couponCode,
  },
  status: lower<OrderStatus>(order.status),
  paymentMethod: lower<PaymentMethodId>(order.paymentMethod),
  paymentStatus: customerPaymentStatus(order.paymentStatus),
  address: {
    label: order.shipping.method,
    name: order.shipping.name,
    line: addressLine(order),
    phone: order.shipping.phone,
  },
  events: order.events.map((event) => ({
    status: event.status ? lower<OrderStatus>(event.status) : null,
    title: event.title,
    note: event.note,
    date: event.createdAt,
  })),
  cancelReason: order.cancelReason,
});

// One line of the seller's orders and payments tables.
export const toStoreOrderRow = (order: ApiOrderSummary): StoreOrderRow => ({
  id: order.id,
  number: order.orderNumber,
  date: order.createdAt,
  buyerName: order.customer?.name ?? order.shipName,
  buyerPhone: order.customer?.phone ?? '',
  amount: num(order.totalAmount),
  itemCount: order.itemCount,
  status: lower<StoreOrderRow['status']>(order.status),
  paymentType: lower<StoreOrderRow['paymentType']>(order.paymentMethod),
  paymentStatus: lower<StoreOrderRow['paymentStatus']>(order.paymentStatus),
  paidAt: order.paidAt ?? undefined,
});

// An order as the seller's order page shows it.
export const toStoreOrder = (order: ApiOrder): Order => ({
  ...toStoreOrderRow(order),
  buyerPhone: order.customer?.phone ?? order.shipping.phone,
  customerId: order.customer?.id,
  shippingAddress: {
    name: order.shipping.name,
    phone: order.shipping.phone,
    line: addressLine(order),
    method: order.shipping.method,
  },
  totals: {
    subtotal: num(order.subtotal),
    discount: num(order.discountAmount),
    shipping: num(order.shippingAmount),
    installation: num(order.installationFee),
    tax: num(order.taxAmount),
    couponCode: order.couponCode,
  },
  note: order.note,
  cancelReason: order.cancelReason,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.variant ? `${item.title} (${item.variant})` : item.title,
    image: item.imageUrl ? absoluteUrl(item.imageUrl) : undefined,
    quantity: item.quantity,
    price: num(item.unitPrice),
    unitCost:
      item.unitCost === undefined || item.unitCost === null ? undefined : num(item.unitCost),
    sku: item.sku,
  })),
  timeline: order.events.map((event, index) => ({
    id: String(index),
    title: event.title,
    description: event.note ?? '',
    date: event.createdAt,
    status: index === order.events.length - 1 ? 'current' : 'completed',
  })),
});

// Invoices to print: the store's details once, then each order in plain numbers.
export const toInvoiceBatch = (
  api: ApiInvoiceBatch,
): { store: InvoiceStore; invoices: InvoiceData[] } => ({
  store: {
    name: api.store.name,
    logoUrl: api.store.logoUrl ? absoluteUrl(api.store.logoUrl) : null,
    address: api.store.address,
    phone: api.store.phone,
    email: api.store.email,
    website: api.store.website,
    taxId: api.store.taxId,
    note: api.store.invoiceNote,
    currency: api.store.currency,
  },
  invoices: api.invoices.map((invoice) => ({
    orderId: invoice.orderId,
    number: invoice.orderNumber,
    placedAt: invoice.createdAt,
    state:
      invoice.status === 'CANCELLED'
        ? 'cancelled'
        : invoice.status === 'RETURNED'
          ? 'returned'
          : 'open',
    paymentMethod: PAYMENT_METHOD_LABELS[lower<PaymentMethodId>(invoice.paymentMethod)],
    paidAt: invoice.paidAt,
    shipTo: invoice.shipTo,
    email: invoice.customerEmail,
    deliveryMethod: invoice.shippingMethod,
    note: invoice.note,
    lines: invoice.items.map((item) => ({
      title: item.title,
      sku: item.sku,
      variant: item.variant,
      quantity: item.quantity,
      unitPrice: num(item.unitPrice),
      total: num(item.totalPrice),
    })),
    totals: {
      subtotal: num(invoice.subtotal),
      discount: num(invoice.discountAmount),
      couponCode: invoice.couponCode,
      delivery: num(invoice.shippingAmount),
      installation: num(invoice.installationFee),
      vat: num(invoice.taxAmount),
      total: num(invoice.totalAmount),
      paid: num(invoice.amountPaid),
      due: num(invoice.amountDue),
    },
  })),
});
