import { absoluteUrl } from '@/lib/api/client';
import { brandPalette } from '@/lib/storeTheme';
import { cn } from '@/lib/utils';

const SIZES = {
  sm: 'size-8 rounded-lg text-sm',
  md: 'size-10 rounded-xl text-base',
  lg: 'size-14 rounded-2xl text-xl',
};

// The store's logo, or its first letter on the store's own colour when it has no logo.
const StoreMark = ({
  store,
  size = 'md',
  className,
}: {
  store: { name: string; logoUrl: string | null; brandColor?: string | null };
  size?: keyof typeof SIZES;
  className?: string;
}) =>
  store.logoUrl ? (
    // A plain img: logos come from the API host or anywhere a store keeps its brand files.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={absoluteUrl(store.logoUrl)}
      alt=""
      className={cn(
        SIZES[size],
        'shrink-0 bg-white object-contain p-1 ring-1 ring-gray-200 dark:ring-white/10',
        className,
      )}
    />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        SIZES[size],
        'flex shrink-0 items-center justify-center font-semibold text-white',
        className,
      )}
      style={{ background: brandPalette(store.brandColor).button }}
    >
      {store.name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );

export default StoreMark;
