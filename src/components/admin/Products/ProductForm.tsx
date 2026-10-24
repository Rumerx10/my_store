'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Controller, FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { Copy, Eye } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
import { useDispatch, useSelector } from 'react-redux';
import Panel from '@/components/dashboard/Panel';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { addProduct, updateProduct } from '@/redux/features/product/productSlice';
import { RootState } from '@/redux/store';
import { IProduct } from '@/types/api_types';
import { cn } from '@/lib/utils';
import {
  buildSchema,
  emptyFormValues,
  fromFormValues,
  toDuplicateFormValues,
  toFormValues,
  type ProductFormValues,
} from './productForm/formModel';
import Field, { fieldAria, inputClass } from './productForm/Field';
import MediaCard from './productForm/MediaCard';
import PricingCard from './productForm/PricingCard';
import InventoryCard from './productForm/InventoryCard';
import VariantsCard from './productForm/VariantsCard';
import SpecsCard from './productForm/SpecsCard';
import OrganizationCard from './productForm/OrganizationCard';
import ErrorSummary, { listProblems, type FormProblem } from './productForm/ErrorSummary';
import SaveBar, { type SaveIntent } from './productForm/SaveBar';

// Shopify-style product form. Pass `product` to edit it, or `duplicateOf` to start from a copy.
const ProductForm = ({ product, duplicateOf }: { product?: IProduct; duplicateOf?: IProduct }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [problems, setProblems] = useState<FormProblem[]>([]);
  const isNew = !product;

  const takenSkus = useMemo(
    () =>
      new Set(products.filter((p) => p.id !== product?.id).map((p) => p.sku.trim().toLowerCase())),
    [products, product?.id],
  );

  // Starting values are fixed for the life of the form; the page remounts it for a new product.
  const [defaultValues] = useState(() =>
    product
      ? toFormValues(product)
      : duplicateOf
        ? toDuplicateFormValues(duplicateOf)
        : emptyFormValues(),
  );

  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(buildSchema(takenSkus)),
    defaultValues,
    mode: 'onTouched',
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, submitCount },
  } = methods;

  // Keep the error summary in step with the inline errors once a save has failed.
  useEffect(() => {
    if (submitCount > 0) setProblems(listProblems(errors));
  }, [errors, submitCount]);

  const save = useCallback(
    (intent: SaveIntent) =>
      handleSubmit(
        (values) => {
          const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
          // A copy starts without the original's reviews or rating.
          const base =
            product ??
            (duplicateOf ? { ...duplicateOf, id: newId, reviews: [], rating: 0 } : undefined);
          const saved = fromFormValues(values, base, newId);

          dispatch(product ? updateProduct(saved) : addProduct(saved));
          reset(values);
          setProblems([]);

          if (intent === 'add-new') {
            toast.success(`${isNew ? 'Product added' : 'Product saved'}. Add the next one.`);
            router.push(`/admin/products/add-product?n=${Date.now()}`);
          } else if (intent === 'duplicate') {
            toast.success(`${isNew ? 'Product added' : 'Product saved'}. Now editing a copy.`);
            router.push(`/admin/products/add-product?duplicate=${saved.id}&n=${Date.now()}`);
          } else {
            toast.success(isNew ? 'Product added' : 'Product saved');
            if (isNew) router.replace(`/admin/products/edit-product/${saved.id}`);
          }
        },
        (formErrors: FieldErrors<ProductFormValues>) => {
          setProblems(listProblems(formErrors));
          requestAnimationFrame(() => summaryRef.current?.focus());
        },
      )(),
    [handleSubmit, products, product, duplicateOf, dispatch, reset, isNew, router],
  );

  // Ctrl+S / Cmd+S saves, like most editors.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void save('save');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [save]);

  // Warn before closing or reloading the tab with unsaved changes.
  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const discard = () => {
    reset();
    setProblems([]);
  };

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void save('save');
        }}
        // Enter in a text field shouldn't save the whole product.
        onKeyDown={(event) => {
          const target = event.target as HTMLElement;
          if (event.key === 'Enter' && target.tagName === 'INPUT') event.preventDefault();
        }}
      >
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl text-gray-900 dark:text-slate-100 md:text-3xl">
            {product ? product.title : 'Add product'}
          </h1>
          <div className="flex flex-wrap gap-2">
            {product && (
              <>
                <Link
                  href={`/admin/products/add-product?duplicate=${product.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-300 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 px-4 text-sm font-medium text-gray-800 dark:text-slate-200 transition-colors hover:bg-white dark:hover:bg-slate-900"
                >
                  <Copy className="size-4" aria-hidden="true" />
                  Duplicate
                </Link>
                <Link
                  href={`/products/${product.id}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-300 dark:border-white/15 bg-white/90 dark:bg-slate-900/90 px-4 text-sm font-medium text-gray-800 dark:text-slate-200 transition-colors hover:bg-white dark:hover:bg-slate-900"
                >
                  <Eye className="size-4" aria-hidden="true" />
                  View in store
                </Link>
              </>
            )}
            <BackButton href="/admin/products">Back to products</BackButton>
          </div>
        </div>

        {duplicateOf && (
          <p className="mb-4 rounded-xl border border-brand/20 bg-brand-soft/70 px-4 py-3 text-sm text-brand-ink">
            This is a copy of <span className="font-semibold">{duplicateOf.title}</span>. Change
            what’s different, give it its own SKU, then save.
          </p>
        )}

        {problems.length > 0 && <ErrorSummary ref={summaryRef} problems={problems} />}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="min-w-0 space-y-4">
            <Panel>
              <div className="space-y-4">
                <Field id="title" label="Title" error={errors.title?.message}>
                  <input
                    className={cn(inputClass, 'h-11 text-base')}
                    placeholder="e.g. GoodWe ET G2 Three-phase Hybrid Inverter 10kW"
                    autoComplete="off"
                    {...register('title')}
                    {...fieldAria('title', errors.title?.message)}
                  />
                </Field>
                <div className="space-y-1.5">
                  <p
                    id="description-label"
                    className="text-sm font-medium text-gray-900 dark:text-slate-100"
                  >
                    Description
                  </p>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <RichTextEditor
                        id="description"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        labelledBy="description-label"
                        placeholder="Describe the product: what it does, who it’s for, what’s in the box."
                      />
                    )}
                  />
                </div>
              </div>
            </Panel>
            <MediaCard />
            <PricingCard />
            <InventoryCard />
            <VariantsCard />
            <SpecsCard />
          </div>

          <div className="space-y-4">
            <OrganizationCard />
          </div>
        </div>

        <SaveBar
          isNew={isNew}
          isDirty={isDirty}
          isSubmitting={isSubmitting}
          onSave={(intent) => void save(intent)}
          onDiscard={discard}
        />
      </form>
    </FormProvider>
  );
};

export default ProductForm;
