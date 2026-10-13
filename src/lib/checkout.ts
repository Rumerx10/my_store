import { ICartItem } from '@/types/api_types';
import { SHIPPING_OPTIONS } from '@/docs/checkout';

export const COUPONS = [{ code: 'SAVE10', discount: 10 }];
export const VAT_RATE = 5;
export const GIFT_WRAP_FEE = 4.99;

export interface CheckoutOptions {
  shippingId: string;
  couponCode: string | null;
  giftWrap: boolean;
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
  const giftWrapFee = options.giftWrap && items.length > 0 ? GIFT_WRAP_FEE : 0;
  const vat = ((subTotal - couponDiscount) * VAT_RATE) / 100;
  const total = subTotal - couponDiscount + shipping + giftWrapFee + vat;

  return {
    itemCount,
    subTotal,
    coupon,
    couponDiscount,
    shippingOption,
    shipping,
    giftWrapFee,
    vat,
    total,
  };
};
