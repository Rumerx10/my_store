'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Panel from '@/components/dashboard/Panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categoryLabel } from '@/docs/navLinks';
import { CATEGORIES } from '@/docs/products';
import { addProduct, updateProduct } from '@/redux/features/product/productSlice';
import { RootState } from '@/redux/store';
import { IProduct } from '@/types/api_types';

const productSchema = yup.object({
  title: yup.string().trim().required('Enter a product name'),
  description: yup.string().trim().required('Describe the product'),
  category: yup.string().required('Choose a category'),
  brand: yup.string().trim().defined(),
  sku: yup.string().trim().required('Enter a SKU'),
  price: yup
    .number()
    .typeError('Enter a price')
    .positive('Price must be more than 0')
    .required('Enter a price'),
  discountPercentage: yup
    .number()
    .typeError('Enter a discount, or 0 for none')
    .min(0, 'Discount can’t be negative')
    .max(90, 'Discount can’t be more than 90%')
    .required('Enter a discount, or 0 for none'),
  stock: yup
    .number()
    .typeError('Enter the stock quantity')
    .integer('Stock must be a whole number')
    .min(0, 'Stock can’t be negative')
    .required('Enter the stock quantity'),
  tags: yup.string().defined(),
});

type ProductFormData = yup.InferType<typeof productSchema>;

const availability = (stock: number) =>
  stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';

const Field = ({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
    {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    {error && (
      <p id={`${id}-error`} className="text-sm text-red">
        {error}
      </p>
    )}
  </div>
);

// One form for both adding and editing; pass `product` to edit it.
const ProductForm = ({ product }: { product?: IProduct }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const nextId = useSelector(
    (state: RootState) => Math.max(0, ...state.products.map((p) => p.id)) + 1,
  );
  const [image, setImage] = useState(product?.thumbnail ?? '');

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      title: product?.title ?? '',
      description: product?.description ?? '',
      category: product?.category ?? '',
      brand: product?.brand ?? '',
      sku: product?.sku ?? '',
      price: product?.price,
      discountPercentage: product?.discountPercentage ?? 0,
      stock: product?.stock,
      tags: product?.tags.join(', ') ?? '',
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: ProductFormData) => {
    const now = new Date().toISOString();
    const thumbnail = image || '/placeholder.svg';
    const fields = {
      ...data,
      brand: data.brand || undefined,
      tags: data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      availabilityStatus: availability(data.stock),
      thumbnail,
    };

    if (product) {
      const images = image === product.thumbnail ? product.images : [thumbnail];
      dispatch(
        updateProduct({ ...product, ...fields, images, meta: { ...product.meta, updatedAt: now } }),
      );
      toast.success('Product saved');
    } else {
      dispatch(
        addProduct({
          ...fields,
          id: nextId,
          popular: false,
          trending: false,
          latest: true,
          rating: 0,
          weight: 0,
          dimensions: { width: 0, height: 0, depth: 0 },
          warrantyInformation: '',
          shippingInformation: '',
          reviews: [],
          returnPolicy: '',
          minimumOrderQuantity: 1,
          meta: { createdAt: now, updatedAt: now, barcode: '', qrCode: '' },
          images: [thumbnail],
        }),
      );
      toast.success('Product added');
    }
    router.push('/admin/products');
  };

  const fieldProps = (name: keyof ProductFormData) => ({
    id: name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 rounded text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All products
      </Link>
      <h1 className="mb-6 mt-3 text-2xl text-gray-900 md:text-3xl">
        {product ? 'Edit product' : 'Add product'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start"
      >
        <div className="space-y-4">
          <Panel title="Details">
            <div className="space-y-4">
              <Field id="title" label="Product name" error={errors.title?.message}>
                <Input {...register('title')} {...fieldProps('title')} />
              </Field>
              <Field id="description" label="Description" error={errors.description?.message}>
                <Textarea rows={5} {...register('description')} {...fieldProps('description')} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="category" label="Category" error={errors.category?.message}>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full" {...fieldProps('category')}>
                          <SelectValue placeholder="Choose a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {categoryLabel(category)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field id="brand" label="Brand (optional)" error={errors.brand?.message}>
                  <Input {...register('brand')} {...fieldProps('brand')} />
                </Field>
              </div>
              <Field
                id="tags"
                label="Tags (optional)"
                hint="Separate tags with commas, for example: beauty, mascara"
                error={errors.tags?.message}
              >
                <Input {...register('tags')} {...fieldProps('tags')} />
              </Field>
            </div>
          </Panel>

          <Panel title="Pricing and stock">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="price" label="Price (৳)" error={errors.price?.message}>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  {...register('price', { valueAsNumber: true })}
                  {...fieldProps('price')}
                />
              </Field>
              <Field
                id="discountPercentage"
                label="Discount (%)"
                error={errors.discountPercentage?.message}
              >
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  max="90"
                  {...register('discountPercentage', { valueAsNumber: true })}
                  {...fieldProps('discountPercentage')}
                />
              </Field>
              <Field id="sku" label="SKU" error={errors.sku?.message}>
                <Input {...register('sku')} {...fieldProps('sku')} />
              </Field>
              <Field id="stock" label="Stock quantity" error={errors.stock?.message}>
                <Input
                  type="number"
                  inputMode="numeric"
                  step="1"
                  min="0"
                  {...register('stock', { valueAsNumber: true })}
                  {...fieldProps('stock')}
                />
              </Field>
            </div>
          </Panel>
        </div>

        <div className="space-y-4 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
          <Panel title="Image">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
              {image ? (
                <Image src={image} alt="" fill sizes="280px" className="object-contain p-3" />
              ) : (
                <p className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-500">
                  No image yet
                </p>
              )}
            </div>
            <label className="mt-3 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
              <Upload className="size-4" aria-hidden="true" />
              {image ? 'Replace image' : 'Upload image'}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
            </label>
          </Panel>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={Boolean(product) && !isDirty && image === product?.thumbnail}
              className="h-11 rounded-lg bg-brand text-sm font-medium text-white transition-[background-color,transform] hover:bg-brand-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
            >
              {product ? 'Save changes' : 'Add product'}
            </button>
            <Link
              href="/admin/products"
              className="flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
