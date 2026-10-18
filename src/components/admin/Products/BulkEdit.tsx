'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Coins, Layers, Percent, Search, SearchX, TriangleAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from '@/components/DashboardCard';
import BackButton from '@/components/shared/BackButton';
import { categoryLabel } from '@/docs/navLinks';
import { CATEGORIES } from '@/docs/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatPrice } from '@/lib/utils';
import { updateProduct } from '@/redux/features/product/productSlice';
import { RootState } from '@/redux/store';
import type { IProduct, ProductStatus } from '@/types/api_types';

// Spreadsheet-style editor for many products at once, like Shopify's bulk editor.
// Edits are kept as strings per row and only reach the catalog on Save.

interface Row {
  title: string;
  sku: string;
  status: ProductStatus;
  category: string;
  brand: string;
  tags: string;
  cost: string;
  price: string; // price before discount
  discount: string; // percent taken off the price
  stock: string;
}

// 'current' (price after discount) and 'profit' are worked out: shown, never typed.
type Field = keyof Row | 'current' | 'profit';

const round2 = (value: number) => Math.round(value * 100) / 100;
const num = (value: string) => (value.trim() === '' ? NaN : Number(value));

const discountOf = (row: Row) => {
  const discount = num(row.discount);
  return discount > 0 ? discount : 0;
};

// What customers pay: the price less the discount.
const currentOf = (row: Row) => {
  const price = num(row.price);
  return price > 0 ? round2(price * (1 - discountOf(row) / 100)) : NaN;
};

// The catalog stores what customers pay plus the discount, so the price is worked back from them.
const toRow = (product: IProduct): Row => ({
  title: product.title,
  sku: product.sku,
  status: product.status ?? 'active',
  category: product.category,
  brand: product.brand ?? '',
  tags: product.tags.join(', '),
  cost: product.costPerItem !== undefined ? String(product.costPerItem) : '',
  price: String(
    product.discountPercentage > 0
      ? round2(product.price / (1 - product.discountPercentage / 100))
      : product.price,
  ),
  discount: product.discountPercentage > 0 ? String(round2(product.discountPercentage)) : '',
  stock: String(product.stock),
});

const errorsOf = (row: Row, takenSkus: Set<string>): Partial<Record<Field, string>> => {
  const errors: Partial<Record<Field, string>> = {};
  const price = num(row.price);
  const discount = num(row.discount);
  const cost = num(row.cost);
  const stock = num(row.stock);
  if (!row.title.trim()) errors.title = 'Enter a title';
  if (!row.sku.trim()) errors.sku = 'Enter a SKU';
  else if (takenSkus.has(row.sku.trim().toLowerCase()))
    errors.sku = 'Another product uses this SKU';
  if (row.cost.trim() && !(cost >= 0)) errors.cost = 'Enter a valid cost';
  if (!(price > 0)) errors.price = 'Enter a price above 0';
  if (row.discount.trim() && !(discount >= 0 && discount <= 90))
    errors.discount = 'Enter a discount from 0 to 90';
  if (!Number.isInteger(stock) || stock < 0) errors.stock = 'Enter a whole number, 0 or more';
  return errors;
};

const availability = (stock: number) =>
  stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';

const BULK_ACTIONS = [
  { value: 'status', label: 'Set status' },
  { value: 'category', label: 'Set category' },
  { value: 'discount', label: 'Set discount %' },
  { value: 'price-percent', label: 'Change price by %' },
  { value: 'stock', label: 'Set stock' },
  { value: 'add-tag', label: 'Add tag' },
  { value: 'remove-tag', label: 'Remove tag' },
] as const;

type BulkAction = (typeof BULK_ACTIONS)[number]['value'];

const cellInput =
  'h-12 w-full border-0 bg-transparent px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:bg-brand-soft/30 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-brand';

const cellSelect =
  'h-12 w-full rounded-none border-0 bg-transparent px-3 text-sm text-gray-900 shadow-none transition-colors hover:bg-brand-soft/30 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-brand';

const toolbarSelect =
  'h-9 rounded-full border-gray-200 bg-white/90 shadow-none transition-colors hover:bg-white';

const toolbarInput =
  'h-9 rounded-full border border-gray-200 bg-white/90 px-4 text-sm outline-none transition-colors placeholder:text-gray-400 hover:bg-white focus:border-brand focus:ring-2 focus:ring-brand/15';

const pressable = 'transition-[background-color,transform] active:scale-[0.97]';

const STATUS_DOT: Record<ProductStatus, string> = { active: 'bg-green', draft: 'bg-gray-400' };

const StatusLabel = ({ status }: { status: ProductStatus }) => (
  <span className="flex items-center gap-2">
    <span className={cn('size-2 rounded-full', STATUS_DOT[status])} aria-hidden="true" />
    {status === 'active' ? 'Active' : 'Draft'}
  </span>
);

type Group = 'inventory' | 'pricing' | 'organisation';

const GROUPS: { id: Group; label: string }[] = [
  { id: 'inventory', label: 'Inventory' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'organisation', label: 'Organisation' },
];

const COLUMNS: {
  field: Field;
  label: string;
  width: string;
  group: Group;
  numeric?: boolean;
  readOnly?: boolean;
}[] = [
  { field: 'sku', label: 'SKU', width: 'w-40', group: 'inventory' },
  { field: 'stock', label: 'Stock', width: 'w-28', group: 'inventory', numeric: true },
  { field: 'tags', label: 'Tags', width: 'w-52', group: 'inventory' },
  { field: 'cost', label: 'Cost per unit (৳)', width: 'w-32', group: 'pricing', numeric: true },
  { field: 'price', label: 'Price (৳)', width: 'w-32', group: 'pricing', numeric: true },
  { field: 'discount', label: 'Discount', width: 'w-28', group: 'pricing', numeric: true },
  {
    field: 'current',
    label: 'Current price (৳)',
    width: 'w-36',
    group: 'pricing',
    numeric: true,
    readOnly: true,
  },
  {
    field: 'profit',
    label: 'Profit (৳)',
    width: 'w-44',
    group: 'pricing',
    numeric: true,
    readOnly: true,
  },
  { field: 'status', label: 'Status', width: 'w-32', group: 'organisation' },
  { field: 'category', label: 'Category', width: 'w-44', group: 'organisation' },
  { field: 'brand', label: 'Vendor', width: 'w-36', group: 'organisation' },
];

const BulkEdit = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);
  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const [initial, setInitial] = useState<Record<number, Row>>(() =>
    Object.fromEntries(products.map((p) => [p.id, toRow(p)])),
  );
  const [rows, setRows] = useState<Record<number, Row>>(initial);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editedOnly, setEditedOnly] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [action, setAction] = useState<BulkAction>('discount');
  const [actionValue, setActionValue] = useState('');

  const ids = products.map((p) => p.id).filter((id) => rows[id]);
  const isChanged = (id: number) =>
    (Object.keys(rows[id]) as (keyof Row)[]).some((key) => rows[id][key] !== initial[id][key]);
  const changedIds = ids.filter(isChanged);

  // SKUs must stay unique across the whole catalog, including other rows' unsaved edits.
  const skuCounts = useMemo(() => {
    const counts = new Map<string, number>();
    Object.values(rows).forEach((row) => {
      const sku = row.sku.trim().toLowerCase();
      if (sku) counts.set(sku, (counts.get(sku) ?? 0) + 1);
    });
    return counts;
  }, [rows]);
  const rowErrors = (id: number) => {
    const sku = rows[id].sku.trim().toLowerCase();
    const taken = new Set((skuCounts.get(sku) ?? 0) > 1 ? [sku] : []);
    return errorsOf(rows[id], taken);
  };

  const visibleIds = ids.filter((id) => {
    const row = rows[id];
    const query = search.trim().toLowerCase();
    return (
      (!query ||
        row.title.toLowerCase().includes(query) ||
        row.sku.toLowerCase().includes(query)) &&
      (!category || row.category === category) &&
      (!editedOnly || isChanged(id))
    );
  });

  const summary = useMemo(() => {
    const list = Object.values(rows);
    let value = 0;
    let lowStock = 0;
    let marginSum = 0;
    let marginCount = 0;
    list.forEach((row) => {
      const current = currentOf(row);
      const stock = num(row.stock);
      const cost = num(row.cost);
      if (current > 0 && stock > 0) value += current * stock;
      if (stock >= 0 && stock <= 5) lowStock += 1;
      if (current > 0 && row.cost.trim() && cost >= 0) {
        marginSum += (current - cost) / current;
        marginCount += 1;
      }
    });
    return {
      drafts: list.filter((row) => row.status === 'draft').length,
      value,
      lowStock,
      margin: marginCount ? (marginSum / marginCount) * 100 : undefined,
      marginCount,
    };
  }, [rows]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setEditedOnly(false);
  };

  // Warn before leaving the page with unsaved edits.
  const dirty = changedIds.length > 0;
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const setField = (id: number, field: keyof Row, value: string) =>
    setRows((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));

  const applyToSelected = () => {
    const targets = [...selected].filter((id) => rows[id]);
    if (targets.length === 0) return;
    // The status and category pickers start on their first choice before any change.
    const value =
      actionValue.trim() ||
      (action === 'status' ? 'active' : action === 'category' ? CATEGORIES[0] : '');
    const amount = Number(value);
    const needsNumber = ['discount', 'price-percent', 'stock'].includes(action);
    if (needsNumber && (value === '' || Number.isNaN(amount))) {
      toast.error('Enter a number to apply.');
      return;
    }
    if (['add-tag', 'remove-tag'].includes(action) && !value) {
      toast.error('Enter the tag to apply.');
      return;
    }
    setRows((current) => {
      const next = { ...current };
      targets.forEach((id) => {
        const row = { ...next[id] };
        const tags = row.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
        switch (action) {
          case 'status':
            row.status = value as ProductStatus;
            break;
          case 'category':
            row.category = value;
            break;
          case 'discount':
            row.discount = amount > 0 ? String(Math.min(90, amount)) : '';
            break;
          case 'price-percent': {
            // Changes the price before discount; the discount % stays the same.
            const price = num(row.price);
            if (price > 0) row.price = String(round2(price * (1 + amount / 100)));
            break;
          }
          case 'stock':
            row.stock = String(Math.max(0, Math.round(amount)));
            break;
          case 'add-tag':
            if (!tags.includes(value.toLowerCase())) tags.push(value.toLowerCase());
            row.tags = tags.join(', ');
            break;
          case 'remove-tag':
            row.tags = tags.filter((t) => t !== value.toLowerCase()).join(', ');
            break;
        }
        next[id] = row;
      });
      return next;
    });
    toast.success(`Applied to ${targets.length} ${targets.length === 1 ? 'product' : 'products'}`);
  };

  const save = () => {
    const invalid = changedIds.find((id) => Object.keys(rowErrors(id)).length > 0);
    if (invalid !== undefined) {
      const field = Object.keys(rowErrors(invalid))[0];
      toast.error(`Fix the highlighted cells before saving.`);
      document.querySelector<HTMLElement>(`[data-cell="${invalid}-${field}"]`)?.focus();
      return;
    }
    const now = new Date().toISOString();
    changedIds.forEach((id) => {
      const product = productById.get(id);
      if (!product) return;
      const row = rows[id];
      const stock = num(row.stock);
      dispatch(
        updateProduct({
          ...product,
          title: row.title.trim(),
          sku: row.sku.trim(),
          status: row.status,
          category: row.category,
          brand: row.brand.trim() || undefined,
          tags: Array.from(
            new Set(
              row.tags
                .split(',')
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean),
            ),
          ),
          price: currentOf(row),
          discountPercentage: discountOf(row),
          costPerItem: row.cost.trim() ? num(row.cost) : undefined,
          stock,
          availabilityStatus: availability(stock),
          meta: { ...product.meta, updatedAt: now },
        }),
      );
    });
    // Store values are normalised (e.g. rounded discount), so take rows from what was saved.
    setInitial((current) => ({
      ...current,
      ...Object.fromEntries(changedIds.map((id) => [id, rows[id]])),
    }));
    toast.success(`Saved ${changedIds.length} ${changedIds.length === 1 ? 'product' : 'products'}`);
  };

  const discard = () => {
    setRows(initial);
    setSelected(new Set());
  };

  // Enter and the up/down arrows move to the same column in the next or previous row.
  const onCellKeyDown = (event: React.KeyboardEvent<HTMLElement>, id: number, field: Field) => {
    const isSelect = event.currentTarget.tagName === 'SELECT';
    const down = event.key === 'Enter' || (event.key === 'ArrowDown' && !isSelect);
    const up = event.key === 'ArrowUp' && !isSelect;
    if (!down && !up) return;
    event.preventDefault();
    const index = visibleIds.indexOf(id);
    const nextId = visibleIds[index + (down ? 1 : -1)];
    if (nextId !== undefined)
      document.querySelector<HTMLElement>(`[data-cell="${nextId}-${field}"]`)?.focus();
  };

  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  const renderCell = (id: number, field: Field) => {
    const row = rows[id];
    const errors = rowErrors(id);
    const error = errors[field];
    const changed =
      field === 'current'
        ? row.price !== initial[id].price || row.discount !== initial[id].discount
        : field === 'profit'
          ? false
          : row[field] !== initial[id][field];
    const common = {
      'data-cell': `${id}-${field}`,
      'aria-label': `${COLUMNS.find((c) => c.field === field)?.label ?? field}, ${row.title}`,
      'aria-invalid': error ? true : undefined,
      title: error,
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => onCellKeyDown(event, id, field),
      className: cn(
        cellInput,
        changed && 'bg-sun-soft/80',
        error && 'bg-red/5 ring-2 ring-inset ring-red/60 focus:ring-red',
      ),
    };

    if (field === 'status' || field === 'category') {
      return (
        <Select value={row[field]} onValueChange={(value) => setField(id, field, value)}>
          <SelectTrigger
            data-cell={`${id}-${field}`}
            aria-label={common['aria-label']}
            className={cn(cellSelect, changed && 'bg-sun-soft/80')}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field === 'status'
              ? (['active', 'draft'] as const).map((status) => (
                  <SelectItem key={status} value={status}>
                    <StatusLabel status={status} />
                  </SelectItem>
                ))
              : CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {categoryLabel(c)}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      );
    }
    if (field === 'profit') {
      // What customers pay minus the cost per unit.
      const current = currentOf(row);
      const cost = num(row.cost);
      const profit =
        current > 0 && cost >= 0 && row.cost.trim() ? round2(current - cost) : undefined;
      const margin = profit !== undefined && current > 0 ? (profit / current) * 100 : undefined;
      return (
        <output
          data-cell={`${id}-profit`}
          aria-label={`Profit, ${row.title}`}
          className={cn(
            'flex h-12 items-center justify-end gap-2 px-3 tabular-nums',
            profit !== undefined && profit < 0 ? 'text-red' : 'text-gray-700',
          )}
        >
          {profit !== undefined ? formatPrice(profit) : <span className="text-gray-400">–</span>}
          {margin !== undefined && (
            <span
              className={cn(
                'rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
                margin < 0
                  ? 'bg-red/10 text-red'
                  : margin < 15
                    ? 'bg-sun-soft text-sun-ink'
                    : 'bg-green/10 text-green',
              )}
            >
              {Math.round(margin)}%
            </span>
          )}
        </output>
      );
    }
    if (field === 'current') {
      const current = currentOf(row);
      return (
        <output
          data-cell={`${id}-current`}
          aria-label={`Current price, ${row.title}`}
          className={cn(
            'flex h-12 items-center justify-end px-3 font-semibold tabular-nums text-gray-900',
            changed && 'bg-sun-soft/80',
          )}
        >
          {Number.isNaN(current) ? '–' : formatPrice(current)}
        </output>
      );
    }
    const numeric = COLUMNS.find((c) => c.field === field)?.numeric;
    const value = row[field];
    if (field === 'stock' || field === 'discount') {
      const stock = num(row.stock);
      return (
        <div className="relative">
          {field === 'stock' && (
            <span
              className={cn(
                'pointer-events-none absolute left-3 top-1/2 size-2 -translate-y-1/2 rounded-full',
                !(stock >= 0)
                  ? 'bg-gray-300'
                  : stock === 0
                    ? 'bg-red'
                    : stock <= 5
                      ? 'bg-sun'
                      : 'bg-green',
              )}
              title={!(stock >= 0) ? undefined : availability(stock)}
              aria-hidden="true"
            />
          )}
          <input
            {...common}
            type="number"
            inputMode="decimal"
            min={0}
            step={field === 'stock' ? 1 : 'any'}
            placeholder={field === 'discount' ? '0' : undefined}
            value={value}
            onChange={(e) => setField(id, field, e.target.value)}
            className={cn(
              common.className,
              'text-right tabular-nums',
              field === 'stock' ? 'pl-7' : 'pr-7',
            )}
          />
          {field === 'discount' && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              %
            </span>
          )}
        </div>
      );
    }
    return (
      <input
        {...common}
        type={numeric ? 'number' : 'text'}
        inputMode={numeric ? 'decimal' : undefined}
        min={numeric ? 0 : undefined}
        step={numeric ? 'any' : undefined}
        value={value}
        onChange={(e) => setField(id, field, e.target.value)}
        className={cn(common.className, numeric && 'text-right tabular-nums')}
      />
    );
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
            Bulk edit products
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-gray-600">
            Edit any cell, then save. Press
            <kbd className="rounded-md border border-gray-200 bg-white/90 px-1.5 font-sans text-xs text-gray-700 shadow-[0_1px_0_rgb(15_23_42_/_0.08)]">
              Enter
            </kbd>
            or
            <kbd className="rounded-md border border-gray-200 bg-white/90 px-1.5 font-sans text-xs text-gray-700 shadow-[0_1px_0_rgb(15_23_42_/_0.08)]">
              ↑ ↓
            </kbd>
            to move between rows.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p
            aria-live="polite"
            className={cn(
              'flex h-10 items-center gap-2 rounded-full px-3.5 text-sm font-medium',
              dirty ? 'bg-sun-soft text-sun-ink' : 'text-gray-600',
            )}
          >
            <span className="relative flex size-2" aria-hidden="true">
              {dirty && (
                <span className="absolute inset-0 animate-ping rounded-full bg-sun opacity-60 motion-reduce:hidden" />
              )}
              <span className={cn('relative size-2 rounded-full', dirty ? 'bg-sun' : 'bg-green')} />
            </span>
            {dirty
              ? `${changedIds.length} unsaved ${changedIds.length === 1 ? 'product' : 'products'}`
              : 'All changes saved'}
          </p>
          <BackButton href="/admin/products">Back to products</BackButton>
        </div>
      </header>

      {/* Catalog at a glance; updates live as cells change. */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardCard
          title="Products"
          value={ids.length}
          subtitle={`${summary.drafts} ${summary.drafts === 1 ? 'draft' : 'drafts'}`}
          icon={Layers}
        />
        <DashboardCard
          title="Stock value"
          value={formatPrice(summary.value)}
          subtitle="At current prices"
          icon={Coins}
        />
        <DashboardCard
          title="Average margin"
          value={summary.margin !== undefined ? `${summary.margin.toFixed(1)}%` : '–'}
          subtitle={`Across ${summary.marginCount} with a cost`}
          trend={summary.margin === undefined ? undefined : summary.margin >= 15 ? 'up' : 'down'}
          icon={Percent}
        />
        <DashboardCard
          title="Low stock"
          value={summary.lowStock}
          subtitle="5 units or fewer"
          trend={summary.lowStock > 0 ? 'down' : undefined}
          icon={TriangleAlert}
        />
      </div>

      <section aria-label="Products" className="mt-6 overflow-hidden rounded-2xl glass-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200/80 px-3 py-3 md:px-4">
          <div className="relative min-w-56 flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or SKU"
              aria-label="Search products"
              className={cn(toolbarInput, 'w-full pl-9')}
            />
          </div>
          <Select
            value={category || 'all'}
            onValueChange={(v) => setCategory(v === 'all' ? '' : v)}
          >
            <SelectTrigger aria-label="Filter by category" className={cn(toolbarSelect, 'w-48')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {categoryLabel(c)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div
            role="radiogroup"
            aria-label="Rows to show"
            className="flex h-9 items-center rounded-full bg-gray-100/90 p-1"
          >
            {[
              { value: false, label: 'All' },
              { value: true, label: 'Edited', count: changedIds.length },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                role="radio"
                aria-checked={editedOnly === option.value}
                onClick={() => setEditedOnly(option.value)}
                className={cn(
                  'flex h-7 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors',
                  editedOnly === option.value
                    ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgb(15_23_42_/_0.12)]'
                    : 'text-gray-600 hover:text-gray-900',
                )}
              >
                {option.label}
                {option.count !== undefined && option.count > 0 && (
                  <span className="rounded-full bg-sun px-1.5 text-[11px] font-semibold leading-4 text-sun-ink">
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="ml-auto text-sm tabular-nums text-gray-500">
            {visibleIds.length} of {ids.length} products
          </p>
        </div>

        {/* Actions for the selected rows */}
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-brand/15 bg-brand-soft/60 px-3 py-2.5 md:px-4">
            <span className="mr-1 inline-flex h-7 items-center rounded-full bg-brand px-3 text-xs font-semibold text-white">
              {selected.size} selected
            </span>
            <Select
              value={action}
              onValueChange={(v) => {
                setAction(v as BulkAction);
                setActionValue('');
              }}
            >
              <SelectTrigger aria-label="Bulk action" className={cn(toolbarSelect, 'w-48')}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BULK_ACTIONS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {action === 'status' ? (
              <Select value={actionValue || 'active'} onValueChange={setActionValue}>
                <SelectTrigger aria-label="Status to apply" className={cn(toolbarSelect, 'w-36')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['active', 'draft'] as const).map((status) => (
                    <SelectItem key={status} value={status}>
                      <StatusLabel status={status} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : action === 'category' ? (
              <Select value={actionValue || CATEGORIES[0]} onValueChange={setActionValue}>
                <SelectTrigger aria-label="Category to apply" className={cn(toolbarSelect, 'w-48')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {categoryLabel(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <input
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyToSelected()}
                inputMode={action.endsWith('tag') ? undefined : 'decimal'}
                placeholder={
                  action === 'price-percent'
                    ? 'e.g. 5 or -10'
                    : action.endsWith('tag')
                      ? 'Tag'
                      : 'Value'
                }
                aria-label="Value to apply"
                className={cn(toolbarInput, 'w-36')}
              />
            )}
            <button
              type="button"
              onClick={applyToSelected}
              className={cn(
                'h-9 rounded-full bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover',
                pressable,
              )}
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className={cn(
                'h-9 rounded-full px-3 text-sm font-medium text-brand-ink hover:bg-white/70',
                pressable,
              )}
            >
              Clear selection
            </button>
          </div>
        )}

        {/* The header rows and the product column stay pinned while scrolling. */}
        <div className="max-h-[calc(100dvh-var(--header-h)-17rem)] min-h-96 overflow-auto bg-white/80">
          <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th
                  rowSpan={2}
                  className="sticky left-0 top-0 z-30 border-b border-r border-gray-200 bg-gray-50 px-4 text-left align-bottom shadow-[8px_0_16px_-14px_rgb(30_58_138_/_0.45)]"
                >
                  <div className="flex h-10 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={(e) =>
                        setSelected((current) => {
                          const next = new Set(current);
                          visibleIds.forEach((id) =>
                            e.target.checked ? next.add(id) : next.delete(id),
                          );
                          return next;
                        })
                      }
                      aria-label="Select all shown products"
                      className="size-4 accent-brand"
                    />
                    <span className="text-xs font-semibold text-gray-600">Product</span>
                  </div>
                </th>
                {GROUPS.map((group) => (
                  <th
                    key={group.id}
                    scope="colgroup"
                    colSpan={COLUMNS.filter((c) => c.group === group.id).length}
                    className={cn(
                      'sticky top-0 z-20 h-8 border-b border-r border-gray-200 px-3 text-left text-[11px] font-semibold tracking-wide',
                      group.id === 'pricing'
                        ? 'bg-brand-soft text-brand-ink'
                        : 'bg-gray-100 text-gray-500',
                    )}
                  >
                    {group.label}
                  </th>
                ))}
              </tr>
              <tr>
                {COLUMNS.map((column) => (
                  <th
                    key={column.field}
                    scope="col"
                    className={cn(
                      'sticky top-8 z-20 h-10 whitespace-nowrap border-b border-r border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-600',
                      column.width,
                      column.numeric ? 'text-right' : 'text-left',
                    )}
                  >
                    {column.label}
                    {column.readOnly && (
                      <span className="ml-1.5 font-normal text-gray-400">auto</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleIds.map((id) => {
                const product = productById.get(id)!;
                const row = rows[id];
                const isSelected = selected.has(id);
                const edited = isChanged(id);
                return (
                  <tr key={id} className="group">
                    <td
                      className={cn(
                        'sticky left-0 z-10 border-b border-r border-gray-200 bg-white px-4 shadow-[8px_0_16px_-14px_rgb(30_58_138_/_0.45)] transition-colors group-hover:bg-slate-50',
                        // A sun-coloured edge marks rows with unsaved edits.
                        edited &&
                          'before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-sun',
                        isSelected && 'bg-brand-soft group-hover:bg-brand-soft',
                      )}
                    >
                      <div className="flex w-80 items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) =>
                            setSelected((current) => {
                              const next = new Set(current);
                              if (e.target.checked) next.add(id);
                              else next.delete(id);
                              return next;
                            })
                          }
                          aria-label={`Select ${row.title}`}
                          className="size-4 shrink-0 accent-brand"
                        />
                        <Link
                          href={`/admin/products/edit-product/${id}`}
                          className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 transition-shadow hover:ring-2 hover:ring-brand/40"
                          aria-label={`Open ${row.title} in the full editor`}
                        >
                          <Image
                            src={product.thumbnail || '/placeholder.svg'}
                            alt=""
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">{renderCell(id, 'title')}</div>
                      </div>
                    </td>
                    {COLUMNS.map((column) => (
                      <td
                        key={column.field}
                        className={cn(
                          'border-b border-r border-gray-100 p-0 transition-colors group-hover:bg-slate-50/70',
                          column.width,
                          column.readOnly && 'bg-slate-50/60',
                          isSelected && 'bg-brand-soft/40 group-hover:bg-brand-soft/50',
                        )}
                      >
                        {renderCell(id, column.field)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {visibleIds.length === 0 && (
            <div className="flex flex-col items-center px-4 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <SearchX className="size-5" aria-hidden="true" />
              </span>
              <p className="mt-4 font-semibold text-gray-900">No products match these filters</p>
              <p className="mt-1 text-sm text-gray-600">
                Try another search or category, or show all products.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className={cn(
                  'mt-4 h-9 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 hover:bg-gray-50',
                  pressable,
                )}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gray-200/80 px-4 py-2.5 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-[3px] rounded-full bg-sun" aria-hidden="true" />
            Unsaved row
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-sun-soft ring-1 ring-sun/40" aria-hidden="true" />
            Edited cell
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-red/5 ring-2 ring-red/60" aria-hidden="true" />
            Needs fixing
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sun" aria-hidden="true" />
            Low stock
            <span className="ml-2 size-2 rounded-full bg-red" aria-hidden="true" />
            Out of stock
          </span>
          <div className="ml-auto flex items-center gap-2">
            {dirty && (
              <button
                type="button"
                onClick={discard}
                className={cn(
                  'h-9 rounded-full px-4 text-sm font-medium text-gray-700 hover:bg-gray-100',
                  pressable,
                )}
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty}
              className={cn(
                'inline-flex h-9 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgb(29_78_216_/_0.8)] hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
                pressable,
              )}
            >
              <Check className="size-4" aria-hidden="true" />
              Save changes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BulkEdit;
