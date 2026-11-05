'use client';
import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import Panel from '@/components/common/Panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ApiStoreSettings } from '@/lib/api/types';
import { useUpdateStoreSettings } from '@/lib/query/admin';
import { brandPalette, DEFAULT_BRAND_COLOR } from '@/lib/storeTheme';
import { cn } from '@/lib/utils';

const PRESETS = [
  { value: '#1d4ed8', name: 'Blue' },
  { value: '#0e7490', name: 'Teal' },
  { value: '#15803d', name: 'Green' },
  { value: '#4d7c0f', name: 'Olive' },
  { value: '#b45309', name: 'Amber' },
  { value: '#c2410c', name: 'Orange' },
  { value: '#be123c', name: 'Rose' },
  { value: '#7c3aed', name: 'Violet' },
  { value: '#334155', name: 'Slate' },
];

const HEX = /^#[0-9a-f]{6}$/i;

// The store's colour: buttons, the active menu item, links and charts in its seller centre.
const BrandPanel = ({ settings }: { settings: ApiStoreSettings }) => {
  const update = useUpdateStoreSettings();
  const saved = settings.brandColor ?? DEFAULT_BRAND_COLOR;
  const [color, setColor] = useState(saved);
  const [typed, setTyped] = useState(saved);
  const palette = brandPalette(color);
  const changed = color.toLowerCase() !== saved.toLowerCase();

  const pick = (value: string) => {
    setColor(value);
    setTyped(value);
  };

  const save = (brandColor: string | null) =>
    update.mutate(
      { brandColor },
      { onSuccess: () => toast.success(brandColor ? 'Brand colour saved' : 'Default colour back') },
    );

  return (
    <Panel title="Brand colour">
      <p className="-mt-2 mb-5 text-sm text-gray-600 dark:text-slate-400">
        Used for buttons, the active menu item, links and charts in this store&apos;s seller centre.
        Your logo and name come from Store details.
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
        <div className="space-y-5">
          <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const active = color.toLowerCase() === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={preset.name}
                  title={preset.name}
                  onClick={() => pick(preset.value)}
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full ring-offset-2 ring-offset-white transition-shadow dark:ring-offset-slate-900',
                    active
                      ? 'ring-2 ring-gray-900 dark:ring-slate-100'
                      : 'hover:ring-2 hover:ring-gray-300',
                  )}
                  style={{ background: preset.value }}
                >
                  {active && <Check className="size-4 text-white" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="brand-color-hex">Your own colour</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  aria-label="Choose a colour"
                  value={color}
                  onChange={(e) => pick(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1"
                />
                <Input
                  id="brand-color-hex"
                  value={typed}
                  maxLength={7}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    setTyped(value);
                    if (HEX.test(value)) setColor(value.toLowerCase());
                  }}
                  aria-invalid={!HEX.test(typed) ? true : undefined}
                  className="w-28 font-mono uppercase"
                />
              </div>
            </div>
          </div>
          {palette.adjusted && (
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Buttons use a slightly darker shade,{' '}
              <span className="font-mono uppercase">{palette.button}</span>, so white text on them
              stays easy to read.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!changed || update.isPending}
              onClick={() => save(color.toLowerCase())}
              className="h-10 rounded-lg bg-brand px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-white/15 dark:disabled:text-slate-400"
            >
              {update.isPending ? 'Saving…' : 'Save colour'}
            </button>
            {settings.brandColor && (
              <button
                type="button"
                disabled={update.isPending}
                onClick={() => {
                  pick(DEFAULT_BRAND_COLOR);
                  save(null);
                }}
                className="h-10 rounded-lg px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Use the default
              </button>
            )}
          </div>
        </div>

        {/* A preview in the chosen colour, before saving. */}
        <div
          aria-label="Preview"
          className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950"
        >
          <p className="text-xs font-medium text-gray-500 dark:text-slate-400">Preview</p>
          <div
            className="mt-3 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-white"
            style={{ background: palette.light['--color-brand'] }}
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            Orders
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: palette.light['--color-brand-soft'],
                color: palette.light['--color-brand-ink'],
              }}
            >
              12 new orders
            </span>
            <span className="text-sm font-medium" style={{ color: palette.light['--color-brand'] }}>
              View all
            </span>
          </div>
          <span
            className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg text-sm font-semibold text-white"
            style={{ backgroundImage: palette.light['--gradient-brand'] }}
          >
            Save changes
          </span>
        </div>
      </div>
    </Panel>
  );
};

export default BrandPanel;
