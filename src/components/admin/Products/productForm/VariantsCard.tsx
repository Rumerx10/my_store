'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react';
import Panel from '@/components/dashboard/Panel';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { isColorOption, priceRange } from '@/lib/products';
import { cn, formatPrice } from '@/lib/utils';
import { guessSwatch, MAX_OPTIONS, type ProductFormValues } from './formModel';
import { fieldAria, inputClass, MoneyInput } from './Field';

const NAME_SUGGESTIONS = ['Capacity', 'Power', 'Color', 'Phase', 'Size', 'Voltage'];

const ImagePicker = ({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (src: string) => void;
  label: string;
}) => {
  const media = useWatch<ProductFormValues, 'media'>({ name: 'media' });
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white text-gray-500 transition-colors hover:border-brand hover:text-brand',
          value ? 'border-gray-300' : 'border-dashed border-gray-300',
        )}
        aria-label={value ? `Change the photo for ${label}` : `Link a photo to ${label}`}
        title={value ? 'Change photo' : 'Link photo'}
      >
        {value ? (
          <Image src={value} alt="" fill sizes="40px" className="object-contain p-0.5" />
        ) : (
          <ImagePlus className="size-4" aria-hidden="true" />
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <p className="text-sm font-medium text-gray-900">Photo for {label || 'this colour'}</p>
        <p className="mt-0.5 text-xs text-gray-500">
          Choosing this colour in the store shows the photo in the gallery.
        </p>
        {media.length === 0 ? (
          <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            Upload product images in Media first, then link one here.
          </p>
        ) : (
          <ul className="mt-3 grid grid-cols-4 gap-2">
            {media.map((item, index) => (
              <li key={`${item.src.slice(-24)}-${index}`}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(item.src);
                    setOpen(false);
                  }}
                  aria-label={`Use image ${index + 1}`}
                  aria-pressed={value === item.src}
                  className={cn(
                    'relative block aspect-square w-full overflow-hidden rounded-lg border bg-white',
                    value === item.src
                      ? 'border-brand ring-2 ring-brand/30'
                      : 'border-gray-200 hover:border-gray-400',
                  )}
                >
                  <Image src={item.src} alt="" fill sizes="64px" className="object-contain p-1" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className="mt-3 h-9 w-full rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
          >
            Don’t link a photo
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
};

const OptionEditor = ({
  index,
  onDone,
  onRemove,
}: {
  index: number;
  onDone: () => void;
  onRemove: () => void;
}) => {
  const {
    control,
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: `options.${index}.values` });
  const name = useWatch({ control, name: `options.${index}.name` }) ?? '';
  const values = useWatch({ control, name: `options.${index}.values` }) ?? [];
  const color = isColorOption({ name });
  const optionErrors = errors.options?.[index];
  const valuesError = optionErrors?.values?.root?.message ?? optionErrors?.values?.message;
  const nameId = `options.${index}.name`;

  const finish = async () => {
    if (await trigger(`options.${index}`)) onDone();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor={nameId} className="text-sm font-medium text-gray-900">
          Option name
        </label>
        <input
          list="option-name-suggestions"
          placeholder="Capacity, Power or Color"
          className={inputClass}
          {...register(`options.${index}.name`)}
          {...fieldAria(nameId, optionErrors?.name?.message)}
        />
        {optionErrors?.name?.message && (
          <p id={`${nameId}-error`} className="text-sm text-red">
            {optionErrors.name.message}
          </p>
        )}
        {color && (
          <p className="text-xs text-gray-500">
            Colour options show a swatch in the store. Link a photo so choosing the colour shows it.
          </p>
        )}
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-gray-900">Values and additional price</legend>
        <ul className="mt-2 space-y-2">
          {fields.map((field, v) => {
            const valueErrors = optionErrors?.values?.[v];
            const labelId = `options.${index}.values.${v}.label`;
            const deltaId = `options.${index}.values.${v}.priceDelta`;
            const valueLabel = values[v]?.label ?? '';
            return (
              <li key={field.id}>
                <div className="flex items-start gap-2">
                  {color && (
                    <label
                      className="relative mt-1 size-8 shrink-0 cursor-pointer overflow-hidden rounded-full border border-black/10 shadow-inner"
                      style={{ backgroundColor: values[v]?.swatch || '#e5e7eb' }}
                      title="Swatch colour"
                    >
                      <span className="sr-only">
                        Swatch colour for {valueLabel || `value ${v + 1}`}
                      </span>
                      <input
                        type="color"
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                        {...register(`options.${index}.values.${v}.swatch`)}
                      />
                    </label>
                  )}
                  <div className="min-w-0 flex-1">
                    <input
                      placeholder={color ? 'Black' : 'e.g. 9.6 kWh'}
                      aria-label={`Value ${v + 1}`}
                      className={inputClass}
                      {...register(`options.${index}.values.${v}.label`, {
                        onBlur: (event: React.FocusEvent<HTMLInputElement>) => {
                          // Give a new colour a matching swatch from its name.
                          if (color && !getValues(`options.${index}.values.${v}.swatch`)) {
                            const guess = guessSwatch(event.target.value);
                            if (guess)
                              setValue(`options.${index}.values.${v}.swatch`, guess, {
                                shouldDirty: true,
                              });
                          }
                        },
                      })}
                      {...fieldAria(labelId, valueErrors?.label?.message)}
                    />
                    {valueErrors?.label?.message && (
                      <p id={`${labelId}-error`} className="mt-1 text-sm text-red">
                        {valueErrors.label.message}
                      </p>
                    )}
                  </div>
                  <div className="w-32 shrink-0 sm:w-40">
                    <MoneyInput
                      placeholder="0"
                      aria-label={`Additional price for ${valueLabel || `value ${v + 1}`}`}
                      {...register(`options.${index}.values.${v}.priceDelta`, {
                        valueAsNumber: true,
                      })}
                      {...fieldAria(deltaId, valueErrors?.priceDelta?.message)}
                    />
                    {valueErrors?.priceDelta?.message && (
                      <p id={`${deltaId}-error`} className="mt-1 text-sm text-red">
                        {valueErrors.priceDelta.message}
                      </p>
                    )}
                  </div>
                  {color && (
                    <ImagePicker
                      label={valueLabel}
                      value={values[v]?.image ?? ''}
                      onChange={(src) =>
                        setValue(`options.${index}.values.${v}.image`, src, { shouldDirty: true })
                      }
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => remove(v)}
                    disabled={fields.length === 1}
                    aria-label={`Remove ${valueLabel || `value ${v + 1}`}`}
                    title="Remove value"
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red/10 hover:text-red disabled:pointer-events-none disabled:opacity-30"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        {valuesError && <p className="mt-2 text-sm text-red">{valuesError}</p>}
        <button
          type="button"
          onClick={() => append({ label: '', priceDelta: 0, swatch: '', image: '' })}
          className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add value
        </button>
      </fieldset>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-red transition-colors hover:bg-red/10"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete option
        </button>
        <button
          type="button"
          onClick={finish}
          className="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
        >
          Done
        </button>
      </div>
    </div>
  );
};

const OptionSummary = ({ index, onEdit }: { index: number; onEdit: () => void }) => {
  const option = useWatch<ProductFormValues, `options.${number}`>({ name: `options.${index}` });
  const color = isColorOption(option);

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white/70 p-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">{option.name}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {option.values.map((value, v) => (
            <li
              key={`${value.label}-${v}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white py-1 pl-1.5 pr-2.5 text-xs text-gray-800"
            >
              {color && (
                <span
                  className="size-4 rounded-full border border-black/10"
                  style={{ backgroundColor: value.swatch || '#e5e7eb' }}
                  aria-hidden="true"
                />
              )}
              {value.label}
              {value.priceDelta > 0 && (
                <span className="tabular-nums text-gray-500">+{formatPrice(value.priceDelta)}</span>
              )}
              {color && value.image && <span className="sr-only">(photo linked)</span>}
              {color && value.image && (
                <ImagePlus className="size-3 text-brand" aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${option.name}`}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
      >
        <Pencil className="size-4" aria-hidden="true" />
        Edit
      </button>
    </div>
  );
};

const VariantsCard = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'options' });
  // Options saved earlier start as summaries; new ones stay open until "Done".
  const [closed, setClosed] = useState<Set<string>>(() => new Set(fields.map((f) => f.id)));
  const [price, options] = useWatch({ control, name: ['price', 'options'] });

  const setOpen = (id: string, open: boolean) =>
    setClosed((current) => {
      const next = new Set(current);
      if (open) next.delete(id);
      else next.add(id);
      return next;
    });

  const addOption = () => {
    append({ name: '', values: [{ label: '', priceDelta: 0, swatch: '', image: '' }] });
  };

  const range =
    typeof price === 'number' && Number.isFinite(price) && options?.length
      ? priceRange({
          price,
          options: options.map((o) => ({
            ...o,
            values: o.values.map((v) => ({
              ...v,
              priceDelta: Number.isFinite(v.priceDelta) ? v.priceDelta : 0,
            })),
          })),
        })
      : null;
  const optionsError = errors.options?.root?.message ?? errors.options?.message;

  return (
    <Panel title="Variants">
      <datalist id="option-name-suggestions">
        {NAME_SUGGESTIONS.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      {fields.length === 0 ? (
        <button
          type="button"
          onClick={addOption}
          className="flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-gray-300 px-4 py-4 text-left transition-colors hover:border-brand hover:bg-brand-soft/40"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
            <Plus className="size-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-medium text-gray-900">
              Add options like capacity, power or color
            </span>
            <span className="block text-xs text-gray-500">
              Each value can add to the selling price.
            </span>
          </span>
        </button>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => {
            // Never hide an option that has errors.
            const open = !closed.has(field.id) || Boolean(errors.options?.[index]);
            return open ? (
              <OptionEditor
                key={field.id}
                index={index}
                onDone={() => setOpen(field.id, false)}
                onRemove={() => remove(index)}
              />
            ) : (
              <OptionSummary key={field.id} index={index} onEdit={() => setOpen(field.id, true)} />
            );
          })}
          {optionsError && <p className="text-sm text-red">{optionsError}</p>}
          {fields.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={addOption}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add another option
            </button>
          )}
          {range && (
            <p className="rounded-lg bg-gray-50/80 px-3 py-2 text-sm text-gray-700">
              {range.min === range.max ? (
                <>
                  Every combination costs{' '}
                  <span className="font-semibold tabular-nums">{formatPrice(range.min)}</span>.
                </>
              ) : (
                <>
                  Customers pay{' '}
                  <span className="font-semibold tabular-nums">{formatPrice(range.min)}</span> to{' '}
                  <span className="font-semibold tabular-nums">{formatPrice(range.max)}</span>,
                  depending on the options they choose.
                </>
              )}
            </p>
          )}
        </div>
      )}
    </Panel>
  );
};

export default VariantsCard;
