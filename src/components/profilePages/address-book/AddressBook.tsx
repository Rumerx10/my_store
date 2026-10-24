'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeading from '../PageHeading';

interface Address {
  id: number;
  name: string;
  street: string;
  area: string;
  city: string;
  postCode: string;
  phone: string;
  default: boolean;
}

type AddressForm = Omit<Address, 'id' | 'default'>;

const EMPTY_FORM: AddressForm = {
  name: '',
  street: '',
  area: '',
  city: '',
  postCode: '',
  phone: '',
};

const FORM_FIELDS: {
  key: keyof AddressForm;
  label: string;
  placeholder: string;
  wide?: boolean;
}[] = [
  { key: 'name', label: 'Label', placeholder: 'Home, Office, Parents' },
  { key: 'phone', label: 'Mobile number', placeholder: '01XXXXXXXXX' },
  { key: 'street', label: 'House and road', placeholder: 'House 18, Road 7', wide: true },
  { key: 'area', label: 'Area', placeholder: 'Mirpur 12, Pallabi' },
  { key: 'city', label: 'City', placeholder: 'Dhaka' },
  { key: 'postCode', label: 'Post code', placeholder: '1216' },
];

const AddressBook = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: 'Home',
      street: 'House 18, Road 7',
      area: 'Mirpur 12, Pallabi',
      city: 'Dhaka',
      postCode: '1216',
      phone: '+880 1712-345678',
      default: true,
    },
    {
      id: 2,
      name: 'Office',
      street: 'Level 6, 45 Gulshan Avenue',
      area: 'Gulshan 2',
      city: 'Dhaka',
      postCode: '1212',
      phone: '+880 1812-345678',
      default: false,
    },
  ]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AddressForm>(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const isFormOpen = isAddingNew || editingId !== null;

  const closeForm = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const makeDefault = (id: number) => {
    setAddresses((prev) => prev.map((addr) => ({ ...addr, default: addr.id === id })));
  };

  const handleEdit = (address: Address) => {
    setIsAddingNew(false);
    setEditingId(address.id);
    setFormData({
      name: address.name,
      street: address.street,
      area: address.area,
      city: address.city,
      postCode: address.postCode,
      phone: address.phone,
    });
  };

  const handleDelete = (address: Address) => {
    setAddresses((prev) => {
      const rest = prev.filter((addr) => addr.id !== address.id);
      // Keep one default address when the default one is removed.
      if (address.default && rest.length > 0) rest[0] = { ...rest[0], default: true };
      return rest;
    });
    toast.success(`Removed ${address.name}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (FORM_FIELDS.some(({ key }) => !formData[key].trim())) {
      setFormError('Fill in every field to save this address.');
      return;
    }
    if (editingId !== null) {
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === editingId ? { ...addr, ...formData } : addr)),
      );
      toast.success('Address updated');
    } else {
      setAddresses((prev) => [
        ...prev,
        {
          id: Math.max(0, ...prev.map((a) => a.id)) + 1,
          ...formData,
          default: prev.length === 0,
        },
      ]);
      toast.success('Address added');
    }
    closeForm();
  };

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
                </Label>
                <Input
                  id={`address-${field.key}`}
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
              className="h-11 rounded-lg bg-brand px-5 font-medium text-white transition-colors hover:bg-brand-hover"
            >
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
          {addresses.map((address) => (
            <li
              key={address.id}
              className={`flex flex-col rounded-xl border bg-white dark:bg-slate-900 p-5 ${
                address.default
                  ? 'border-brand ring-1 ring-brand'
                  : 'border-gray-200/80 dark:border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-slate-100">
                  <MapPin className="size-4 text-brand" aria-hidden="true" />
                  {address.name}
                  {address.default && (
                    <span className="rounded-md bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-ink">
                      Default
                    </span>
                  )}
                </h3>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleEdit(address)}
                    aria-label={`Edit ${address.name}`}
                    className="flex size-9 items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-slate-100"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address)}
                    aria-label={`Delete ${address.name}`}
                    className="flex size-9 items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 transition-colors hover:bg-red/10 hover:text-red"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <address className="mt-3 text-sm not-italic leading-relaxed text-gray-700 dark:text-slate-300">
                {address.street}
                <br />
                {address.area}, {address.city} {address.postCode}
              </address>
              <p className="mt-3 flex items-center gap-2 border-t border-gray-100 dark:border-white/5 pt-3 text-sm tabular-nums text-gray-600 dark:text-slate-400">
                <Phone className="size-4 text-gray-400 dark:text-slate-500" aria-hidden="true" />
                {address.phone}
              </p>
              {!address.default && (
                <button
                  type="button"
                  onClick={() => makeDefault(address.id)}
                  className="mt-3 self-start rounded text-sm font-medium text-brand hover:text-brand-hover"
                >
                  Set as default
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressBook;
