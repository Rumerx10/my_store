'use client';
import { IProduct } from '@/types/api_types';
import { isColorOption, type OptionSelection } from '@/lib/products';
import { cn, formatPrice } from '@/lib/utils';

// One radio group per option. Colours show swatches, other options show labelled pills.
const VariantPicker = ({
  product,
  selection,
  onChange,
}: {
  product: IProduct;
  selection: OptionSelection;
  onChange: (optionName: string, valueLabel: string) => void;
}) => {
  const options = (product.options ?? []).filter((option) => option.values.length > 0);
  if (options.length === 0) return null;

  return (
    <div className="space-y-5">
      {options.map((option) => {
        const color = isColorOption(option);
        const chosen = option.values.find((value) => value.label === selection[option.name]);
        return (
          <fieldset key={option.name}>
            <legend className="mb-2.5 text-sm font-semibold text-gray-900">
              {option.name}:{' '}
              <span className="font-normal text-gray-600">
                {chosen?.label}
                {chosen && chosen.priceDelta > 0 && ` (+${formatPrice(chosen.priceDelta)})`}
              </span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const checked = value.label === chosen?.label;
                const extra = value.priceDelta > 0 ? `+${formatPrice(value.priceDelta)}` : '';
                return (
                  <label
                    key={value.label}
                    title={color ? value.label : undefined}
                    className="relative cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`option-${option.name}`}
                      value={value.label}
                      checked={checked}
                      onChange={() => onChange(option.name, value.label)}
                      className="peer sr-only"
                    />
                    {color ? (
                      <span
                        className={cn(
                          'flex size-11 items-center justify-center rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2',
                          checked ? 'border-brand' : 'border-transparent hover:border-gray-300',
                        )}
                      >
                        <span
                          className="size-8 rounded-full border border-black/10 shadow-inner"
                          style={{ backgroundColor: value.swatch || '#e5e7eb' }}
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          {value.label}
                          {extra && `, ${extra}`}
                        </span>
                      </span>
                    ) : (
                      <span
                        className={cn(
                          'inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2',
                          checked
                            ? 'border-brand bg-brand-soft text-brand-ink'
                            : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400',
                        )}
                      >
                        {value.label}
                        {extra && (
                          <span className="text-xs tabular-nums text-gray-500">{extra}</span>
                        )}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
};

export default VariantPicker;
