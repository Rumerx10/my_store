'use client';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Panel from '@/components/common/Panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ApiShippingRate } from '@/lib/api/types';
import { useAdminShippingRates, useShippingRateActions } from '@/lib/query/admin';
import { formatPrice } from '@/lib/utils';
import { PageLoader } from '@/components/common/QueryState';

const EMPTY = { name: '', description: '', price: '', estimate: '' };
type Form = typeof EMPTY;

const RateForm = ({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: Form;
  onSave: (form: Form) => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.name.trim()) return setError('Enter a name, e.g. Standard delivery.');
        if (form.price.trim() === '' || !(Number(form.price) >= 0)) {
          return setError('Enter the price, 0 for free delivery.');
        }
        setError('');
        onSave(form);
      }}
      className="space-y-3 rounded-lg border border-gray-200 p-4 dark:border-white/10"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="rate-name">Name</Label>
          <Input id="rate-name" value={form.name} onChange={set('name')} maxLength={100} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rate-price">Price (৳)</Label>
          <Input
            id="rate-price"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={form.price}
            onChange={set('price')}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rate-estimate">How long it takes</Label>
          <Input
            id="rate-estimate"
            value={form.estimate}
            onChange={set('estimate')}
            placeholder="3 to 5 days"
            maxLength={100}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rate-description">Description (optional)</Label>
          <Input
            id="rate-description"
            value={form.description}
            onChange={set('description')}
            placeholder="Inside Dhaka only"
            maxLength={300}
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="h-9 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 rounded-lg border border-gray-300 px-4 text-sm font-medium dark:border-white/15"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const toForm = (rate: ApiShippingRate): Form => ({
  name: rate.name,
  description: rate.description ?? '',
  price: String(Number(rate.price)),
  estimate: rate.estimate ?? '',
});

// The delivery choices shoppers pick from in the cart. Inactive ones are kept but hidden.
const DeliveryPanel = () => {
  const { data: rates = [], isPending } = useAdminShippingRates();
  const { save, remove } = useShippingRateActions();
  const [editing, setEditing] = useState<string | 'new' | null>(null);

  const submit = (form: Form, rate?: ApiShippingRate) =>
    save.mutate(
      {
        id: rate?.id,
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: Math.round(Number(form.price) * 100) / 100,
        estimate: form.estimate.trim() || undefined,
        ...(rate ? {} : { sortOrder: rates.length }),
      },
      {
        onSuccess: () => {
          toast.success(rate ? 'Delivery option saved' : 'Delivery option added');
          setEditing(null);
        },
      },
    );

  return (
    <Panel
      title="Delivery options"
      action={
        editing === null && (
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm font-medium hover:bg-gray-50 dark:border-white/15 dark:hover:bg-white/5"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add
          </button>
        )
      }
    >
      {isPending ? (
        <PageLoader className="min-h-24" />
      ) : (
        <div className="space-y-3">
          {editing === 'new' && (
            <RateForm
              initial={EMPTY}
              saving={save.isPending}
              onCancel={() => setEditing(null)}
              onSave={(form) => submit(form)}
            />
          )}
          {rates.length === 0 && editing !== 'new' && (
            <p className="text-sm text-gray-600 dark:text-slate-400">
              No delivery options yet. Shoppers can&apos;t check out until you add one.
            </p>
          )}
          <ul className="divide-y divide-gray-100 dark:divide-white/10">
            {rates.map((rate) =>
              editing === rate.id ? (
                <li key={rate.id} className="py-3">
                  <RateForm
                    initial={toForm(rate)}
                    saving={save.isPending}
                    onCancel={() => setEditing(null)}
                    onSave={(form) => submit(form, rate)}
                  />
                </li>
              ) : (
                <li key={rate.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-slate-100">
                      {rate.name}
                      {!rate.isActive && (
                        <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-normal text-gray-600 dark:bg-white/10 dark:text-slate-300">
                          Hidden
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      {formatPrice(Number(rate.price))}
                      {rate.estimate && ` · ${rate.estimate}`}
                      {rate.description && ` · ${rate.description}`}
                    </p>
                  </div>
                  <Switch
                    checked={rate.isActive}
                    aria-label={`Offer ${rate.name}`}
                    onCheckedChange={(isActive) =>
                      save.mutate(
                        { id: rate.id, isActive },
                        {
                          onSuccess: () =>
                            toast.success(`${rate.name} ${isActive ? 'offered' : 'hidden'}`),
                        },
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setEditing(rate.id)}
                    aria-label={`Edit ${rate.name}`}
                    className="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/10"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete ${rate.name}?`)) {
                        remove.mutate(rate.id, {
                          onSuccess: () => toast.success(`Deleted ${rate.name}`),
                        });
                      }
                    }}
                    aria-label={`Delete ${rate.name}`}
                    className="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-red/10 hover:text-red dark:text-slate-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </Panel>
  );
};

export default DeliveryPanel;
