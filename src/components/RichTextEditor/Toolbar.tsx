'use client';
import { useRef, useState } from 'react';
import { type Editor, useEditorState } from '@tiptap/react';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  ChevronDown,
  CodeXml,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  SeparatorHorizontal,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
  Upload,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const BLOCK_TYPES = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h2', label: 'Heading' },
  { value: 'h3', label: 'Subheading' },
  { value: 'h4', label: 'Small heading' },
] as const;

const ALIGNMENTS = [
  { value: 'left', label: 'Align left', icon: AlignLeft },
  { value: 'center', label: 'Center', icon: AlignCenter },
  { value: 'right', label: 'Align right', icon: AlignRight },
  { value: 'justify', label: 'Justify', icon: AlignJustify },
] as const;

const TEXT_COLORS = [
  { value: '#0f172a', label: 'Ink' },
  { value: '#6b7280', label: 'Grey' },
  { value: '#1d4ed8', label: 'Blue' },
  { value: '#0e7490', label: 'Teal' },
  { value: '#15803d', label: 'Green' },
  { value: '#b45309', label: 'Amber' },
  { value: '#c2410c', label: 'Orange' },
  { value: '#b91c1c', label: 'Red' },
];

const HIGHLIGHTS = [
  { value: '#fef08a', label: 'Yellow' },
  { value: '#fde68a', label: 'Amber' },
  { value: '#bbf7d0', label: 'Green' },
  { value: '#a5f3fc', label: 'Cyan' },
  { value: '#bfdbfe', label: 'Blue' },
  { value: '#fecaca', label: 'Red' },
  { value: '#e5e7eb', label: 'Grey' },
];

const buttonClass =
  'flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-40 sm:size-9';
const activeClass = 'bg-brand-soft text-brand-ink hover:bg-brand-soft';

const ToolButton = ({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    // Keep the text selection in the editor when a toolbar button is pressed.
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    aria-pressed={active === undefined ? undefined : active}
    className={cn(buttonClass, active && activeClass)}
  >
    {children}
  </button>
);

const Divider = () => <span className="mx-1 h-6 w-px shrink-0 bg-gray-200" aria-hidden="true" />;

const Swatches = ({
  colors,
  current,
  onPick,
  onClear,
  clearLabel,
}: {
  colors: { value: string; label: string }[];
  current?: string;
  onPick: (color: string) => void;
  onClear: () => void;
  clearLabel: string;
}) => (
  <div>
    <div className="grid grid-cols-4 gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          onClick={() => onPick(color.value)}
          aria-label={color.label}
          title={color.label}
          aria-pressed={current === color.value}
          className={cn(
            'size-9 rounded-lg border border-black/10 transition-transform hover:scale-105',
            current === color.value && 'ring-2 ring-brand ring-offset-2',
          )}
          style={{ backgroundColor: color.value }}
        />
      ))}
    </div>
    <button
      type="button"
      onClick={onClear}
      className="mt-3 h-9 w-full rounded-lg border border-gray-200 text-sm text-gray-700 transition-colors hover:bg-gray-50"
    >
      {clearLabel}
    </button>
  </div>
);

export default function Toolbar({
  editor,
  sourceMode,
  onToggleSource,
  onUploadImages,
}: {
  editor: Editor | null;
  sourceMode: boolean;
  onToggleSource: () => void;
  onUploadImages: (files: FileList) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkOpen, setLinkOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageOpen, setImageOpen] = useState(false);

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return null;
      const heading = ([2, 3, 4] as const).find((level) => e.isActive('heading', { level }));
      return {
        block: heading ? (`h${heading}` as const) : ('p' as const),
        bold: e.isActive('bold'),
        italic: e.isActive('italic'),
        underline: e.isActive('underline'),
        strike: e.isActive('strike'),
        bulletList: e.isActive('bulletList'),
        orderedList: e.isActive('orderedList'),
        blockquote: e.isActive('blockquote'),
        link: e.isActive('link'),
        linkHref: (e.getAttributes('link').href as string | undefined) ?? '',
        align: ALIGNMENTS.find((a) => e.isActive({ textAlign: a.value }))?.value ?? 'left',
        color: e.getAttributes('textStyle').color as string | undefined,
        highlight: e.getAttributes('highlight').color as string | undefined,
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
      };
    },
  });

  const disabled = !editor || !state || sourceMode;
  const chain = () => editor!.chain().focus();

  const setBlock = (value: (typeof BLOCK_TYPES)[number]['value']) => {
    if (value === 'p') chain().setParagraph().run();
    else
      chain()
        .toggleHeading({ level: Number(value[1]) as 2 | 3 | 4 })
        .run();
  };

  const applyLink = (event: React.FormEvent) => {
    event.preventDefault();
    const href = linkUrl.trim();
    if (!editor || !href) return;
    if (editor.state.selection.empty && !editor.isActive('link')) {
      // Nothing selected: insert the address itself as a link.
      chain()
        .insertContent({ type: 'text', text: href, marks: [{ type: 'link', attrs: { href } }] })
        .run();
    } else {
      chain().extendMarkRange('link').setLink({ href }).run();
    }
    setLinkOpen(false);
  };

  const insertImageUrl = (event: React.FormEvent) => {
    event.preventDefault();
    const src = imageUrl.trim();
    if (!editor || !/^https?:\/\//i.test(src)) return;
    chain().setImage({ src }).run();
    setImageUrl('');
    setImageOpen(false);
  };

  const currentBlock = BLOCK_TYPES.find((b) => b.value === state?.block) ?? BLOCK_TYPES[0];
  const currentAlign = ALIGNMENTS.find((a) => a.value === state?.align) ?? ALIGNMENTS[0];
  const AlignIcon = currentAlign.icon;

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="sticky top-[var(--header-h)] z-20 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-gray-200 bg-white/95 p-1.5 backdrop-blur-md"
    >
      <ToolButton
        label="Undo"
        disabled={disabled || !state?.canUndo}
        onClick={() => chain().undo().run()}
      >
        <Undo2 className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Redo"
        disabled={disabled || !state?.canRedo}
        onClick={() => chain().redo().run()}
      >
        <Redo2 className="size-4" aria-hidden="true" />
      </ToolButton>
      <Divider />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          disabled={disabled}
          className="flex h-10 min-w-32 items-center justify-between gap-2 rounded-lg px-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 disabled:opacity-40 sm:h-9"
          aria-label={`Text style: ${currentBlock.label}`}
        >
          {currentBlock.label}
          <ChevronDown className="size-4 text-gray-500" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          {BLOCK_TYPES.map((block) => (
            <DropdownMenuItem
              key={block.value}
              onSelect={() => setBlock(block.value)}
              className={cn(
                'cursor-pointer',
                block.value === 'h2' && 'text-lg font-semibold',
                block.value === 'h3' && 'text-base font-semibold',
                block.value === 'h4' && 'font-semibold',
                block.value === state?.block && 'bg-brand-soft',
              )}
            >
              {block.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Divider />

      <ToolButton
        label="Bold"
        active={state?.bold}
        disabled={disabled}
        onClick={() => chain().toggleBold().run()}
      >
        <Bold className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Italic"
        active={state?.italic}
        disabled={disabled}
        onClick={() => chain().toggleItalic().run()}
      >
        <Italic className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Underline"
        active={state?.underline}
        disabled={disabled}
        onClick={() => chain().toggleUnderline().run()}
      >
        <Underline className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Strikethrough"
        active={state?.strike}
        disabled={disabled}
        onClick={() => chain().toggleStrike().run()}
      >
        <Strikethrough className="size-4" aria-hidden="true" />
      </ToolButton>

      <Popover>
        <PopoverTrigger
          disabled={disabled}
          className={cn(buttonClass, 'relative')}
          aria-label="Text colour"
          title="Text colour"
        >
          <Baseline className="size-4" aria-hidden="true" />
          <span
            className="absolute inset-x-2.5 bottom-1.5 h-0.5 rounded-full"
            style={{ backgroundColor: state?.color ?? '#0f172a' }}
            aria-hidden="true"
          />
        </PopoverTrigger>
        <PopoverContent className="w-56" onOpenAutoFocus={(event) => event.preventDefault()}>
          <p className="mb-2 text-sm font-medium text-gray-900">Text colour</p>
          <Swatches
            colors={TEXT_COLORS}
            current={state?.color}
            onPick={(color) => chain().setColor(color).run()}
            onClear={() => chain().unsetColor().run()}
            clearLabel="Default colour"
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger
          disabled={disabled}
          className={cn(buttonClass, state?.highlight && activeClass)}
          aria-label="Highlight"
          title="Highlight"
        >
          <Highlighter className="size-4" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent className="w-56" onOpenAutoFocus={(event) => event.preventDefault()}>
          <p className="mb-2 text-sm font-medium text-gray-900">Highlight</p>
          <Swatches
            colors={HIGHLIGHTS}
            current={state?.highlight}
            onPick={(color) => chain().setHighlight({ color }).run()}
            onClear={() => chain().unsetHighlight().run()}
            clearLabel="No highlight"
          />
        </PopoverContent>
      </Popover>
      <Divider />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          disabled={disabled}
          className={cn(buttonClass, 'w-auto gap-0.5 px-2 sm:w-auto')}
          aria-label={`Alignment: ${currentAlign.label}`}
          title="Alignment"
        >
          <AlignIcon className="size-4" aria-hidden="true" />
          <ChevronDown className="size-3 text-gray-500" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuItem
              key={value}
              onSelect={() => chain().setTextAlign(value).run()}
              className={cn('cursor-pointer', value === state?.align && 'bg-brand-soft')}
            >
              <Icon aria-hidden="true" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ToolButton
        label="Bulleted list"
        active={state?.bulletList}
        disabled={disabled}
        onClick={() => chain().toggleBulletList().run()}
      >
        <List className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        active={state?.orderedList}
        disabled={disabled}
        onClick={() => chain().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Quote"
        active={state?.blockquote}
        disabled={disabled}
        onClick={() => chain().toggleBlockquote().run()}
      >
        <Quote className="size-4" aria-hidden="true" />
      </ToolButton>
      <ToolButton
        label="Divider line"
        disabled={disabled}
        onClick={() => chain().setHorizontalRule().run()}
      >
        <SeparatorHorizontal className="size-4" aria-hidden="true" />
      </ToolButton>
      <Divider />

      <Popover
        open={linkOpen}
        onOpenChange={(open) => {
          setLinkOpen(open);
          if (open) setLinkUrl(state?.linkHref ?? '');
        }}
      >
        <PopoverTrigger
          disabled={disabled}
          className={cn(buttonClass, state?.link && activeClass)}
          aria-label={state?.link ? 'Edit link' : 'Add link'}
          title={state?.link ? 'Edit link' : 'Add link'}
        >
          <Link2 className="size-4" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <form onSubmit={applyLink}>
            <label htmlFor="rte-link-url" className="text-sm font-medium text-gray-900">
              Link address
            </label>
            <input
              id="rte-link-url"
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://example.com"
              inputMode="url"
              className="mt-1.5 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-brand focus:ring-3 focus:ring-brand/15"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                disabled={!linkUrl.trim()}
                className="h-9 flex-1 rounded-lg bg-brand text-sm font-medium text-white disabled:bg-gray-200 disabled:text-gray-500"
              >
                {state?.link ? 'Update link' : 'Add link'}
              </button>
              {state?.link && (
                <button
                  type="button"
                  onClick={() => {
                    chain().extendMarkRange('link').unsetLink().run();
                    setLinkOpen(false);
                  }}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Unlink className="size-4" aria-hidden="true" />
                  Remove
                </button>
              )}
            </div>
          </form>
        </PopoverContent>
      </Popover>

      <Popover open={imageOpen} onOpenChange={setImageOpen}>
        <PopoverTrigger
          disabled={disabled}
          className={buttonClass}
          aria-label="Add image"
          title="Add image"
        >
          <ImagePlus className="size-4" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-white"
          >
            <Upload className="size-4" aria-hidden="true" />
            Upload from device
          </button>
          <p className="mt-2 text-xs text-gray-500">
            You can also paste or drop images into the text.
          </p>
          <form onSubmit={insertImageUrl} className="mt-4 border-t border-gray-100 pt-3">
            <label htmlFor="rte-image-url" className="text-sm font-medium text-gray-900">
              Or use an image address
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="rte-image-url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://…/photo.jpg"
                inputMode="url"
                className="h-9 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-brand focus:ring-3 focus:ring-brand/15"
              />
              <button
                type="submit"
                disabled={!/^https?:\/\//i.test(imageUrl.trim())}
                className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-40"
              >
                Insert
              </button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          if (event.target.files?.length) onUploadImages(event.target.files);
          event.target.value = '';
          setImageOpen(false);
        }}
      />

      <ToolButton
        label="Clear formatting"
        disabled={disabled}
        onClick={() => chain().unsetAllMarks().clearNodes().run()}
      >
        <RemoveFormatting className="size-4" aria-hidden="true" />
      </ToolButton>

      <span className="ml-auto" />
      <button
        type="button"
        onClick={onToggleSource}
        disabled={!editor}
        aria-pressed={sourceMode}
        title={sourceMode ? 'Back to the editor' : 'Edit HTML'}
        className={cn(
          'flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-40 sm:h-9',
          sourceMode && activeClass,
        )}
      >
        <CodeXml className="size-4" aria-hidden="true" />
        HTML
      </button>
    </div>
  );
}
