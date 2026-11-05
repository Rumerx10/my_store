'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Tag, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  couponApplied,
  removeCoupon,
  setInstallation,
  setShipping,
} from '@/redux/features/checkout/checkoutSlice';
import { useAppDispatch } from '@/redux/hooks';
import { errorMessage } from '@/lib/api/client';
import { useCheckCoupon, useCheckoutTotals } from '@/lib/checkout';
import { usePublicCoupons } from '@/lib/query/shop';
import { formatPrice } from '@/lib/utils';
import OrderTotals from './OrderTotals';

const PricingDetails = () => {
  const dispatch = useAppDispatch();
  const { totals, choices, shippingRates } = useCheckoutTotals();
  const { shippingId, couponCode, installation } = choices;
  const [codeInput, setCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const checkCoupon = useCheckCoupon();
  const suggested = usePublicCoupons().data?.[0]?.code;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await checkCoupon.mutateAsync({
        code: codeInput.trim(),
        subtotal: totals.subTotal,
      });
      dispatch(couponApplied(result));
      setCodeInput('');
      setCouponError('');
    } catch (error) {
      setCouponError(errorMessage(error));
    }
  };

  return (
    <aside
      aria-label="Order summary"
      className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start"
    >
      <div className="rounded-xl glass p-5 md:p-6">
        <h2 className="text-lg text-gray-900 dark:text-slate-100">Order summary</h2>

        <div className="mt-5">
          {couponCode ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-green/10 px-3 py-2.5 text-sm">
              <span className="flex items-center gap-2 font-medium text-green">
                <Tag className="size-4" aria-hidden="true" />
                {couponCode} applied
              </span>
              <button
                type="button"
                onClick={() => dispatch(removeCoupon())}
                className="flex size-7 items-center justify-center rounded-md text-gray-500 dark:text-slate-400 transition-colors hover:bg-white dark:hover:bg-slate-900 hover:text-gray-900 dark:hover:text-slate-100"
                aria-label={`Remove promo code ${couponCode}`}
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} noValidate>
              <Label
                htmlFor="promo-code"
                className="text-sm font-medium text-gray-900 dark:text-slate-100"
              >
                Promo code
              </Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="promo-code"
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  placeholder={suggested ? `e.g. ${suggested}` : 'Enter a code'}
                  aria-invalid={Boolean(couponError)}
                  aria-describedby={couponError ? 'promo-error' : 'promo-hint'}
                  className="h-10 uppercase"
                />
                <button
                  type="submit"
                  disabled={!codeInput.trim() || checkCoupon.isPending}
                  className="h-10 shrink-0 rounded-lg border border-gray-300 dark:border-white/15 px-4 text-sm font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {couponError ? (
                <p id="promo-error" role="alert" className="mt-1.5 text-xs text-red">
                  {couponError}
                </p>
              ) : (
                suggested && (
                  <p id="promo-hint" className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                    Try {suggested} at checkout.
                  </p>
                )
              )}
            </form>
          )}
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-gray-900 dark:text-slate-100">
            Delivery
          </legend>
          <RadioGroup
            value={shippingId}
            onValueChange={(value) => dispatch(setShipping(value))}
            className="mt-2 gap-2"
          >
            {shippingRates.map((option) => (
              <Label
                key={option.id}
                htmlFor={`ship-${option.id}`}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 dark:border-white/10 p-3 font-normal transition-colors hover:bg-gray-50 dark:hover:bg-white/5 has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:bg-brand-soft/60"
              >
                <RadioGroupItem value={option.id} id={`ship-${option.id}`} />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-gray-900 dark:text-slate-100">
                    {option.name}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-slate-400">
                    {option.estimate}
                  </span>
                </span>
                <span className="text-sm font-medium tabular-nums text-gray-900 dark:text-slate-100">
                  {formatPrice(Number(option.price))}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </fieldset>

        {totals.installationOffered && (
          <div className="mt-4 flex items-center gap-3">
            <Checkbox
              id="installation"
              checked={installation}
              onCheckedChange={(checked) => dispatch(setInstallation(checked === true))}
              className="data-[state=checked]:border-brand data-[state=checked]:bg-brand"
            />
            <Label
              htmlFor="installation"
              className="flex flex-1 cursor-pointer justify-between text-sm font-normal text-gray-700 dark:text-slate-300"
            >
              Add professional installation
              <span className="tabular-nums text-gray-900 dark:text-slate-100">
                {formatPrice(totals.installationPrice)}
              </span>
            </Label>
          </div>
        )}

        <div className="mt-6 border-t border-gray-100 dark:border-white/5 pt-5">
          <OrderTotals totals={totals} />
        </div>

        <Link
          href="/next-power/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand text-[15px] font-medium text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.98]"
        >
          Continue to checkout
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
};

export default PricingDetails;
