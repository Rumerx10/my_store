'use client';
import { useFormContext, useWatch } from 'react-hook-form';
import Panel from '@/components/dashboard/Panel';
import { cn, formatPrice } from '@/lib/utils';
import type { ProductFormValues } from './formModel';
import Field, { fieldAria, inputClass, MoneyInput } from './Field';

const asNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : undefined;

const PricingCard = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormValues>();
  const [price, cost, discount] = useWatch({
    control,
    name: ['price', 'costPerItem', 'discountPercentage'],
  });

  const sellingPrice = asNumber(price);
  const costPrice = asNumber(cost);
  const discountValue = asNumber(discount) ?? 0;
  const profit =
    sellingPrice !== undefined && costPrice !== undefined ? sellingPrice - costPrice : undefined;
  const margin = profit !== undefined && sellingPrice ? (profit / sellingPrice) * 100 : undefined;
  const wasPrice =
    sellingPrice && discountValue > 0 && discountValue < 100
      ? sellingPrice / (1 - discountValue / 100)
      : undefined;

  return (
    <Panel title="Pricing">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="price"
          label="Selling price (per unit)"
          error={errors.price?.message}
          hint="What customers pay for one unit."
        >
          <MoneyInput
            placeholder="0.00"
            {...register('price', { valueAsNumber: true })}
            {...fieldAria('price', errors.price?.message, true)}
          />
        </Field>
        <Field
          id="discountPercentage"
          label="Discount (%)"
          error={errors.discountPercentage?.message}
          hint={
            wasPrice
              ? `Shown as reduced from ${formatPrice(wasPrice)}.`
              : 'Enter 0 for no discount.'
          }
        >
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            max="90"
            className={cn(inputClass, 'tabular-nums')}
            {...register('discountPercentage', { valueAsNumber: true })}
            {...fieldAria('discountPercentage', errors.discountPercentage?.message, true)}
          />
        </Field>
        <Field
          id="costPerItem"
          label="Cost (per unit)"
          error={errors.costPerItem?.message}
          hint="What one unit costs you. Customers never see this."
        >
          <MoneyInput
            placeholder="0.00"
            {...register('costPerItem', { valueAsNumber: true })}
            {...fieldAria('costPerItem', errors.costPerItem?.message, true)}
          />
        </Field>

        <dl className="grid grid-cols-2 gap-3 self-start rounded-xl bg-gray-50/80 p-3 text-sm sm:mt-6">
          <div>
            <dt className="text-gray-500">Profit</dt>
            <dd
              className={cn(
                'mt-0.5 font-semibold tabular-nums',
                profit !== undefined && profit < 0 ? 'text-red' : 'text-gray-900',
              )}
            >
              {profit !== undefined ? formatPrice(profit) : '–'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Margin</dt>
            <dd
              className={cn(
                'mt-0.5 font-semibold tabular-nums',
                margin !== undefined && margin < 0 ? 'text-red' : 'text-gray-900',
              )}
            >
              {margin !== undefined ? `${margin.toFixed(1)}%` : '–'}
            </dd>
          </div>
        </dl>
      </div>
    </Panel>
  );
};

export default PricingCard;
