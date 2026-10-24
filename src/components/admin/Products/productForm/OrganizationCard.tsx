'use client';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Plus, X } from 'lucide-react';
import Panel from '@/components/dashboard/Panel';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categoryLabel } from '@/docs/navLinks';
import { CATEGORIES } from '@/docs/products';
import { cn } from '@/lib/utils';
import type { ProductFormValues } from './formModel';
import Field, { inputClass } from './Field';

// Tags that place the product in the "Solar for your home / business" collections.
const SEGMENT_TAGS = [
  { tag: 'home', label: 'Home' },
  { tag: 'business', label: 'Business' },
];

const COLLECTIONS = [
  { name: 'popular', label: 'Popular right now' },
  { name: 'trending', label: 'Trending this week' },
  { name: 'latest', label: 'New arrivals' },
] as const;

const TagsInput = ({
  value,
  onChange,
  onBlur,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  onBlur: () => void;
}) => {
  const [draft, setDraft] = useState('');

  const add = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/,+$/, '');
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft('');
  };

  return (
    <div>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 px-2 py-1.5 focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/15">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-white/10 py-0.5 pl-2 pr-1 text-sm text-gray-800 dark:text-slate-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove tag ${tag}`}
              className="flex size-5 items-center justify-center rounded text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-white/15 hover:text-gray-900 dark:hover:text-slate-100"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id="tags"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              add(draft);
            } else if (event.key === 'Backspace' && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => {
            if (draft) add(draft);
            onBlur();
          }}
          placeholder={value.length ? '' : 'Type a tag and press Enter'}
          aria-describedby="tags-hint"
          className="h-7 min-w-24 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />
      </div>
    </div>
  );
};

const OrganizationCard = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  return (
    <>
      <Panel title="Status">
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                ref={field.ref}
                id="status"
                aria-label="Status"
                className="w-full bg-white/90 dark:bg-slate-900/90"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
          Drafts are hidden from the store until you make them active.
        </p>
      </Panel>

      <Panel title="Product organization">
        <div className="space-y-4">
          <Field id="category" label="Category" error={errors.category?.message}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <SelectTrigger
                    ref={field.ref}
                    id="category"
                    onBlur={field.onBlur}
                    aria-invalid={errors.category ? true : undefined}
                    aria-describedby={errors.category ? 'category-error' : undefined}
                    className={cn(
                      'w-full bg-white/90 dark:bg-slate-900/90',
                      errors.category && 'border-red',
                    )}
                  >
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {categoryLabel(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field id="brand" label="Vendor">
            <input id="brand" className={inputClass} autoComplete="off" {...register('brand')} />
          </Field>

          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <div className="space-y-1.5">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-900 dark:text-slate-100"
                >
                  Tags
                </label>
                <TagsInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                <div
                  id="tags-hint"
                  className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400"
                >
                  Sold for:
                  {SEGMENT_TAGS.map(({ tag, label }) => {
                    const on = field.value.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            on ? field.value.filter((t) => t !== tag) : [...field.value, tag],
                          )
                        }
                        aria-pressed={on}
                        className={cn(
                          'inline-flex h-7 items-center gap-1 rounded-full border px-2.5 font-medium transition-colors',
                          on
                            ? 'border-brand bg-brand-soft text-brand-ink'
                            : 'border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:border-gray-400 dark:hover:border-white/25',
                        )}
                      >
                        {!on && <Plus className="size-3" aria-hidden="true" />}
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          />
        </div>
      </Panel>

      <Panel title="Home page collections">
        <ul className="space-y-3">
          {COLLECTIONS.map(({ name, label }) => (
            <li key={name}>
              <Controller
                control={control}
                name={name}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-800 dark:text-slate-200">
                    <Checkbox
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      className="size-5 rounded-md border-gray-300 dark:border-white/15"
                    />
                    {label}
                  </label>
                )}
              />
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
};

export default OrganizationCard;
