'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Camera, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RootState } from '@/redux/store';
import PageHeading from '../PageHeading';

const profileSchema = yup.object({
  firstName: yup.string().trim().required('Enter your first name'),
  lastName: yup.string().trim().required('Enter your last name'),
  email: yup.string().trim().required('Enter your email').email('Enter a valid email address'),
  phone: yup
    .string()
    .trim()
    .required('Enter your mobile number')
    .matches(/^(\+?880[\s-]?)?0?1[3-9][\d\s-]{8,10}$/, 'Enter a Bangladeshi mobile number'),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

const FIELDS: { name: keyof ProfileFormData; label: string; type?: string; autoComplete: string }[] = [
  { name: 'firstName', label: 'First name', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Mobile number', type: 'tel', autoComplete: 'tel' },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState('/user.webp');
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: 'Tanvir',
    lastName: 'Hasan',
    email: 'tanvir.hasan@example.com',
    phone: '+880 1712-345678',
  });
  const orderCount = useSelector((state: RootState) => state.orderlist.orders.length);
  const wishlistCount = useSelector((state: RootState) => state.wishlist.items.length);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: profileData,
  });

  const onSubmit = (data: ProfileFormData) => {
    setProfileData(data);
    setIsEditing(false);
    toast.success('Profile saved');
  };

  const handleCancel = () => {
    reset(profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const stats = [
    { label: 'Member since', value: '2023' },
    { label: 'Orders placed', value: orderCount },
    { label: 'Saved items', value: wishlistCount },
  ];

  return (
    <div>
      <PageHeading title="Profile" desc="Your personal details and how we contact you." />

      <section className="rounded-xl glass">
        <div className="flex flex-col items-center gap-5 border-b border-gray-100 p-5 sm:flex-row md:p-6">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarImage src={image} alt="" className="object-cover" />
              <AvatarFallback>
                {profileData.firstName.charAt(0)}
                {profileData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <label className="absolute -bottom-1 -right-1 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-brand text-white transition-colors hover:bg-brand-hover focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
              <Camera className="size-4" aria-hidden="true" />
              <span className="sr-only">Change profile photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl text-gray-900">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-sm text-gray-600">{profileData.email}</p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
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
                {FIELDS.map((field) => (
                  <div key={field.name}>
                    <Label htmlFor={field.name} className="text-sm font-medium text-gray-900">
                      {field.label}
                    </Label>
                    <Input
                      id={field.name}
                      type={field.type ?? 'text'}
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
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="h-11 rounded-lg bg-brand px-5 font-medium text-white transition-colors hover:bg-brand-hover"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-11 rounded-lg border border-gray-300 px-5 font-medium text-gray-900 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <div key={field.name}>
                  <dt className="text-sm text-gray-500">{field.label}</dt>
                  <dd className="mt-1 font-medium text-gray-900">{profileData[field.name]}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <dl className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl glass p-4 md:p-5">
            <dt className="text-xs text-gray-500 md:text-sm">{stat.label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-gray-900 md:text-2xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default Profile;
