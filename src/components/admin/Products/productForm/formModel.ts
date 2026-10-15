import * as yup from 'yup';
import type { IProduct, IProductOption, ProductStatus } from '@/types/api_types';
import { isColorOption } from '@/lib/products';

export interface OptionValueFormValues {
  label: string;
  priceDelta: number;
  swatch: string;
  image: string;
}

export interface OptionFormValues {
  name: string;
  values: OptionValueFormValues[];
}

export interface ProductFormValues {
  title: string;
  description: string;
  media: { src: string }[];
  price: number;
  discountPercentage: number;
  costPerItem?: number;
  sku: string;
  barcode: string;
  stock: number;
  weight?: number;
  options: OptionFormValues[];
  highlights: { text: string }[];
  specs: { label: string; value: string }[];
  status: ProductStatus;
  category: string;
  brand: string;
  tags: string[];
  popular: boolean;
  trending: boolean;
  latest: boolean;
}

export const MAX_OPTIONS = 3;

// Empty number inputs give NaN; treat them as "not set".
const optionalNumber = () =>
  yup
    .number()
    .transform((value, original) => (original === '' || Number.isNaN(value) ? undefined : value));

const uniqueBy = (values: string[]) =>
  new Set(values.map((value) => value.trim().toLowerCase())).size === values.length;

export const buildSchema = (takenSkus: Set<string>): yup.ObjectSchema<ProductFormValues> =>
  yup.object({
    title: yup.string().trim().required('Enter a product title'),
    description: yup.string().defined(),
    media: yup.array(yup.object({ src: yup.string().required() })).defined(),
    price: yup
      .number()
      .typeError('Enter a selling price')
      .positive('Selling price must be more than 0')
      .required('Enter a selling price'),
    discountPercentage: yup
      .number()
      .typeError('Enter a discount, or 0 for none')
      .min(0, 'Discount can’t be negative')
      .max(90, 'Discount can’t be more than 90%')
      .required('Enter a discount, or 0 for none'),
    costPerItem: optionalNumber().min(0, 'Cost can’t be negative').optional(),
    sku: yup
      .string()
      .trim()
      .required('Enter a SKU')
      .test('unique-sku', 'Another product already uses this SKU', (value) =>
        value ? !takenSkus.has(value.trim().toLowerCase()) : true,
      ),
    barcode: yup.string().trim().defined(),
    stock: yup
      .number()
      .typeError('Enter how many are in stock')
      .integer('Stock must be a whole number')
      .min(0, 'Stock can’t be negative')
      .required('Enter how many are in stock'),
    weight: optionalNumber().min(0, 'Weight can’t be negative').optional(),
    options: yup
      .array(
        yup.object({
          name: yup.string().trim().required('Enter an option name, like Capacity or Color'),
          values: yup
            .array(
              yup.object({
                label: yup.string().trim().required('Enter a value'),
                priceDelta: yup
                  .number()
                  .typeError('Enter an amount, or 0')
                  .min(0, 'Additional price can’t be negative')
                  .required('Enter an amount, or 0'),
                swatch: yup.string().defined(),
                image: yup.string().defined(),
              }),
            )
            .min(1, 'Add at least one value')
            .test('unique-values', 'Each value needs a different name', (values) =>
              values ? uniqueBy(values.map((v) => v.label)) : true,
            )
            .required(),
        }),
      )
      .max(MAX_OPTIONS)
      .test('unique-options', 'Each option needs a different name', (options) =>
        options ? uniqueBy(options.map((o) => o.name)) : true,
      )
      .defined(),
    highlights: yup.array(yup.object({ text: yup.string().defined() })).defined(),
    specs: yup
      .array(yup.object({ label: yup.string().defined(), value: yup.string().defined() }))
      .defined(),
    status: yup.mixed<ProductStatus>().oneOf(['active', 'draft']).required(),
    category: yup.string().required('Choose a category'),
    brand: yup.string().trim().defined(),
    tags: yup.array(yup.string().defined()).defined(),
    popular: yup.boolean().defined(),
    trending: yup.boolean().defined(),
    latest: yup.boolean().defined(),
  });

export const emptyFormValues = (): Partial<ProductFormValues> => ({
  title: '',
  description: '',
  media: [],
  discountPercentage: 0,
  sku: '',
  barcode: '',
  options: [],
  highlights: [],
  specs: [],
  status: 'active',
  category: '',
  brand: 'GoodWe',
  tags: [],
  popular: false,
  trending: false,
  latest: true,
});

const optionToForm = (option: IProductOption): OptionFormValues => ({
  name: option.name,
  values: option.values.map((value) => ({
    label: value.label,
    priceDelta: value.priceDelta,
    swatch: value.swatch ?? '',
    image: value.image ?? '',
  })),
});

export const toFormValues = (product: IProduct): ProductFormValues => ({
  title: product.title,
  description: product.description,
  media: product.images.filter((src) => src !== '/placeholder.svg').map((src) => ({ src })),
  price: product.price,
  discountPercentage: product.discountPercentage,
  costPerItem: product.costPerItem,
  sku: product.sku,
  barcode: product.meta.barcode,
  stock: product.stock,
  weight: product.weight || undefined,
  options: (product.options ?? []).map(optionToForm),
  highlights: (product.highlights ?? []).map((text) => ({ text })),
  specs: (product.specs ?? []).map(([label, value]) => ({ label, value })),
  status: product.status ?? 'active',
  category: product.category,
  brand: product.brand ?? '',
  tags: product.tags,
  popular: product.popular,
  trending: product.trending,
  latest: product.latest,
});

// A copy keeps everything except the identifiers that must be unique.
export const toDuplicateFormValues = (product: IProduct): ProductFormValues => ({
  ...toFormValues(product),
  title: `Copy of ${product.title}`,
  sku: '',
  barcode: '',
});

const availability = (stock: number) =>
  stock === 0 ? 'Out of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock';

// Defaults for fields the form doesn't edit, matching the rest of the catalog.
const newProductBase = (id: number): IProduct => {
  const now = new Date().toISOString();
  return {
    id,
    title: '',
    description: '',
    category: '',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
    tags: [],
    sku: '',
    weight: 0,
    dimensions: { width: 0, height: 0, depth: 0 },
    warrantyInformation: 'Manufacturer warranty, registered for you at installation',
    shippingInformation: 'Delivered and installed by our certified team across Bangladesh',
    availabilityStatus: 'In Stock',
    reviews: [],
    returnPolicy: '7-day return if unused and in the original packaging',
    minimumOrderQuantity: 1,
    meta: { createdAt: now, updatedAt: now, barcode: '', qrCode: '' },
    images: [],
    thumbnail: '',
    popular: false,
    trending: false,
    latest: true,
  };
};

const unique = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)));

// Turns form values into a catalog product. `existing` is the product being edited, if any.
export const fromFormValues = (
  values: ProductFormValues,
  existing: IProduct | undefined,
  newId: number,
): IProduct => {
  const base = existing ?? newProductBase(newId);
  const images = values.media.map((m) => m.src);
  const options = values.options.map((option) => {
    const color = isColorOption(option);
    return {
      name: option.name.trim(),
      values: option.values.map((value) => ({
        label: value.label.trim(),
        priceDelta: value.priceDelta,
        ...(color && value.swatch ? { swatch: value.swatch } : {}),
        ...(color && value.image && images.includes(value.image) ? { image: value.image } : {}),
      })),
    };
  });

  return {
    ...base,
    title: values.title.trim(),
    description: values.description,
    category: values.category,
    brand: values.brand.trim() || undefined,
    sku: values.sku.trim(),
    price: values.price,
    discountPercentage: values.discountPercentage,
    costPerItem: values.costPerItem,
    stock: values.stock,
    weight: values.weight ?? 0,
    status: values.status,
    options: options.length > 0 ? options : undefined,
    highlights: values.highlights.map((h) => h.text.trim()).filter(Boolean),
    specs: values.specs
      .filter((spec) => spec.label.trim() && spec.value.trim())
      .map((spec) => [spec.label.trim(), spec.value.trim()] as [string, string]),
    tags: unique(values.tags),
    popular: values.popular,
    trending: values.trending,
    latest: values.latest,
    images: images.length > 0 ? images : ['/placeholder.svg'],
    thumbnail: images[0] ?? '/placeholder.svg',
    availabilityStatus: availability(values.stock),
    meta: { ...base.meta, barcode: values.barcode.trim(), updatedAt: new Date().toISOString() },
  };
};

// Common colour names, so a new colour value starts with a sensible swatch.
const SWATCHES: Record<string, string> = {
  black: '#111827',
  white: '#ffffff',
  grey: '#9ca3af',
  gray: '#9ca3af',
  silver: '#cbd5e1',
  red: '#dc2626',
  blue: '#1d4ed8',
  navy: '#1e3a8a',
  green: '#15803d',
  yellow: '#facc15',
  orange: '#ea580c',
  pink: '#ec4899',
  purple: '#7c3aed',
  brown: '#78350f',
  beige: '#e7d8c1',
  gold: '#d4a017',
};

export const guessSwatch = (label: string) => {
  const word = label.trim().toLowerCase().split(/\s+/).pop() ?? '';
  return SWATCHES[word];
};
