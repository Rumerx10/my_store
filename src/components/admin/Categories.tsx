'use client';
import { useState } from 'react';
import Image from 'next/image';
import { FolderTree, ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { errorMessage } from '@/lib/api/client';
import type { ApiCategory } from '@/lib/api/types';
import { readImageFile } from '@/lib/imageFile';
import { useCategoryActions, type CategoryInput } from '@/lib/query/admin';
import { useCategories } from '@/lib/query/shop';

interface Form {
  name: string;
  slug: string;
  parentId: string; // '' is top level
  description: string;
  imageUrl: string; // '' is none; a data URL until it is saved
  sortOrder: string;
  isActive: boolean;
}

const EMPTY: Form = {
  name: '',
  slug: '',
  parentId: '',
  description: '',
  imageUrl: '',
  sortOrder: '0',
  isActive: true,
};

const toForm = (category: ApiCategory): Form => ({
  name: category.name,
  slug: category.slug,
  parentId: category.parentId ?? '',
  description: category.description ?? '',
  imageUrl: category.imageUrl ?? '',
  sortOrder: String(category.sortOrder),
  isActive: category.isActive,
});

const toInput = (form: Form): CategoryInput => ({
  name: form.name.trim(),
  slug: form.slug.trim() || undefined,
  description: form.description.trim() || null,
  imageUrl: form.imageUrl || null,
  parentId: form.parentId || null,
  sortOrder: Number(form.sortOrder) || 0,
  isActive: form.isActive,
});

// Same rules as the API: the slug it makes from the name when none is given.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugify = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Parents before their subcategories, in the API's order (sort order, then name).
const asTree = (categories: ApiCategory[]) => {
  const ids = new Set(categories.map((c) => c.id));
  const rows: { category: ApiCategory; depth: number }[] = [];
  const add = (parentId: string | null, depth: number) => {
    for (const category of categories) {
      const parent = category.parentId && ids.has(category.parentId) ? category.parentId : null;
      if (parent !== parentId) continue;
      rows.push({ category, depth });
      add(category.id, depth + 1);
    }
  };
  add(null, 0);
  return rows;
};

// The category and everything under it: none of these can become its parent.
const withDescendants = (categories: ApiCategory[], id: string) => {
  const found = new Set([id]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const c of categories) {
      if (c.parentId && found.has(c.parentId) && !found.has(c.id)) {
        found.add(c.id);
        grew = true;
      }
    }
  }
  return found;
};

const CategoryForm = ({
  initial,
  editingId,
  categories,
  saving,
  onSave,
  onCancel,
}: {
  initial: Form;
  editingId?: string;
  categories: ApiCategory[];
  saving: boolean;
  onSave: (form: Form) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });
  const id = (field: string) => `category-${editingId ?? 'new'}-${field}`;
  const blocked = editingId ? withDescendants(categories, editingId) : new Set<string>();
  const parents = asTree(categories).filter(({ category }) => !blocked.has(category.id));

  const pickImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setForm({ ...form, imageUrl: await readImageFile(file, 800) });
    } catch (reason) {
      toast.error(errorMessage(reason));
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return setError('Enter the category name.');
    const slug = form.slug.trim();
    if (slug && !SLUG_PATTERN.test(slug)) {
      return setError(
        'Use lowercase letters, digits and dashes for the URL name, like solar-panels.',
      );
    }
    if (!slug && !slugify(form.name)) {
      return setError('Add a URL name made of letters or digits, like solar-panels.');
    }
    setError('');
    onSave(form);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-xl glass p-5">
      <p className="font-semibold text-gray-900 dark:text-slate-100">
        {editingId ? `Edit ${initial.name}` : 'New category'}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={id('name')}>Name</Label>
          <Input
            id={id('name')}
            value={form.name}
            onChange={set('name')}
            placeholder="Solar panels"
            maxLength={100}
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id('slug')}>URL name (optional)</Label>
          <Input
            id={id('slug')}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
            placeholder={slugify(form.name) || 'solar-panels'}
            maxLength={100}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id('parent')}>Inside</Label>
          <select
            id={id('parent')}
            value={form.parentId}
            onChange={set('parentId')}
            className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm dark:bg-slate-900"
          >
            <option value="">Nothing (top level)</option>
            {parents.map(({ category, depth }) => (
              <option key={category.id} value={category.id}>
                {' '.repeat(depth)}
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor={id('description')}>Description (optional)</Label>
          <Input
            id={id('description')}
            value={form.description}
            onChange={set('description')}
            placeholder="Lightweight, bifacial and balcony panels"
            maxLength={500}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id('order')}>Order</Label>
          <Input
            id={id('order')}
            type="number"
            inputMode="numeric"
            min={0}
            max={10000}
            step={1}
            value={form.sortOrder}
            onChange={set('sortOrder')}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10">
          {form.imageUrl ? (
            <Image
              src={form.imageUrl}
              alt=""
              fill
              sizes="64px"
              unoptimized
              className="object-contain p-1.5"
            />
          ) : (
            <FolderTree className="size-6 text-gray-300 dark:text-slate-600" aria-hidden="true" />
          )}
        </div>
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-brand dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5">
          <ImagePlus className="size-4" aria-hidden="true" />
          {form.imageUrl ? 'Change image' : 'Add image (optional)'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={pickImage}
          />
        </label>
        {form.imageUrl && (
          <button
            type="button"
            onClick={() => setForm({ ...form, imageUrl: '' })}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-gray-600 hover:text-red dark:text-slate-400"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Remove
          </button>
        )}
      </div>

      <label className="flex items-center gap-3 text-sm">
        <Switch
          checked={form.isActive}
          onCheckedChange={(isActive) => setForm({ ...form, isActive })}
        />
        Show it in the store
      </label>
      {error && (
        <p role="alert" className="text-sm text-red">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="h-10 rounded-lg bg-brand px-5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {saving ? 'Saving…' : editingId ? 'Save category' : 'Create category'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-gray-300 px-5 text-sm font-medium dark:border-white/15"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// The store's categories and subcategories: create, change, hide and delete.
const Categories = () => {
  const { data: categories = [], isPending, error, refetch } = useCategories();
  const { save, remove } = useCategoryActions();
  const [editing, setEditing] = useState<string | 'new' | null>(null);

  const submit = (form: Form, category?: ApiCategory) =>
    save.mutate(
      { id: category?.id, ...toInput(form) },
      {
        onSuccess: (saved) => {
          toast.success(category ? `${saved.name} saved` : `${saved.name} created`);
          setEditing(null);
        },
      },
    );

  const deleteCategory = (category: ApiCategory) => {
    const children = categories.filter((c) => c.parentId === category.id).length;
    if (category.productCount > 0) {
      return toast.error(
        `${category.name} still has ${category.productCount} product(s). Move them to another category first.`,
      );
    }
    if (children > 0) {
      return toast.error(`${category.name} still has subcategories. Move or delete them first.`);
    }
    if (window.confirm(`Delete ${category.name}?`)) {
      remove.mutate(category.id, { onSuccess: () => toast.success(`Deleted ${category.name}`) });
    }
  };

  if (isPending) return <PageLoader label="Loading categories" />;
  if (error) return <ErrorState error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeading
        title="Categories"
        desc="Group your products so shoppers can browse them."
        action={
          editing === null && (
            <button
              type="button"
              onClick={() => setEditing('new')}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover"
            >
              <Plus className="size-4" aria-hidden="true" />
              New category
            </button>
          )
        }
      />

      {editing === 'new' && (
        <div className="mb-4">
          <CategoryForm
            initial={EMPTY}
            categories={categories}
            saving={save.isPending}
            onCancel={() => setEditing(null)}
            onSave={(form) => submit(form)}
          />
        </div>
      )}

      {categories.length === 0 && editing !== 'new' ? (
        <div className="rounded-xl border border-dashed border-gray-300 backdrop-blur-sm bg-white/30 px-6 py-14 text-center dark:border-white/15 dark:bg-slate-900">
          <FolderTree
            className="mx-auto size-10 text-gray-300 dark:text-slate-600"
            aria-hidden="true"
          />
          <p className="mt-3 font-medium text-gray-900 dark:text-slate-100">No categories yet</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {asTree(categories).map(({ category, depth }) =>
            editing === category.id ? (
              <li key={category.id}>
                <CategoryForm
                  initial={toForm(category)}
                  editingId={category.id}
                  categories={categories}
                  saving={save.isPending}
                  onCancel={() => setEditing(null)}
                  onSave={(form) => submit(form, category)}
                />
              </li>
            ) : (
              <li
                key={category.id}
                style={{ marginInlineStart: `${Math.min(depth, 3) * 1.5}rem` }}
                className="flex flex-wrap items-center gap-4 rounded-xl glass p-4"
              >
                <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 ring-1 ring-gray-200 dark:bg-white/5 dark:ring-white/10">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt=""
                      fill
                      sizes="48px"
                      unoptimized
                      className="object-contain p-1"
                    />
                  ) : (
                    <FolderTree
                      className="size-5 text-gray-300 dark:text-slate-600"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1 basis-48">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                      {category.name}
                    </span>
                    {!category.isActive && (
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-white/15 dark:text-slate-200">
                        Hidden
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    /{category.slug} · {category.productCount}{' '}
                    {category.productCount === 1 ? 'product' : 'products'}
                  </p>
                  {category.description && (
                    <p className="truncate text-sm text-gray-700 dark:text-slate-300">
                      {category.description}
                    </p>
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <Switch
                    checked={category.isActive}
                    aria-label={`Show ${category.name} in the store`}
                    onCheckedChange={(isActive) =>
                      save.mutate(
                        { id: category.id, isActive },
                        {
                          onSuccess: () =>
                            toast.success(`${category.name} ${isActive ? 'shown' : 'hidden'}`),
                        },
                      )
                    }
                  />
                  Shown
                </label>
                <button
                  type="button"
                  onClick={() => setEditing(category.id)}
                  aria-label={`Edit ${category.name}`}
                  className="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-white/10"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(category)}
                  aria-label={`Delete ${category.name}`}
                  className="flex size-9 items-center justify-center rounded-lg text-gray-500 hover:bg-red/10 hover:text-red dark:text-slate-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};

export default Categories;
