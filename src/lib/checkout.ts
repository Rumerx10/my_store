import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import type { ApiShippingRate, ApiStore } from '@/lib/api/types';
import { EMPTY_CART, useCart } from '@/lib/query/cart';
import { useShippingRates, useStore } from '@/lib/query/shop';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  couponApplied,
  removeCoupon,
  setShipping,
  type CheckoutState,
} from '@/redux/features/checkout/checkoutSlice';
import { ICartItem } from '@/types/api_types';

export interface PricingContext extends CheckoutState {
  shippingRates: ApiShippingRate[];
  store: Pick<ApiStore, 'taxRate' | 'installationFee'> | null;
}

// Order totals as the API will work them out at checkout: VAT on the goods after the
// discount, then delivery and installation added. The API checks everything again.
export const calculateTotals = (items: ICartItem[], context: PricingContext) => {
  const buyable = items.filter((item) => !item.problem);
  const itemCount = buyable.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = buyable.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponDiscount = context.couponCode ? Math.min(context.couponDiscount, subTotal) : 0;
  const rate =
    context.shippingRates.find((option) => option.id === context.shippingId) ??
    context.shippingRates[0];
  const shippingOption = {
    id: rate?.id ?? '',
    name: rate?.name ?? 'Delivery',
    days: rate?.estimate ?? '',
    price: rate ? Number(rate.price) : 0,
  };
  const shipping = buyable.length > 0 ? shippingOption.price : 0;
  const installationOffered = context.store?.installationFee != null;
  const installationPrice = context.store?.installationFee
    ? Number(context.store.installationFee)
    : 0;
  const installationFee =
    context.installation && installationOffered && buyable.length > 0 ? installationPrice : 0;
  const vatRate = context.store ? Number(context.store.taxRate) : 0;
  const vat = Math.round((subTotal - couponDiscount) * vatRate) / 100;
  const total = subTotal - couponDiscount + shipping + installationFee + vat;

  return {
    itemCount,
    subTotal,
    coupon: context.couponCode ? { code: context.couponCode } : undefined,
    couponDiscount,
    shippingOption,
    shipping,
    installationOffered,
    installationPrice,
    installationFee,
    vatRate,
    vat,
    total,
  };
};

export type Totals = ReturnType<typeof calculateTotals>;

// What a coupon takes off this subtotal; an invalid code fails with the reason.
export const useCheckCoupon = () =>
  useMutation({
    meta: { toast: false },
    mutationFn: async ({ code, subtotal }: { code: string; subtotal: number }) => {
      const result = await api<{ code: string; discountAmount: string }>('/coupons/check', {
        method: 'POST',
        body: { code, subtotal },
      });
      return { code: result.code, discount: Number(result.discountAmount) };
    },
  });

// Totals for the current cart, kept in step with the store: picks the first delivery option,
// and asks the API again what the coupon takes off when the subtotal changes.
export const useCheckoutTotals = () => {
  const dispatch = useAppDispatch();
  const choices = useAppSelector((state) => state.checkout);
  const cartQuery = useCart();
  const { data: shippingRates = [] } = useShippingRates();
  const { data: store = null } = useStore();
  const cart = cartQuery.data ?? EMPTY_CART;
  const totals = calculateTotals(cart.items, { ...choices, shippingRates, store });
  const checkCoupon = useCheckCoupon();

  useEffect(() => {
    const known = shippingRates.some((rate) => rate.id === choices.shippingId);
    if (!known && shippingRates[0]) dispatch(setShipping(shippingRates[0].id));
  }, [choices.shippingId, shippingRates, dispatch]);

  useEffect(() => {
    if (!choices.couponCode || !cartQuery.data) return;
    checkCoupon
      .mutateAsync({ code: choices.couponCode, subtotal: totals.subTotal })
      .then((result) => dispatch(couponApplied(result)))
      .catch(() => dispatch(removeCoupon()));
    // Only the subtotal changes what a coupon is worth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totals.subTotal, Boolean(cartQuery.data)]);

  return { totals, cart, choices, shippingRates, loading: cartQuery.isPending };
};
