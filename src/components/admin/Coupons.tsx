'use client';
import { useState } from 'react';
import { Pencil, Plus, Ticket, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ApiCoupon, ApiDiscountType } from '@/lib/api/types';
import { useCouponActions, useCoupons, type CouponInput } from '@/lib/query/admin';
import { couponHeadline } from '@/lib/query/shop';
import { cn, formatOrderDate, formatPrice } from '@/lib/utils';

interface Form {
  code: string;
  description: string;
  discountType: ApiDiscountType;
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  usageLimit: string;
  startsAt: string; // yyyy-mm-dd
  endsAt: string;
  isPublic: boolean;
}

const EMPTY: Form = {
  code: '',
  description: '',
  discountType: 'PERCENTAGE',
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  usageLimit: '',
  startsAt: '',
  endsAt: '',
  isPublic: false,
};

const day = (iso: string | null) => (iso ? iso.slice(0, 10) : '');

const toForm = (coupon: ApiCoupon): Form => ({
  code: coupon.code,
  description: coupon.description ?? '',
  discountType: coupon.discountType,
  discountValue: String(Number(coupon.discountValue)),
  minOrderAmount: coupon.minOrderAmount ? String(Number(coupon.minOrderAmount)) : '',
  maxDiscountAmount: coupon.maxDiscountAmount ? String(Number(coupon.maxDiscountAmount)) : '',
  usageLimit: coupon.usageLimit !== null ? String(coupon.usageLimit) : '',
  startsAt: day(coupon.startsAt),
  endsAt: day(coupon.endsAt),
  isPublic: coupon.isPublic,
});

const optionalNumber = (value: string) => (value.trim() === '' ? null : Number(value));

// Start of the day for "from", end of the day for "until", in the shopper's own time.
const toInput = (form: Form): CouponInput => ({
  code: form.code.trim().toUpperCase(),
  description: form.description.trim() || undefined,
  discountType: form.discountType,
  discountValue: Number(form.discountValue),
  minOrderAmount: optionalNumber(form.minOrderAmount),
  maxDiscountAmount:
    form.discountType === 'PERCENTAGE' ? optionalNumber(form.maxDiscountAmount) : null,
  usageLimit: optionalNumber(form.usageLimit),
  startsAt: form.startsAt ? new Date(`${form.startsAt}T00:00:00`).toISOString() : null,
  endsAt: form.endsAt ? new Date(`${form.endsAt}T23:59:59`).toISOString() : null,
  isPublic: form.isPublic,
});

const statusOf = (coupon: ApiCoupon) => {
  const now = Date.now();
  if (!coupon.isActive)
    return {
      label: 'Off',
      className: 'bg-gray-200 text-gray-700 dark:bg-white/15 dark:text-slate-200',
    };
  if (coupon.endsAt && new Date(coupon.endsAt).getTime() < now)
    return { label: 'Expired', className: 'bg-red/10 text-red' };
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now)
    return { label: 'Scheduled', className: 'bg-sun-soft text-sun-ink' };
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
    return {
      label: 'Used up',
      className: 'bg-gray-200 text-gray-700 dark:bg-white/15 dark:text-slate-200',
    };
  return { label: 'Active', className: 'bg-green/10 text-hGreen' };
};

const CouponForm = ({
  initial,
  isNew,
  saving,
  onSave,
  onCancel,
}: {
  initial: Form;
  isNew: boolean;
  saving: boolean;
  onSave: (form: Form) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(form.discountValue);
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{2,29}$/.test(form.code.trim())) {
      return setError('Use 3 to 30 letters, digits, dashes or underscores for the code.');
    }
    if (!(value > 0)) return setError('Enter the discount.');
    if (form.discountType === 'PERCENTAGE' && value > 100) {
      return setError('A percentage discount can be at most 100.');
    }
    if (form.startsAt && form.endsAt && form.endsAt < form.startsAt) {
      return setError('The end date must be after the start date.');
    }
    setError('');
    onSave(form);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-xl glass p-5">
      <p className="font-semibold text-gray-900 dark:text-slate-100">
        {isNew ? 'New coupon' : `Edit ${initial.code}`}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="coupon-code">Code</Label>
          <Input
            id="coupon-code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="EID25"
            className="uppercase"
            maxLength={30}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coupon-type">Discount</Label>
          <div className="flex gap-2">
            <select
              id="coupon-type"
              value={form.discountType}
              onChange={(e) =>
                setForm({ ...form, discountType: e.target.value as ApiDiscountType })
              }
              className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
            >
              <option value="PERCENTAGE">Percent</option>
              <option value="FIXED_AMOUNT">Amount (৳)</option>
            </select>
            <Input
              aria-label="Discount value"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={form.discountValue}
              onChange={set('discountValue')}
              placeholder={form.discountType === 'PERCENTAGE' ? '10' : '500'}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coupon-min">Minimum order (৳, optional)</Label>
          <Input
            id="coupon-min"
            type="number"
            inputMode="decimal"
            min={0}
            value={form.minOrderAmount}
            onChange={set('minOrderAmount')}
          />
        </div>
        {form.discountType === 'PERCENTAGE' && (
          <div className="space-y-1.5">
            <Label htmlFor="coupon-max">Most it takes off (৳, optional)</Label>
            <Input
              id="coupon-max"
              type="number"
              inputMode="decimal"
              min={0}
              value={form.maxDiscountAmount}
              onChange={set('maxDiscountAmount')}
            />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="coupon-limit">Uses in total (optional)</Label>
          <Input
            id="coupon-limit"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={form.usageLimit}
            onChange={set('usageLimit')}
            placeholder="Unlimited"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coupon-from">From (optional)</Label>
          <Input id="coupon-from" type="date" value={form.startsAt} onChange={set('startsAt')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="coupon-until">Until (optional)</Label>
          <Input id="coupon-until" type="date" value={form.endsAt} onChange={set('endsAt')} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="coupon-description">Description (optional)</Label>
          <Input
            id="coupon-description"
            value={form.description}
            onChange={set('description')}
            placeholder="10% off your first solar order"
            maxLength={200}
          />
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <Switch
          checked={form.isPublic}
          onCheckedChange={(isPublic) => setForm({ ...form, isPublic })}
        />
        Show it on the store&apos;s coupons page and in the hero
      </label>
      {error && (
        <p role="alert" className="text-sm text-red">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="h-10 rounded-lg bg-brand px-5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {saving ? 'Saving…' : isNew ? 'Create coupon' : 'Save coupon'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-gray-300 px-5 text-sm font-medium dark:border-white/15"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Discount codes: create, change, switch off, and choose which ones shoppers see.
const Coupons = () => {
  const { data: coupons = [], isPending, error, refetch } = useCoupons();
  const { save, remove } = useCouponActions();
  const [editing, setEditing] = useState<string | 'new' | null>(null);

  const submit = (form: Form, coupon?: ApiCoupon) =>
    save.mutate(
      { id: coupon?.id, ...toInput(form) },
      {
        onSuccess: (saved) => {
          toast.success(coupon ? `${saved.code} saved` : `${saved.code} created`);
          setEditing(null);
        },
      },
    );

  if (isPending) return <PageLoader label="Loading coupons" />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeading
        title="Coupons"
        desc="Discount codes for your shoppers."
        action={
          editing === null && (
            <button
              type="button"
              onClick={() => setEditing('new')}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover"
            >
              <Plus className="size-4" aria-hidden="true" />
              New coupon
            </button>
          )
        }
      />

      {editing === 'new' && (
        <div className="mb-4">
          <CouponForm
            initial={EMPTY}
            isNew
            saving={save.isPending}
            onCancel={() => setEditing(null)}
            onSave={(form) => submit(form)}
          />
        </div>
      )}

      {coupons.length === 0 && editing !== 'new' ? (
        <div className="rounded-xl border border-dashed border-gray-300 backdrop-blur-sm bg-white/30 px-6 py-14 text-center dark:border-white/15 dark:bg-slate-900">
          <Ticket
            className="mx-auto size-10 text-gray-300 dark:text-slate-600"
            aria-hidden="true"
          />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">No coupons yet</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {coupons.map((coupon) =>
            editing === coupon.id ? (
              <li key={coupon.id}>
                <CouponForm
                  initial={toForm(coupon)}
                  isNew={false}
                  saving={save.isPending}
                  onCancel={() => setEditing(null)}
                  onSave={(form) => submit(form, coupon)}
                />
              </li>
            ) : (
              <li
                key={coupon.id}
                className="flex flex-wrap items-center gap-4 rounded-xl glass p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-base font-semibold tracking-wider text-gray-900 dark:text-slate-100">
                      {coupon.code}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        statusOf(coupon).className,
                      )}
                    >
                      {statusOf(coupon).label}
                    </span>
                    {coupon.isPublic && (
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-ink">
                        Public
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-slate-300">
                    {couponHeadline(coupon, formatPrice)}
                    {coupon.minOrderAmount &&
                      ` on orders over ${formatPrice(Number(coupon.minOrderAmount))}`}
                    {coupon.maxDiscountAmount &&
                      `, up to ${formatPrice(Number(coupon.maxDiscountAmount))}`}
                    {coupon.description && ` · ${coupon.description}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    Used {coupon.usedCount}
                    {coupon.usageLimit !== null && ` of ${coupon.usageLimit}`} times
                    {coupon.startsAt && ` · from ${formatOrderDate(coupon.startsAt)}`}
                    {coupon.endsAt && ` · until ${formatOrderDate(coupon.endsAt)}`}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <Switch
                    checked={coupon.isActive}
                    aria-label={`${coupon.code} on`}
                    onCheckedChange={(isActive) =>
                      save.mutate(
                        { id: coupon.id, isActive },
                        {
                          onSuccess: () =>
                            toast.success(`${coupon.code} ${isActive ? 'on' : 'off'}`),
                        },
                      )
                    }
                  />
                  On
                </label>
                <button
                  type="button"
                  onClick={() => setEditing(coupon.id)}
                  aria-label={`Edit ${coupon.code}`}
                  className="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/10"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${coupon.code}?`)) {
                      remove.mutate(coupon.id, {
                        onSuccess: () => toast.success(`Deleted ${coupon.code}`),
                      });
                    }
                  }}
                  aria-label={`Delete ${coupon.code}`}
                  className="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-red/10 hover:text-red dark:text-slate-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

export default Coupons;
