// What an invoice sheet needs, as plain values. Nothing here belongs to one store: any
// storefront fills these from its own API (see toInvoiceBatch in lib/api/mappers.ts) and the
// sheet prints that store's name, logo, address and notes.

export interface InvoiceStore {
  name: string;
  logoUrl: string | null; // absolute URL
  address: string | null;
  phone: string;
  email: string;
  website: string;
  taxId: string | null; // VAT registration (BIN)
  note: string | null; // printed at the foot of the invoice
  currency: string; // ISO code; BDT prints as ৳
}

export interface InvoiceAddress {
  name: string;
  phone: string;
  district: string;
  thana: string;
  villageOrWard: string;
  addressLine: string | null;
  postCode: string | null;
}

export interface InvoiceLine {
  title: string;
  sku: string;
  variant: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  orderId: string;
  number: number; // the order number, which is also the invoice number
  placedAt: string; // ISO date
  // A cancelled or returned order prints "Do not deliver" in place of the amount to collect.
  state: 'open' | 'cancelled' | 'returned';
  paymentMethod: string; // as people say it, e.g. "Cash on delivery"
  paidAt: string | null;
  shipTo: InvoiceAddress;
  email: string | null;
  deliveryMethod: string;
  note: string | null; // from the buyer, e.g. "Call before coming"
  lines: InvoiceLine[];
  totals: {
    subtotal: number;
    discount: number;
    couponCode: string | null;
    delivery: number;
    installation: number;
    vat: number;
    total: number;
    paid: number;
    due: number; // what the courier collects
  };
}
