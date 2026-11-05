'use client';
import { Component, useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  GripVertical,
  PanelTop,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Hero from '@/components/next-power/home/Hero/Hero';
import { HomeSection } from '@/components/next-power/home/Home';
import PageHeading from '@/components/common/PageHeading';
import { ErrorState, PageLoader } from '@/components/common/QueryState';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import type {
  ApiHomePage,
  ApiHomePageContent,
  ApiHomeSection,
  ApiHomeSectionType,
} from '@/lib/api/types';
import { useHomePageActions } from '@/lib/query/admin';
import { useHomePage } from '@/lib/query/shop';
import { cn } from '@/lib/utils';
import { useStorefrontUrl } from '../adminStore';
import { HeroForm, SectionForm } from './sectionForms';
import {
  ADD_ORDER,
  newSectionId,
  pageProblems,
  SECTION_TYPES,
  sectionSummary,
} from './sectionTypes';
import { useDragSort } from './useDragSort';

const contentOf = (page: ApiHomePage): ApiHomePageContent =>
  structuredClone({ hero: page.hero, sections: page.sections });

// The same page, whatever order its keys come in: Postgres stores the JSON with its keys
// reordered, so a saved page and the one just sent differ only in that.
const canonical = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, field]) => field !== undefined)
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([key, field]) => [key, canonical(field)]),
    );
  }
  return value;
};
const samePage = (a: ApiHomePageContent, b: ApiHomePageContent) =>
  JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));

// What the forms allow while typing but the page doesn't keep: blank lines in card points.
const tidy = (page: ApiHomePageContent): ApiHomePageContent => ({
  ...page,
  sections: page.sections.map((section) =>
    section.type === 'promoCards'
      ? {
          ...section,
          cards: section.cards.map((card) => ({
            ...card,
            points: card.points.map((point) => point.trim()).filter(Boolean),
          })),
        }
      : section,
  ),
});

const iconButton =
  'flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent dark:text-slate-400 dark:hover:bg-white/10';

// A preview that fails to render shows a note instead of taking the editor down with it.
class PreviewBoundary extends Component<
  { resetKey: string; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(previous: { resetKey: string }) {
    if (previous.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }

  render() {
    return this.state.failed ? (
      <p className="px-4 py-10 text-center text-sm text-gray-500 dark:text-slate-400">
        This section can&apos;t be shown yet. Check its content.
      </p>
    ) : (
      this.props.children
    );
  }
}

// A section as shoppers see it. Inert (links, buttons and the cart do nothing here) unless it
// is `interactive`, like the banner carousel: that one can be swiped, paused and stepped
// through, but its links don't open.
const Preview = ({
  resetKey,
  hidden,
  interactive = false,
  children,
}: {
  resetKey: string;
  hidden?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}) => (
  <div className={cn(hidden && 'opacity-45 saturate-50')}>
    <div
      inert={!interactive}
      onClickCapture={
        interactive
          ? (event) => {
              if ((event.target as HTMLElement).closest('a')) event.preventDefault();
            }
          : undefined
      }
      className="peer pb-6 *:mt-6! md:pb-8 md:*:mt-8!"
    >
      <PreviewBoundary resetKey={resetKey}>{children}</PreviewBoundary>
    </div>
    <p className="hidden px-4 py-10 text-center text-sm text-gray-500 peer-empty:block dark:text-slate-400">
      Nothing to show yet. Choose Edit to add its content.
    </p>
  </div>
);

const Toolbar = ({
  icon: Icon,
  label,
  summary,
  hidden,
  children,
  grip,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  summary: string;
  hidden?: boolean;
  children: React.ReactNode;
  grip?: React.ReactNode;
}) => (
  <div className="flex flex-wrap items-center gap-1 border-b border-gray-200/80 bg-white/85 px-2 py-1.5 backdrop-blur dark:border-white/10 dark:bg-slate-900/85">
    {grip}
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-ink">
      <Icon className="size-4" />
    </span>
    <div className="min-w-0 flex-1 basis-40 px-1">
      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-900 dark:text-slate-100">
        {label}
        {hidden && (
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-white/15 dark:text-slate-200">
            Hidden
          </span>
        )}
      </p>
      <p className="truncate text-xs text-gray-500 dark:text-slate-400">{summary}</p>
    </div>
    <div className="flex items-center gap-1">{children}</div>
  </div>
);

const EditButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`Edit ${label}`}
    data-home-edit=""
    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white hover:bg-brand-hover"
  >
    <Pencil className="size-4" aria-hidden="true" />
    Edit
  </button>
);

// The shop's home page as shoppers see it, each section with its controls: drag or the
// arrows to reorder, a switch to hide it, Edit to change it in a side panel.
const HomePageEditor = () => {
  const { data, isPending, error, refetch } = useHomePage();
  const { save, reset } = useHomePageActions();
  const storefrontUrl = useStorefrontUrl();
  const [draft, setDraft] = useState<ApiHomePageContent | null>(null);
  // What the side panel edits: 'hero', a section id, or nothing.
  const [open, setOpen] = useState<string | null>(null);
  const [showProblems, setShowProblems] = useState(false);
  const [previews, setPreviews] = useState(true);

  // Start from what the store has; later refetches don't replace edits in progress.
  useEffect(() => {
    if (data && !draft) setDraft(contentOf(data));
  }, [data, draft]);

  const dirty = useMemo(
    () => Boolean(data && draft) && !samePage(draft!, contentOf(data!)),
    [data, draft],
  );
  const problems = useMemo(() => (draft ? pageProblems(tidy(draft)) : []), [draft]);

  // Leaving the page (closing the tab, reloading) asks first while there are unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const sections = draft?.sections ?? [];
  const setSections = (change: (list: ApiHomeSection[]) => ApiHomeSection[]) =>
    setDraft((current) => current && { ...current, sections: change(current.sections) });
  const moveTo = (from: number, to: number) =>
    setSections((list) => {
      if (to < 0 || to >= list.length) return list;
      const next = [...list];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  const sort = useDragSort(
    sections.map((section) => section.id),
    moveTo,
  );

  if (error && !data) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (isPending || !data || !draft) return <PageLoader label="Loading the home page" />;

  const update = (next: ApiHomeSection) =>
    setSections((list) => list.map((section) => (section.id === next.id ? next : section)));
  const remove = (section: ApiHomeSection) => {
    const label = SECTION_TYPES[section.type].label;
    if (!window.confirm(`Remove this ${label.toLowerCase()} section from the page?`)) return;
    setSections((list) => list.filter((other) => other.id !== section.id));
  };
  const add = (type: ApiHomeSectionType) => {
    const id = newSectionId(type);
    setSections((list) => [...list, SECTION_TYPES[type].create(id)]);
    setOpen(id);
    window.setTimeout(() => {
      document.getElementById(`block-${id}`)?.scrollIntoView({ block: 'center' });
    }, 50);
  };

  const onSave = () => {
    if (problems.length > 0) {
      setShowProblems(true);
      return;
    }
    save.mutate(tidy(draft), {
      onSuccess: (page) => {
        setDraft(contentOf(page));
        setShowProblems(false);
        toast.success('Home page saved');
      },
    });
  };

  const onReset = () => {
    if (
      !window.confirm(
        'Delete your home page and show a blank starter page instead? Your hero photo, banners, texts and every section are removed, and this cannot be undone. To throw away unsaved edits only, use Discard.',
      )
    ) {
      return;
    }
    reset.mutate(undefined, {
      onSuccess: async () => {
        const result = await refetch();
        if (result.data) setDraft(contentOf(result.data));
        setOpen(null);
        toast.success('Your shop now shows the starter page');
      },
    });
  };

  const editing = open === 'hero' ? null : sections.find((section) => section.id === open);
  const editingMeta = editing ? SECTION_TYPES[editing.type] : null;

  const addMenu = (align: 'start' | 'end') => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={sections.length >= 30}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add section
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-80 max-w-[calc(100vw-2rem)]">
        {ADD_ORDER.map((type) => {
          const { icon: Icon, label, description } = SECTION_TYPES[type];
          return (
            <DropdownMenuItem
              key={type}
              onSelect={() => add(type)}
              className="cursor-pointer items-start gap-3 py-2"
            >
              <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
              <span>
                <span className="block font-medium">{label}</span>
                <span className="block text-xs text-gray-500 dark:text-slate-400">
                  {description}
                </span>
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div>
      <PageHeading
        title="Home page"
        desc="Your shop's home page as shoppers see it. Edit, hide or drag any section, then save."
        action={
          <div className="flex flex-wrap gap-2">
            <a
              href={storefrontUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              View home page
            </a>
            {addMenu('end')}
          </div>
        }
      />

      {!data.customised && (
        <p className="mb-4 rounded-xl border border-sun/60 bg-sun-soft/80 px-4 py-3 text-sm text-sun-ink">
          Your shop shows a blank starter page. Change anything and save to make it your own.
        </p>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600 dark:text-slate-400">
          The hero stays at the top. Drag a section by its handle to change the order.
        </p>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
          <Switch checked={previews} onCheckedChange={setPreviews} />
          Show previews
        </label>
      </div>

      {/* The hero: always first, so it has no grip or switch. */}
      <div
        className={cn(
          'overflow-hidden rounded-2xl ring-1 ring-gray-200 dark:ring-white/10',
          open === 'hero' && 'ring-2 ring-brand',
        )}
      >
        <Toolbar icon={PanelTop} label="Hero" summary="Always at the top of the page">
          <EditButton label="hero" onClick={() => setOpen('hero')} />
        </Toolbar>
        {previews && (
          <div inert>
            <PreviewBoundary resetKey={JSON.stringify(draft.hero)}>
              <Hero hero={draft.hero} preview />
            </PreviewBoundary>
          </div>
        )}
      </div>

      {sections.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-600 dark:border-white/15 dark:bg-slate-900 dark:text-slate-400">
          Only the hero is on the page. Add a section to show products, offers and more.
        </div>
      ) : (
        <ol className={cn('mt-3 space-y-3', sort.draggingId && 'select-none')}>
          {sections.map((section, index) => {
            const meta = SECTION_TYPES[section.type];
            const name = `${meta.label}, section ${index + 1}`;
            const dragging = sort.draggingId === section.id;
            return (
              <li
                key={section.id}
                id={`block-${section.id}`}
                ref={sort.rowRef(section.id)}
                style={sort.rowStyle(section.id, index)}
                className={cn(
                  'scroll-mt-24 overflow-hidden rounded-2xl bg-white/30 ring-1 ring-gray-200 dark:bg-slate-900/30 dark:ring-white/10',
                  sort.draggingId && !dragging && 'transition-transform duration-200! ease-out',
                  dragging && 'bg-white shadow-lift ring-2 ring-brand/50 dark:bg-slate-900',
                  open === section.id && 'ring-2 ring-brand',
                )}
              >
                <Toolbar
                  icon={meta.icon}
                  label={meta.label}
                  summary={sectionSummary(section)}
                  hidden={!section.visible}
                  grip={
                    <button
                      type="button"
                      {...sort.gripProps(section.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                          event.preventDefault();
                          moveTo(index, index + (event.key === 'ArrowUp' ? -1 : 1));
                        }
                      }}
                      aria-label={`Drag ${name} to move it, or use the arrow keys`}
                      className={cn(
                        iconButton,
                        'touch-none',
                        dragging ? 'cursor-grabbing' : 'cursor-grab',
                      )}
                    >
                      <GripVertical className="size-5" />
                    </button>
                  }
                >
                  <label className="flex items-center gap-2 px-1 text-sm text-gray-600 dark:text-slate-400">
                    <Switch
                      checked={section.visible}
                      aria-label={`Show ${name}`}
                      onCheckedChange={(visible) => update({ ...section, visible })}
                    />
                    Shown
                  </label>
                  <EditButton label={name} onClick={() => setOpen(section.id)} />
                  <button
                    type="button"
                    onClick={() => remove(section)}
                    aria-label={`Remove ${name}`}
                    className={cn(iconButton, 'hover:bg-red/10 hover:text-red')}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </Toolbar>
                {previews && (
                  <Preview
                    resetKey={JSON.stringify(section)}
                    hidden={!section.visible}
                    interactive={section.type === 'banners'}
                  >
                    <HomeSection section={section} />
                  </Preview>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {addMenu('start')}
        {data.customised && (
          <button
            type="button"
            onClick={onReset}
            disabled={reset.isPending}
            className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-red/10 hover:text-red disabled:opacity-60 dark:text-slate-400"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Delete and start from a blank page
          </button>
        )}
      </div>

      <div className="sticky bottom-3 z-30 mt-6 rounded-2xl glass px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p
            className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300"
            aria-live="polite"
          >
            <span
              className={cn('size-2 rounded-full', dirty ? 'bg-sun' : 'bg-green')}
              aria-hidden="true"
            />
            {dirty ? 'Unsaved changes' : 'All changes saved'}
          </p>
          <div className="flex items-center gap-2">
            {dirty && (
              <button
                type="button"
                onClick={() => {
                  setDraft(contentOf(data));
                  setShowProblems(false);
                }}
                className="h-10 rounded-full px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-white/80 dark:text-slate-300 dark:hover:bg-slate-900/80"
              >
                Discard
              </button>
            )}
            <button
              type="button"
              onClick={onSave}
              disabled={!dirty || save.isPending}
              className="h-10 rounded-full bg-brand px-5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {save.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
        {showProblems && problems.length > 0 && (
          <div role="alert" className="mt-3 text-sm text-red">
            <p className="font-medium">Fix these before saving:</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {problems.slice(0, 6).map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
              {problems.length > 6 && <li>and {problems.length - 6} more</li>}
            </ul>
          </div>
        )}
      </div>

      {/* The form for the section being edited; the page behind updates as you type. Not
          modal: a modal panel locks page scrolling, which hides the scrollbar and makes the page
          jump sideways; this way the page also stays scrollable while editing. */}
      <Sheet modal={false} open={open !== null} onOpenChange={(next) => !next && setOpen(null)}>
        <SheetContent
          side="right"
          // Another section's Edit button switches the panel to it instead of closing it.
          onInteractOutside={(event) => {
            if ((event.target as HTMLElement | null)?.closest('[data-home-edit]')) {
              event.preventDefault();
            }
          }}
          // Slides in from the right and back out; the ! durations keep the slide when the OS
          // asks for reduced motion, like the seller centre's menu.
          // Only the middle scrolls: the title and its close button stay at the top and Done
          // at the bottom, clear of a phone's home bar. h-dvh: the height a phone shows.
          className="h-dvh w-full gap-0 p-0 sm:max-w-md data-[state=closed]:[animation-duration:260ms]! data-[state=open]:[animation-duration:420ms]!"
        >
          <div className="shrink-0 border-b border-gray-200 px-5 py-4 pr-14 dark:border-white/10">
            <SheetTitle>
              {open === 'hero' ? 'Edit the hero' : `Edit ${editingMeta?.label ?? ''}`}
            </SheetTitle>
            <SheetDescription className="mt-1 text-sm text-gray-600 dark:text-slate-400">
              {open === 'hero' ? 'The first thing shoppers see.' : editingMeta?.description} The
              page updates as you type; save when you&apos;re done.
            </SheetDescription>
          </div>
          <div className="scrollbar-modern min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
            {open === 'hero' && (
              <HeroForm hero={draft.hero} onChange={(hero) => setDraft({ ...draft, hero })} />
            )}
            {editing && <SectionForm section={editing} onChange={update} />}
          </div>
          <div className="shrink-0 border-t border-gray-200 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] dark:border-white/10">
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="h-10 w-full rounded-full bg-brand text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Done
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HomePageEditor;
