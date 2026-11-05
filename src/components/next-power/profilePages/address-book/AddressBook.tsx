'use client';

import { useState } from 'react';
import { Loader2, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import type { ApiAddress } from '@/lib/api/types';
import { useAddressActions, useAddresses, type AddressInput } from '@/lib/query/addresses';
import PageHeading from '@/components/common/PageHeading';

type AddressForm = Required<Omit<AddressInput, 'isDefault'>>;

const EMPTY_FORM: AddressForm = {
  label: '',
  name: '',
  phone: '',
  district: '',
  thana: '',
  villageOrWard: '',
  addressLine: '',
  postCode: '',
};

const FORM_FIELDS: {
  key: keyof AddressForm;
  label: string;
  placeholder: string;
  optional?: boolean;
  wide?: boolean;
  type?: string;
  autoComplete?: string;
}[] = [
  { key: 'label', label: 'Label', placeholder: 'Home, Office, Parents', optional: true },
  { key: 'name', label: 'Receiver’s name', placeholder: 'Tanvir Hasan', autoComplete: 'name' },
  {
    key: 'phone',
    label: 'Mobile number',
    placeholder: '01XXXXXXXXX',
    type: 'tel',
    autoComplete: 'tel',
  },
  { key: 'district', label: 'District', placeholder: 'Dhaka' },
  { key: 'thana', label: 'Thana / upazila', placeholder: 'Mirpur' },
  { key: 'villageOrWard', label: 'Village / ward', placeholder: 'Ward 6' },
  {
    key: 'addressLine',
    label: 'House and road',
    placeholder: 'House 18, Road 7',
    optional: true,
    wide: true,
    autoComplete: 'street-address',
  },
  {
    key: 'postCode',
    label: 'Post code',
    placeholder: '1216',
    optional: true,
    autoComplete: 'postal-code',
  },
];

const toForm = (address: ApiAddress): AddressForm => ({
  label: address.label ?? '',
  name: address.name,
  phone: address.phone,
  district: address.district,
  thana: address.thana,
  villageOrWard: address.villageOrWard,
  addressLine: address.addressLine ?? '',
  postCode: address.postCode ?? '',
});

// Where we deliver: the customer's saved addresses, one of them the default for checkout.
const AddressBook = () => {
  const { data: addresses = [], isPending, error, refetch } = useAddresses();
  const { save, remove, makeDefault } = useAddressActions();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressForm>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const isFormOpen = isAddingNew || editingId !== null;

  const closeForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleEdit = (address: ApiAddress) => {
    setIsAddingNew(false);
    setEditingId(address.id);
    setFormData(toForm(address));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (address: ApiAddress) => {
    const name = address.label || address.name;
    if (!window.confirm(`Delete the address "${name}"?`)) return;
    remove.mutate(address.id, { onSuccess: () => toast.success(`Removed ${name}`) });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = FORM_FIELDS.find(({ key, optional }) => !optional && !formData[key].trim());
    if (missing) {
      setFormError(`Enter the ${missing.label.toLowerCase()}.`);
      return;
    }
    const input: AddressInput & { id?: string } = {
      id: editingId ?? undefined,
      label: formData.label.trim() || undefined,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      district: formData.district.trim(),
      thana: formData.thana.trim(),
      villageOrWard: formData.villageOrWard.trim(),
      addressLine: formData.addressLine.trim() || undefined,
      postCode: formData.postCode.trim() || undefined,
    };
    save.mutate(input, {
      onSuccess: () => {
        toast.success(editingId ? 'Address updated' : 'Address added');
        closeForm();
      },
    });
  };

  if (isPending) return <PageLoader label="Loading your addresses" />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeading
        title="Address book"
        desc="Where we deliver your orders."
        action={
          !isFormOpen && (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add address
            </button>
          )
        }
      />

      {isFormOpen && (
        <form onSubmit={handleSave} noValidate className="mb-6 rounded-xl glass p-5 md:p-6">
          <h2 className="text-lg text-gray-900 dark:text-slate-100">
            {editingId !== null ? 'Edit address' : 'New address'}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {FORM_FIELDS.map((field) => (
              <div key={field.key} className={field.wide ? 'md:col-span-2' : undefined}>
                <Label
                  htmlFor={`address-${field.key}`}
                  className="text-sm font-medium text-gray-900 dark:text-slate-100"
                >
                  {field.label}
                  {field.optional && (
                    <span className="font-normal text-gray-500 dark:text-slate-400">
                      {' '}
                      (optional)
                    </span>
                  )}
                </Label>
                <Input
                  id={`address-${field.key}`}
                  type={field.type ?? 'text'}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChange={(e) => {
                    setFormData({ ...formData, [field.key]: e.target.value });
                    setFormError('');
                  }}
                  className="mt-1.5 h-11"
                />
              </div>
            ))}
          </div>
          {formError && (
            <p role="alert" className="mt-4 text-sm text-red">
              {formError}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={save.isPending}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-5 font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
            >
              {save.isPending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Save address
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="h-11 rounded-lg border border-gray-300 dark:border-white/15 px-5 font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 px-6 py-14 text-center">
          <MapPin
            className="mx-auto size-10 text-gray-300 dark:text-slate-600"
            aria-hidden="true"
          />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">No saved addresses</p>
          <p className="text-sm text-gray-600 dark:text-slate-400">Add one to speed up checkout.</p>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => {
            const title = address.label || 'Address';
            return (
              <li
                key={address.id}
                className={`flex flex-col rounded-xl border bg-white dark:bg-slate-900 p-5 ${
                  address.isDefault
                    ? 'border-brand ring-1 ring-brand'
                    : 'border-gray-200/80 dark:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-slate-100">
                    <MapPin className="size-4 text-brand" aria-hidden="true" />
                    {title}
                    {address.isDefault && (
                      <span className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-ink">
                        Default
                      </span>
                    )}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(address)}
                      aria-label={`Edit ${title}`}
                      className="flex size-9 items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-slate-100"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(address)}
                      aria-label={`Delete ${title}`}
                      className="flex size-9 items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 transition-colors hover:bg-red/10 hover:text-red"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <address className="mt-3 text-sm not-italic leading-relaxed text-gray-700 dark:text-slate-300">
                  <span className="font-medium text-gray-900 dark:text-slate-100">
                    {address.name}
                  </span>
                  <br />
                  {[address.addressLine, address.villageOrWard].filter(Boolean).join(', ')}
                  <br />
                  {address.thana}, {address.district} {address.postCode ?? ''}
                </address>
                <p className="mt-3 flex items-center gap-2 border-t border-gray-100 dark:border-white/5 pt-3 text-sm tabular-nums text-gray-600 dark:text-slate-400">
                  <Phone className="size-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
                  {address.phone}
                </p>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() =>
                      makeDefault.mutate(address.id, {
                        onSuccess: () => toast.success(`${title} is now your default address`),
                      })
                    }
                    disabled={makeDefault.isPending}
                    className="mt-3 self-start rounded text-sm font-medium text-brand hover:text-brand-hover disabled:opacity-50"
                  >
                    Set as default
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AddressBook;
