import { ICartItem } from '@/types/api_types';
import { SHIPPING_OPTIONS } from '@/docs/checkout';

export const COUPONS = [{ code: 'SAVE10', discount: 10 }];
export const VAT_RATE = 5;
// Flat fee for a standard home installation (up to 10 kW); larger jobs are quoted separately.
export const INSTALLATION_FEE = 15000;

export interface CheckoutOptions {
  shippingId: string;
  couponCode: string | null;
  installation: boolean;
}

export const findCoupon = (code: string) =>
  COUPONS.find((coupon) => coupon.code === code.trim().toUpperCase());

// Single source of truth for order totals, shared by the cart and the order summary.
export const calculateTotals = (items: ICartItem[], options: CheckoutOptions) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const coupon = options.couponCode ? findCoupon(options.couponCode) : undefined;
  const couponDiscount = coupon ? (subTotal * coupon.discount) / 100 : 0;
  const shippingOption =
    SHIPPING_OPTIONS.find((option) => option.id === options.shippingId) ?? SHIPPING_OPTIONS[0];
  const shipping = items.length > 0 ? shippingOption.price : 0;
  const installationFee = options.installation && items.length > 0 ? INSTALLATION_FEE : 0;
  const vat = ((subTotal - couponDiscount) * VAT_RATE) / 100;
  const total = subTotal - couponDiscount + shipping + installationFee + vat;

  return {
    itemCount,
    subTotal,
    coupon,
    couponDiscount,
    shippingOption,
    shipping,
    installationFee,
    vat,
    total,
  };
};
