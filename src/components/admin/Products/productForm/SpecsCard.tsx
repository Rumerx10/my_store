'use client';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import Panel from '@/components/dashboard/Panel';
import type { ProductFormValues } from './formModel';
import { inputClass } from './Field';

const MAX_FEATURES = 8;

const removeButton =
  'flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 transition-colors hover:bg-red/10 hover:text-red';
const addButton =
  'mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-brand transition-colors hover:bg-brand-soft';

// Key features and the specification table shown on the product page.
const SpecsCard = () => {
  const { control, register } = useFormContext<ProductFormValues>();
  const features = useFieldArray({ control, name: 'highlights' });
  const specs = useFieldArray({ control, name: 'specs' });

  return (
    <Panel title="Specifications">
      <p className="-mt-2 text-sm text-gray-600 dark:text-slate-400">
        Shown on the product page next to the description.
      </p>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-gray-900 dark:text-slate-100">
          Key features
        </legend>
        {features.fields.length > 0 && (
          <ul className="mt-2 space-y-2">
            {features.fields.map((field, index) => (
              <li key={field.id} className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="e.g. IP66, safe for outdoor installation"
                  aria-label={`Key feature ${index + 1}`}
                  {...register(`highlights.${index}.text`)}
                />
                <button
                  type="button"
                  onClick={() => features.remove(index)}
                  aria-label={`Remove key feature ${index + 1}`}
                  className={removeButton}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        {features.fields.length < MAX_FEATURES && (
          <button type="button" onClick={() => features.append({ text: '' })} className={addButton}>
            <Plus className="size-4" aria-hidden="true" />
            Add key feature
          </button>
        )}
      </fieldset>

      <fieldset className="mt-5 border-t border-gray-100 dark:border-white/5 pt-4">
        <legend className="text-sm font-medium text-gray-900 dark:text-slate-100">
          Technical specifications
        </legend>
        {specs.fields.length > 0 && (
          <ul className="mt-2 space-y-2">
            {specs.fields.map((field, index) => (
              <li key={field.id} className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="Name, e.g. Max. efficiency"
                  aria-label={`Specification ${index + 1} name`}
                  {...register(`specs.${index}.label`)}
                />
                <input
                  className={inputClass}
                  placeholder="Value, e.g. 98.4%"
                  aria-label={`Specification ${index + 1} value`}
                  {...register(`specs.${index}.value`)}
                />
                <button
                  type="button"
                  onClick={() => specs.remove(index)}
                  aria-label={`Remove specification ${index + 1}`}
                  className={removeButton}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => specs.append({ label: '', value: '' })}
          className={addButton}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add specification
        </button>
        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
          Rows with an empty name or value are left out.
        </p>
      </fieldset>
    </Panel>
  );
};

export default SpecsCard;
