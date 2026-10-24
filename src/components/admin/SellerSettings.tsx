'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import Panel from '@/components/dashboard/Panel';
import PageHeading from '@/components/profilePages/PageHeading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SITE } from '@/docs/site';

const storeSchema = yup.object({
  name: yup.string().trim().required('Enter the store name'),
  email: yup.string().trim().required('Enter a support email').email('Enter a valid email address'),
  phone: yup.string().trim().required('Enter a support phone number'),
  address: yup.string().trim().required('Enter the store address'),
  hours: yup.string().trim().required('Enter your support hours'),
});

type StoreFormData = yup.InferType<typeof storeSchema>;

const FIELDS: { name: keyof StoreFormData; label: string; type?: string; wide?: boolean }[] = [
  { name: 'name', label: 'Store name' },
  { name: 'email', label: 'Support email', type: 'email' },
  { name: 'phone', label: 'Support phone', type: 'tel' },
  { name: 'hours', label: 'Support hours' },
  { name: 'address', label: 'Address', wide: true },
];

const ALERTS = [
  { key: 'newOrder', label: 'New orders', hint: 'Email me when a customer places an order.' },
  { key: 'lowStock', label: 'Low stock', hint: 'Email me when a product has 5 or fewer left.' },
  { key: 'weekly', label: 'Weekly summary', hint: 'Send a sales summary every Saturday.' },
] as const;

const SellerSettings = () => {
  const [alerts, setAlerts] = useState({ newOrder: true, lowStock: true, weekly: false });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoreFormData>({
    resolver: yupResolver(storeSchema),
    defaultValues: {
      name: SITE.name,
      email: SITE.email,
      phone: SITE.phone,
      address: SITE.address,
      hours: SITE.hours,
    },
  });

  const onSubmit = (data: StoreFormData) => {
    reset(data);
    toast.success('Store details saved');
  };

  return (
    <div>
      <PageHeading title="Settings" desc="Store details and the alerts you receive." />

      <div className="space-y-4">
        <Panel title="Store details">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              {FIELDS.map(({ name, label, type = 'text', wide }) => (
                <div key={name} className={wide ? 'space-y-1.5 sm:col-span-2' : 'space-y-1.5'}>
                  <Label htmlFor={`store-${name}`}>{label}</Label>
                  <Input
                    id={`store-${name}`}
                    type={type}
                    aria-invalid={errors[name] ? true : undefined}
                    aria-describedby={errors[name] ? `store-${name}-error` : undefined}
                    {...register(name)}
                  />
                  {errors[name] && (
                    <p id={`store-${name}-error`} className="text-sm text-red">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={!isDirty}
              className="mt-5 h-10 w-full rounded-lg bg-brand px-5 text-sm font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-white/15 disabled:text-gray-500 dark:disabled:text-slate-400 sm:w-auto"
            >
              Save details
            </button>
          </form>
        </Panel>

        <Panel title="Alerts">
          <ul className="divide-y divide-gray-100 dark:divide-white/10">
            {ALERTS.map(({ key, label, hint }) => (
              <li
                key={key}
                className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <Label
                    htmlFor={`alert-${key}`}
                    className="font-medium text-gray-900 dark:text-slate-100"
                  >
                    {label}
                  </Label>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-slate-400">{hint}</p>
                </div>
                <Switch
                  id={`alert-${key}`}
                  checked={alerts[key]}
                  onCheckedChange={(checked) => setAlerts((prev) => ({ ...prev, [key]: checked }))}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
};

export default SellerSettings;
