'use client';
import { useRef, useState } from 'react';
import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { AlignCenter, AlignLeft, AlignRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ImageAlign = 'left' | 'center' | 'right';

const ALIGNMENTS: { value: ImageAlign; label: string; icon: typeof AlignLeft }[] = [
  { value: 'left', label: 'Align image left', icon: AlignLeft },
  { value: 'center', label: 'Center image', icon: AlignCenter },
  { value: 'right', label: 'Align image right', icon: AlignRight },
];

// Widths are a percentage of the text column, so images scale with the page.
const SIZES = [25, 50, 75, 100];
const MIN_WIDTH = 10;

const JUSTIFY: Record<ImageAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const toolButton =
  'flex size-8 items-center justify-center rounded-md text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-100 dark:hover:bg-white/10';

// Editor view for an image: drag either edge to resize, and a small toolbar while selected.
export default function ImageView({
  node,
  updateAttributes,
  deleteNode,
  selected,
  editor,
}: ReactNodeViewProps) {
  const { src, alt, width, align } = node.attrs as {
    src: string;
    alt: string | null;
    width: number | null;
    align: ImageAlign;
  };
  const wrapperRef = useRef<HTMLDivElement>(null);
  const latestWidth = useRef<number | null>(null);
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const shownWidth = dragWidth ?? width ?? 100;
  const editable = editor.isEditable;

  const startResize = (side: 'left' | 'right') => (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const columnWidth = wrapperRef.current?.clientWidth ?? 1;
    const startX = event.clientX;
    const startWidth = shownWidth;
    // A centered image grows on both sides, so it moves twice as fast as the pointer.
    const factor = align === 'center' ? 2 : 1;
    const direction = side === 'right' ? 1 : -1;

    const onMove = (moveEvent: PointerEvent) => {
      const delta = (((moveEvent.clientX - startX) * direction * factor) / columnWidth) * 100;
      const next = Math.round(Math.min(100, Math.max(MIN_WIDTH, startWidth + delta)));
      latestWidth.current = next;
      setDragWidth(next);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      if (latestWidth.current !== null) updateAttributes({ width: latestWidth.current });
      latestWidth.current = null;
      setDragWidth(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  };

  return (
    <NodeViewWrapper ref={wrapperRef} className={cn('my-4 flex', JUSTIFY[align])}>
      <div className="relative" style={{ width: `${shownWidth}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- editor content is plain HTML, not next/image */}
        <img
          src={src}
          alt={alt ?? ''}
          data-drag-handle
          draggable={false}
          className={cn(
            'block h-auto w-full rounded-xl transition-shadow',
            selected && editable && 'ring-2 ring-brand ring-offset-2',
          )}
        />

        {selected && editable && (
          <>
            {(['left', 'right'] as const).map((side) => (
              <span
                key={side}
                contentEditable={false}
                onPointerDown={startResize(side)}
                aria-hidden="true"
                className={cn(
                  'absolute top-1/2 h-12 w-2.5 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-white dark:border-white/10 bg-brand shadow-card touch-none',
                  side === 'left' ? '-left-1.5' : '-right-1.5',
                )}
              />
            ))}

            <div
              contentEditable={false}
              role="toolbar"
              aria-label="Image options"
              className="absolute left-1/2 top-2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 p-1 shadow-lift"
            >
              {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateAttributes({ align: value })}
                  aria-label={label}
                  title={label}
                  aria-pressed={align === value}
                  className={cn(toolButton, align === value && 'bg-brand-soft text-brand-ink')}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </button>
              ))}
              <span className="mx-1 h-5 w-px bg-gray-200 dark:bg-white/15" aria-hidden="true" />
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateAttributes({ width: size })}
                  aria-label={`Width ${size}%`}
                  aria-pressed={shownWidth === size}
                  className={cn(
                    'h-8 rounded-md px-1.5 text-xs font-medium tabular-nums text-gray-700 dark:text-slate-300 transition-colors hover:bg-gray-100 dark:hover:bg-white/10',
                    shownWidth === size && 'bg-brand-soft text-brand-ink dark:text-brand-ink',
                  )}
                >
                  {size}%
                </button>
              ))}
              <span className="mx-1 h-5 w-px bg-gray-200 dark:bg-white/15" aria-hidden="true" />
              <input
                value={alt ?? ''}
                onChange={(event) => updateAttributes({ alt: event.target.value })}
                placeholder="Alt text"
                aria-label="Alt text, describes the image for screen readers"
                className="h-8 w-28 rounded-md border border-gray-200 dark:border-white/10 px-2 text-xs outline-none focus:border-brand"
              />
              <button
                type="button"
                onClick={deleteNode}
                aria-label="Remove image"
                title="Remove image"
                className={cn(toolButton, 'hover:bg-red/10 hover:text-red')}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>

            <span
              aria-live="polite"
              className="absolute bottom-2 right-2 rounded-md bg-gray-900/75 px-1.5 py-0.5 text-xs tabular-nums text-white"
            >
              {shownWidth}%
            </span>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
