'use client';
import { useFormContext } from 'react-hook-form';
import Panel from '@/components/dashboard/Panel';
import { cn } from '@/lib/utils';
import type { ProductFormValues } from './formModel';
import Field, { fieldAria, inputClass } from './Field';

const InventoryCard = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  return (
    <Panel title="Inventory and shipping">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="sku" label="SKU (stock keeping unit)" error={errors.sku?.message}>
          <input
            className={inputClass}
            autoComplete="off"
            {...register('sku')}
            {...fieldAria('sku', errors.sku?.message)}
          />
        </Field>
        <Field
          id="barcode"
          label="Barcode (optional)"
          error={errors.barcode?.message}
          hint="ISBN, UPC, GTIN or similar."
        >
          <input
            className={inputClass}
            autoComplete="off"
            {...register('barcode')}
            {...fieldAria('barcode', errors.barcode?.message, true)}
          />
        </Field>
        <Field id="stock" label="Quantity in stock" error={errors.stock?.message}>
          <input
            type="number"
            inputMode="numeric"
            step="1"
            min="0"
            className={cn(inputClass, 'tabular-nums')}
            {...register('stock', { valueAsNumber: true })}
            {...fieldAria('stock', errors.stock?.message)}
          />
        </Field>
        <Field
          id="weight"
          label="Weight in kg (optional)"
          error={errors.weight?.message}
          hint="Used for delivery planning and shown in the specifications."
        >
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            className={cn(inputClass, 'tabular-nums')}
            {...register('weight', { valueAsNumber: true })}
            {...fieldAria('weight', errors.weight?.message, true)}
          />
        </Field>
      </div>
    </Panel>
  );
};

export default InventoryCard;
