'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Camera, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserAvatar from '@/components/common/UserAvatar';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { errorMessage, uploadImage } from '@/lib/api/client';
import { readImageFile } from '@/lib/imageFile';
import { useMe, useUpdateProfile } from '@/lib/query/account';
import { useMyOrders } from '@/lib/query/orders';
import { useWishlist } from '@/lib/query/wishlist';
import { memberSince } from '../AccountShell';
import PageHeading from '@/components/common/PageHeading';

const profileSchema = yup.object({
  name: yup.string().trim().required('Enter your name').min(2, 'Enter your full name'),
  email: yup
    .string()
    .trim()
    .email('Enter a valid email address')
    .max(200, 'Use a shorter email address')
    .default(''),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

// The customer's own details. The phone number is how they sign in, so it can't be changed
// here; the name, email and photo can.
const Profile = () => {
  const { data: me, isPending, error, refetch } = useMe();
  const update = useUpdateProfile();
  const { orders, hasNextPage } = useMyOrders();
  const wishlistCount = useWishlist().data?.length ?? 0;
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    values: { name: me?.name ?? '', email: me?.email ?? '' },
  });

  if (isPending) return <PageLoader label="Loading your profile" />;
  if (error || !me) return <ErrorState error={error} onRetry={() => refetch()} />;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await update.mutateAsync({ name: data.name, email: data.email || null });
      setIsEditing(false);
      toast.success('Profile saved');
    } catch {
      // The toast says why.
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const changePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setUploading(true);
    let url: string;
    try {
      url = await uploadImage(await readImageFile(file, 512));
    } catch (reason) {
      toast.error(errorMessage(reason));
      setUploading(false);
      return;
    }
    update.mutate(
      { avatarUrl: url },
      {
        onSuccess: () => toast.success('Photo updated'),
        onSettled: () => setUploading(false),
      },
    );
  };

  const removePhoto = () =>
    update.mutate({ avatarUrl: null }, { onSuccess: () => toast.success('Photo removed') });

  const stats = [
    { label: 'Member since', value: memberSince(me.createdAt) },
    { label: 'Orders placed', value: `${orders.length}${hasNextPage ? '+' : ''}` },
    { label: 'Saved items', value: wishlistCount },
  ];

  const details = [
    { label: 'Name', value: me.name },
    { label: 'Mobile number', value: me.phone },
    { label: 'Email', value: me.email || 'Not added' },
    ...(me.username ? [{ label: 'Username', value: me.username }] : []),
  ];

  return (
    <div>
      <PageHeading title="Profile" desc="Your personal details and how we contact you." />

      <section className="rounded-xl glass">
        <div className="flex flex-col items-center gap-5 border-b border-gray-100 dark:border-white/5 p-5 sm:flex-row md:p-6">
          <div className="relative">
            <UserAvatar name={me.name} avatarUrl={me.avatarUrl} className="size-20 text-xl" />
            <label className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white dark:border-white/10 bg-brand text-white transition-colors hover:bg-brand-hover focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
              {uploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Camera className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">Change profile photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={changePhoto}
                disabled={uploading}
                className="sr-only"
              />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl text-gray-900 dark:text-slate-100">{me.name}</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">{me.email || me.phone}</p>
            {me.avatarUrl && (
              <button
                type="button"
                onClick={removePhoto}
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red dark:text-slate-400"
              >
                <Trash2 className="size-3" aria-hidden="true" />
                Remove photo
              </button>
            )}
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 dark:border-white/15 px-4 text-sm font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Edit details
            </button>
          )}
        </div>

        <div className="p-5 md:p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    { name: 'name', label: 'Full name', autoComplete: 'name', type: 'text' },
                    { name: 'email', label: 'Email', autoComplete: 'email', type: 'email' },
                  ] as const
                ).map((field) => (
                  <div key={field.name}>
                    <Label
                      htmlFor={field.name}
                      className="text-sm font-medium text-gray-900 dark:text-slate-100"
                    >
                      {field.label}
                    </Label>
                    <Input
                      id={field.name}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
                      {...register(field.name)}
                      className="mt-1.5 h-11"
                    />
                    {errors[field.name] && (
                      <p id={`${field.name}-error`} className="mt-1.5 text-xs text-red">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
                    Mobile number
                  </p>
                  <p className="mt-1.5 flex h-11 items-center rounded-md border border-dashed border-gray-300 px-3 text-sm tabular-nums text-gray-500 dark:border-white/15 dark:text-slate-400">
                    {me.phone}
                  </p>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-400">
                    You sign in with this number. Contact the store to change it.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-5 font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-11 rounded-lg border border-gray-300 dark:border-white/15 px-5 font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid gap-5 sm:grid-cols-2">
              {details.map((field) => (
                <div key={field.label}>
                  <dt className="text-sm text-gray-500 dark:text-slate-400">{field.label}</dt>
                  <dd className="mt-1 break-words font-medium text-gray-900 dark:text-slate-100">
                    {field.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <dl className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl glass p-4 md:p-5">
            <dt className="text-xs text-gray-500 dark:text-slate-400 md:text-sm">{stat.label}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-gray-900 dark:text-slate-100 md:text-2xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Profile;
