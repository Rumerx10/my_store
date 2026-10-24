'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ChevronLeft, ChevronRight, ImagePlus, Link2, Star, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Panel from '@/components/dashboard/Panel';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { isImageFile, readImageFile } from '@/lib/imageFile';
import { cn } from '@/lib/utils';
import type { ProductFormValues } from './formModel';
import { inputClass } from './Field';

// Remote images must come from a host next.config.ts allows; uploads are always fine.
const ALLOWED_HOSTS = ['en.goodwe.com', 'en.pvbm.com', 'images.unsplash.com'];

const checkImageUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return 'Use an https:// address.';
    if (!ALLOWED_HOSTS.includes(url.hostname))
      return `Images can come from ${ALLOWED_HOSTS.join(', ')}. Upload other images instead.`;
    return null;
  } catch {
    return 'Enter a full image address, starting with https://';
  }
};

const MediaCard = () => {
  const { control, getValues, setValue } = useFormContext<ProductFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: 'media' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);
  const [pending, setPending] = useState(0);
  const [dropActive, setDropActive] = useState(false);
  const [urlOpen, setUrlOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  const addFiles = async (list: FileList | File[]) => {
    const files = Array.from(list);
    const images = files.filter(isImageFile);
    if (images.length < files.length) toast.error('Only image files can be added.');
    setPending((n) => n + images.length);
    for (const file of images) {
      try {
        append({ src: await readImageFile(file) });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Couldn't add ${file.name}.`);
      } finally {
        setPending((n) => n - 1);
      }
    }
  };

  const addUrl = (event: React.FormEvent) => {
    event.preventDefault();
    const problem = checkImageUrl(url.trim());
    if (problem) {
      setUrlError(problem);
      return;
    }
    append({ src: url.trim() });
    setUrl('');
    setUrlError(null);
    setUrlOpen(false);
  };

  // Removing an image also unlinks it from any colour that showed it.
  const removeAt = (index: number) => {
    const src = getValues(`media.${index}.src`);
    getValues('options').forEach((option, o) =>
      option.values.forEach((value, v) => {
        if (value.image === src)
          setValue(`options.${o}.values.${v}.image`, '', { shouldDirty: true });
      }),
    );
    remove(index);
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDropActive(false);
    if (event.dataTransfer.files.length) void addFiles(event.dataTransfer.files);
  };

  const dropHandlers = {
    onDragOver: (event: React.DragEvent) => {
      if (event.dataTransfer.types.includes('Files')) {
        event.preventDefault();
        setDropActive(true);
      }
    },
    onDragLeave: () => setDropActive(false),
    onDrop,
  };

  const urlForm = (
    <Popover open={urlOpen} onOpenChange={setUrlOpen}>
      <PopoverTrigger className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-brand transition-colors hover:bg-brand-soft">
        <Link2 className="size-4" aria-hidden="true" />
        Add from URL
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <form onSubmit={addUrl}>
          <label
            htmlFor="media-url"
            className="text-sm font-medium text-gray-900 dark:text-slate-100"
          >
            Image address
          </label>
          <input
            id="media-url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setUrlError(null);
            }}
            placeholder="https://en.goodwe.com/…/product.png"
            inputMode="url"
            aria-invalid={urlError ? true : undefined}
            aria-describedby={urlError ? 'media-url-error' : undefined}
            className={cn(inputClass, 'mt-1.5')}
          />
          {urlError && (
            <p id="media-url-error" className="mt-1.5 text-sm text-red">
              {urlError}
            </p>
          )}
          <button
            type="submit"
            disabled={!url.trim()}
            className="mt-3 h-9 w-full rounded-lg bg-brand text-sm font-medium text-white disabled:bg-gray-200 dark:disabled:bg-white/15 disabled:text-gray-500 dark:disabled:text-slate-400"
          >
            Add image
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );

  return (
    <Panel title="Media">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          if (event.target.files?.length) void addFiles(event.target.files);
          event.target.value = '';
        }}
      />

      {fields.length === 0 && pending === 0 ? (
        <div
          {...dropHandlers}
          className={cn(
            'flex flex-col items-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
            dropActive
              ? 'border-brand bg-brand-soft/60'
              : 'border-gray-300 dark:border-white/15 bg-white/50 dark:bg-slate-900/50',
          )}
        >
          <ImagePlus className="size-8 text-gray-400 dark:text-slate-500" aria-hidden="true" />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 dark:border-white/15 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-gray-900 dark:text-slate-100 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <Upload className="size-4" aria-hidden="true" />
              Upload images
            </button>
            {urlForm}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
            Or drop images here. JPG, PNG, WebP or GIF.
          </p>
        </div>
      ) : (
        <>
          <ul
            {...dropHandlers}
            className={cn(
              'grid grid-cols-3 gap-3 rounded-xl sm:grid-cols-4',
              dropActive && 'ring-2 ring-brand ring-offset-4',
            )}
            aria-label="Product images"
          >
            {fields.map((field, index) => (
              <li
                key={field.id}
                draggable
                onDragStart={(event) => {
                  dragIndex.current = index;
                  event.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(event) => {
                  if (dragIndex.current !== null) event.preventDefault();
                }}
                onDrop={(event) => {
                  if (dragIndex.current === null) return;
                  event.preventDefault();
                  event.stopPropagation();
                  if (dragIndex.current !== index) move(dragIndex.current, index);
                  dragIndex.current = null;
                }}
                onDragEnd={() => (dragIndex.current = null)}
                className={cn(
                  'group relative aspect-square cursor-grab overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 active:cursor-grabbing',
                  index === 0 && 'col-span-2 row-span-2',
                )}
              >
                <Image
                  src={field.src}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes={index === 0 ? '320px' : '160px'}
                  className="object-contain p-2"
                />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-md bg-gray-900/75 px-2 py-0.5 text-xs font-medium text-white">
                    Cover
                  </span>
                )}
                {/* Controls appear on hover and stay reachable by keyboard. */}
                <div className="absolute inset-x-1.5 bottom-1.5 flex justify-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {index > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => move(index, 0)}
                        aria-label={`Make image ${index + 1} the cover`}
                        title="Make cover"
                        className="flex size-8 items-center justify-center rounded-md bg-white/95 dark:bg-slate-900/95 text-gray-700 dark:text-slate-300 shadow-card hover:text-brand"
                      >
                        <Star className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, index - 1)}
                        aria-label={`Move image ${index + 1} earlier`}
                        title="Move earlier"
                        className="flex size-8 items-center justify-center rounded-md bg-white/95 dark:bg-slate-900/95 text-gray-700 dark:text-slate-300 shadow-card hover:text-brand"
                      >
                        <ChevronLeft className="size-4" aria-hidden="true" />
                      </button>
                    </>
                  )}
                  {index < fields.length - 1 && (
                    <button
                      type="button"
                      onClick={() => move(index, index + 1)}
                      aria-label={`Move image ${index + 1} later`}
                      title="Move later"
                      className="flex size-8 items-center justify-center rounded-md bg-white/95 dark:bg-slate-900/95 text-gray-700 dark:text-slate-300 shadow-card hover:text-brand"
                    >
                      <ChevronRight className="size-4" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    aria-label={`Remove image ${index + 1}`}
                    title="Remove"
                    className="flex size-8 items-center justify-center rounded-md bg-white/95 dark:bg-slate-900/95 text-gray-700 dark:text-slate-300 shadow-card hover:text-red"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
            {Array.from({ length: pending }, (_, i) => (
              <li
                key={`pending-${i}`}
                className="flex aspect-square animate-pulse items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/10 text-xs text-gray-500 dark:text-slate-400"
              >
                Adding…
              </li>
            ))}
            <li className="aspect-square">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex size-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/15 text-sm text-gray-600 dark:text-slate-400 transition-colors hover:border-brand hover:text-brand"
              >
                <ImagePlus className="size-5" aria-hidden="true" />
                Add
              </button>
            </li>
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-gray-500 dark:text-slate-400">
              The first image is the cover in the store. Drag images to reorder them.
            </p>
            {urlForm}
          </div>
        </>
      )}
    </Panel>
  );
};

export default MediaCard;
