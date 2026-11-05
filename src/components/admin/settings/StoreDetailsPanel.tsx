'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Panel from '@/components/common/Panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { absoluteUrl, errorMessage } from '@/lib/api/client';
import type { ApiStoreSettings } from '@/lib/api/types';
import { readImageFile } from '@/lib/imageFile';
import { useUpdateStoreSettings } from '@/lib/query/admin';

const schema = yup.object({
  name: yup.string().trim().required('Enter the store name').min(2, 'Use at least 2 letters'),
  email: yup.string().trim().required('Enter a support email').email('Enter a valid email address'),
  phone: yup
    .string()
    .trim()
    .required('Enter a support phone number')
    .matches(/^\+?[0-9 ()-]{6,20}$/, 'Enter a phone number'),
  supportHours: yup.string().trim().max(200).default(''),
  address: yup.string().trim().max(300).default(''),
});
type FormData = yup.InferType<typeof schema>;

const FIELDS: { name: keyof FormData; label: string; type?: string; wide?: boolean }[] = [
  { name: 'name', label: 'Store name' },
  { name: 'email', label: 'Support email', type: 'email' },
  { name: 'phone', label: 'Support phone', type: 'tel' },
  { name: 'supportHours', label: 'Support hours' },
  { name: 'address', label: 'Address', wide: true },
];

// What shoppers see in the header, footer, chat and on invoices.
const StoreDetailsPanel = ({ settings }: { settings: ApiStoreSettings }) => {
  const update = useUpdateStoreSettings();
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    values: {
      name: settings.name,
      email: settings.email,
      phone: settings.phone,
      supportHours: settings.supportHours ?? '',
      address: settings.address ?? '',
    },
  });

  const onSubmit = (data: FormData) =>
    update.mutate(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        supportHours: data.supportHours || null,
        address: data.address || null,
      },
      {
        onSuccess: (saved) => {
          reset({
            name: saved.name,
            email: saved.email,
            phone: saved.phone,
            supportHours: saved.supportHours ?? '',
            address: saved.address ?? '',
          });
          toast.success('Store details saved');
        },
      },
    );

  const changeLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    let dataUrl: string;
    try {
      dataUrl = await readImageFile(file, 512);
    } catch (reason) {
      toast.error(errorMessage(reason));
      setUploading(false);
      return;
    }
    update.mutate(
      { logoUrl: dataUrl },
      {
        onSuccess: () => toast.success('Logo updated'),
        onSettled: () => setUploading(false),
      },
    );
  };

  return (
    <Panel title="Store details">
      <div className="mb-5 flex items-center gap-4">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10">
          {settings.logoUrl ? (
            <Image
              src={absoluteUrl(settings.logoUrl)}
              alt=""
              fill
              sizes="64px"
              unoptimized
              className="object-contain p-1.5"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-400">{settings.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-brand dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5">
            {uploading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="size-4" aria-hidden="true" />
            )}
            {settings.logoUrl ? 'Change logo' : 'Upload logo'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={changeLogo}
            />
          </label>
          {settings.logoUrl && (
            <button
              type="button"
              onClick={() =>
                update.mutate({ logoUrl: null }, { onSuccess: () => toast.success('Logo removed') })
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-600 hover:text-red dark:text-slate-400"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>

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
        <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
          The store&apos;s web address is {settings.primaryHost}.
        </p>
        <button
          type="submit"
          disabled={!isDirty || update.isPending}
          className="mt-5 h-10 w-full rounded-lg bg-brand px-5 text-sm font-medium text-white transition-[background-color,transform,translate,scale] hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 dark:disabled:bg-white/15 disabled:text-gray-500 dark:disabled:text-slate-400 sm:w-auto"
        >
          {update.isPending ? 'Saving…' : 'Save details'}
        </button>
      </form>
    </Panel>
  );
};

export default StoreDetailsPanel;
