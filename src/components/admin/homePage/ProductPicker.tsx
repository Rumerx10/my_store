'use client';
import { useId, useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCatalog } from '@/lib/query/catalog';
import { formatPrice } from '@/lib/utils';
import { selectClass } from './fields';

const iconButton =
  'flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-white/10';

// Products picked by searching the catalogue, kept in the order chosen.
export const ProductPicker = ({
  label,
  value,
  onChange,
  max,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (ids: string[]) => void;
  max: number;
  hint?: string;
}) => {
  const id = useId();
  const { data: catalog = [] } = useCatalog();
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const words = query.trim().toLowerCase();
    if (!words) return [];
    return catalog
      .filter((product) => !value.includes(product.id))
      .filter((product) =>
        `${product.title} ${product.brand ?? ''} ${product.sku}`.toLowerCase().includes(words),
      )
      .slice(0, 6);
  }, [catalog, query, value]);

  const move = (from: number, to: number) => {
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <p id={id} className="text-sm font-medium text-gray-900 dark:text-slate-100">
        {label}
      </p>
      {hint && <p className="text-xs text-gray-500 dark:text-slate-400">{hint}</p>}

      {value.length > 0 && (
        <ol aria-labelledby={id} className="space-y-1.5">
          {value.map((productId, index) => {
            const product = catalog.find((p) => p.id === productId);
            return (
              <li
                key={productId}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 p-1.5 pr-1 dark:border-white/10 dark:bg-slate-900/50"
              >
                <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-gray-50 dark:bg-white/5">
                  {product && (
                    <Image
                      src={product.thumbnail}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-contain p-0.5"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-gray-900 dark:text-slate-100">
                    {product ? product.title : 'Product no longer in the store'}
                  </span>
                  {product && (
                    <span className="text-xs tabular-nums text-gray-500 dark:text-slate-400">
                      {formatPrice(product.price)}
                      {product.status &&
                        product.status !== 'active' &&
                        `, ${product.status}: hidden from shoppers`}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label={`Move ${product?.title ?? 'product'} up`}
                  className={iconButton}
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === value.length - 1}
                  aria-label={`Move ${product?.title ?? 'product'} down`}
                  className={iconButton}
                >
                  <ArrowDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((other) => other !== productId))}
                  aria-label={`Remove ${product?.title ?? 'product'}`}
                  className={`${iconButton} hover:text-red`}
                >
                  <X className="size-4" />
                </button>
              </li>
            );
          })}
        </ol>
      )}

      {value.length < max && (
        <div className="space-y-1.5">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products by name, brand or SKU"
            aria-label={`${label}: search products to add`}
          />
          {matches.length > 0 && (
            <ul className="divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200 bg-white dark:divide-white/5 dark:border-white/10 dark:bg-slate-900">
              {matches.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange([...value, product.id]);
                      setQuery('');
                    }}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <Plus className="size-4 shrink-0 text-brand" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-gray-900 dark:text-slate-100">
                      {product.title}
                    </span>
                    <span className="shrink-0 tabular-nums text-gray-500 dark:text-slate-400">
                      {formatPrice(product.price)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query.trim() && matches.length === 0 && (
            <p className="text-xs text-gray-500 dark:text-slate-400">No products match.</p>
          )}
        </div>
      )}
    </div>
  );
};

// One product, or the best rated when none is chosen.
export const FeaturedProductSelect = ({
  value,
  onChange,
}: {
  value: string | null | undefined;
  onChange: (id: string | null) => void;
}) => {
  const id = useId();
  const { data: catalog = [] } = useCatalog();
  const products = [...catalog]
    .filter((product) => (product.status ?? 'active') === 'active')
    .sort((a, b) => a.title.localeCompare(b.title));
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-slate-100">
        Product on the card
      </label>
      <select
        id={id}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
        className={selectClass}
      >
        <option value="">The best-rated product (picked for you)</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.title}
          </option>
        ))}
      </select>
    </div>
  );
};
