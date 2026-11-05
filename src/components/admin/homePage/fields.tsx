'use client';
import { useId, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Link2, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { HOME_ICONS, HomeIcon } from '@/components/common/homeIcons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { absoluteUrl, errorMessage } from '@/lib/api/client';
import type { ApiHomeIcon, ApiHomeLink } from '@/lib/api/types';
import { readImageFile } from '@/lib/imageFile';
import { cn } from '@/lib/utils';

export const selectClass =
  'h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm dark:bg-slate-900';

const hintClass = 'text-xs text-gray-500 dark:text-slate-400';

// Same rule as the API: a page of the shop, or an https link that says where it goes.
export const isValidLink = (href: string) => /^(\/(?!\/)|https:\/\/)/.test(href);
export const LINK_HINT =
  'A page of your shop, like /products?category=batteries, or a full https:// link.';

export const TextField = ({
  label,
  value,
  onChange,
  max,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max: number;
  placeholder?: string;
  hint?: string;
}) => {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      )}
    </div>
  );
};

export const TextAreaField = ({
  label,
  value,
  onChange,
  max,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  max: number;
  placeholder?: string;
  hint?: string;
}) => {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={3}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      )}
    </div>
  );
};

export const NumberField = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  hint?: string;
}) => {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode={step < 1 ? 'decimal' : 'numeric'}
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : ''}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value === '' ? 0 : Number(event.target.value))}
      />
      {hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      )}
    </div>
  );
};

export const SwitchField = ({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) => (
  <label className="flex items-start gap-3 text-sm">
    <Switch checked={checked} onCheckedChange={onChange} className="mt-0.5" />
    <span>
      <span className="font-medium text-gray-900 dark:text-slate-100">{label}</span>
      {hint && <span className={cn('block', hintClass)}>{hint}</span>}
    </span>
  </label>
);

// A button's words and where it goes.
export const LinkFields = ({
  value,
  onChange,
  labelPlaceholder = 'Shop now',
}: {
  value: ApiHomeLink;
  onChange: (value: ApiHomeLink) => void;
  labelPlaceholder?: string;
}) => {
  const id = useId();
  const invalid = value.href !== '' && !isValidLink(value.href);
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <TextField
        label="Button text"
        value={value.label}
        max={40}
        placeholder={labelPlaceholder}
        onChange={(label) => onChange({ ...value, label })}
      />
      <div className="space-y-1.5">
        <Label htmlFor={id}>Opens</Label>
        <Input
          id={id}
          value={value.href}
          maxLength={500}
          placeholder="/products"
          aria-invalid={invalid || undefined}
          aria-describedby={`${id}-hint`}
          onChange={(event) => onChange({ ...value, href: event.target.value.trim() })}
        />
        <p id={`${id}-hint`} className={invalid ? 'text-xs text-red' : hintClass}>
          {LINK_HINT}
        </p>
      </div>
    </div>
  );
};

// An optional button: a switch, then its fields.
export const OptionalLink = ({
  label,
  value,
  onChange,
  fallback,
}: {
  label: string;
  value: ApiHomeLink | null | undefined;
  onChange: (value: ApiHomeLink | null) => void;
  fallback: ApiHomeLink;
}) => (
  <div className="space-y-3">
    <SwitchField
      label={label}
      checked={Boolean(value)}
      onChange={(on) => onChange(on ? fallback : null)}
    />
    {value && <LinkFields value={value} onChange={onChange} labelPlaceholder={fallback.label} />}
  </div>
);

// An image: upload one (it is sent with the save), or paste an https link.
export const ImageField = ({
  label,
  value,
  onChange,
  maxSize = 2000,
  optional = false,
  hint,
  aspect = 'aspect-video',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxSize?: number;
  optional?: boolean;
  hint?: string;
  aspect?: string;
}) => {
  const id = useId();
  const [linking, setLinking] = useState(false);
  const [link, setLink] = useState('');

  const pick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      onChange(await readImageFile(file, maxSize));
    } catch (reason) {
      toast.error(errorMessage(reason));
    }
  };

  const applyLink = () => {
    if (!/^https:\/\/\S+$/.test(link.trim())) {
      toast.error('Paste a full link that starts with https://');
      return;
    }
    onChange(link.trim());
    setLink('');
    setLinking(false);
  };

  return (
    <div className="space-y-1.5">
      <p id={id} className="text-sm font-medium text-gray-900 dark:text-slate-100">
        {label}
        {optional && (
          <span className="font-normal text-gray-500 dark:text-slate-400"> (optional)</span>
        )}
      </p>
      <div className="flex flex-wrap items-start gap-3">
        <div
          className={cn(
            'relative flex w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10',
            aspect,
          )}
        >
          {value ? (
            // A plain img: the preview can be a picked file or any https link.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={absoluteUrl(value)} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-6 text-gray-300 dark:text-slate-600" aria-hidden="true" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-brand dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5">
              <ImagePlus className="size-4" aria-hidden="true" />
              {value ? 'Change' : 'Upload'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-describedby={id}
                onChange={pick}
              />
            </label>
            <button
              type="button"
              onClick={() => setLinking((open) => !open)}
              aria-expanded={linking}
              className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <Link2 className="size-4" aria-hidden="true" />
              Use a link
            </button>
            {value && optional && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-600 hover:text-red dark:text-slate-400"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
          {linking && (
            <div className="flex gap-2">
              <Input
                aria-label={`${label}: image link`}
                value={link}
                placeholder="https://"
                onChange={(event) => setLink(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    applyLink();
                  }
                }}
              />
              <button
                type="button"
                onClick={applyLink}
                className="h-9 shrink-0 rounded-lg bg-brand px-3 text-sm font-medium text-white hover:bg-brand-hover"
              >
                Use
              </button>
            </div>
          )}
          {hint && <p className={hintClass}>{hint}</p>}
        </div>
      </div>
    </div>
  );
};

export const IconSelect = ({
  value,
  onChange,
}: {
  value: ApiHomeIcon;
  onChange: (value: ApiHomeIcon) => void;
}) => {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Icon</Label>
      <div className="flex items-center gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
          <HomeIcon name={value} className="size-4" />
        </span>
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value as ApiHomeIcon)}
          className={selectClass}
        >
          {Object.entries(HOME_ICONS).map(([name, { label }]) => (
            <option key={name} value={name}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const smallButton =
  'flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-white/10';

// A list of items that can be added, removed and moved: slides, cards, steps.
export function ListEditor<T>({
  items,
  onChange,
  itemName,
  max,
  min = 0,
  create,
  render,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  itemName: string;
  max: number;
  min?: number;
  create: () => T;
  render: (item: T, update: (item: T) => void, index: number) => React.ReactNode;
}) {
  const move = (from: number, to: number) => {
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="rounded-lg border border-gray-200 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-900/40"
          >
            <div className="mb-3 flex items-center gap-1">
              <p className="mr-auto text-sm font-medium text-gray-700 dark:text-slate-300">
                {itemName} {index + 1}
              </p>
              <button
                type="button"
                onClick={() => move(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move ${itemName.toLowerCase()} ${index + 1} up`}
                className={smallButton}
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, index + 1)}
                disabled={index === items.length - 1}
                aria-label={`Move ${itemName.toLowerCase()} ${index + 1} down`}
                className={smallButton}
              >
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                disabled={items.length <= min}
                aria-label={`Remove ${itemName.toLowerCase()} ${index + 1}`}
                className={cn(smallButton, 'hover:text-red')}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="space-y-3">
              {render(
                item,
                (next) => onChange(items.map((old, i) => (i === index ? next : old))),
                index,
              )}
            </div>
          </li>
        ))}
      </ol>
      {items.length < max && (
        <button
          type="button"
          onClick={() => onChange([...items, create()])}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-white/15 dark:text-slate-300 dark:hover:bg-white/5"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add {itemName.toLowerCase()}
        </button>
      )}
    </div>
  );
}
