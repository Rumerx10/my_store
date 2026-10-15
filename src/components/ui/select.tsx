'use client';

// Custom select (listbox) with the shadcn API used across the app. Unlike the Radix version
// it doesn't lock page scrolling, so the scrollbar never disappears and the page doesn't shift.
import * as React from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPortalContainer, moveFocus, useDismiss, useFloatingPosition } from './floating';

const OPTION_SELECTOR = '[role="option"]';

interface SelectContextValue {
  value: string | undefined;
  select: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  labels: Map<string, React.ReactNode>;
  disabled: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  listboxId: string;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error('Select parts must be inside <Select>');
  return context;
};

// Reads value → label from the <SelectItem> elements, so the trigger can show the chosen
// label while the list is closed.
const collectLabels = (children: React.ReactNode, labels = new Map<string, React.ReactNode>()) => {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<{ value?: string; children?: React.ReactNode }>(child)) return;
    if (child.type === SelectItem && child.props.value !== undefined) {
      labels.set(child.props.value, child.props.children);
    } else if (child.props.children) {
      collectLabels(child.props.children, labels);
    }
  });
  return labels;
};

function Select({
  value: controlledValue,
  defaultValue,
  onValueChange,
  disabled = false,
  children,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const listboxId = React.useId();
  const labels = collectLabels(children);

  const select = React.useCallback(
    (next: string) => {
      if (controlledValue === undefined) setUncontrolledValue(next);
      onValueChange?.(next);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [controlledValue, onValueChange],
  );

  return (
    <SelectContext.Provider
      value={{ value, select, open, setOpen, labels, disabled, triggerRef, contentRef, listboxId }}
    >
      {children}
    </SelectContext.Provider>
  );
}

function SelectTrigger({
  className,
  children,
  ref,
  onClick,
  onKeyDown,
  disabled: disabledProp,
  ...props
}: React.ComponentProps<'button'>) {
  const { open, setOpen, disabled, triggerRef, listboxId } = useSelect();

  // Share the element with the caller's ref (react-hook-form focuses it on errors).
  const setRef = (node: HTMLButtonElement | null) => {
    triggerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <button
      ref={setRef}
      type="button"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listboxId : undefined}
      disabled={disabled || disabledProp}
      data-state={open ? 'open' : 'closed'}
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key) && !open) {
          event.preventDefault();
          setOpen(true);
        }
      }}
      className={cn(
        'flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-left text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn('size-4 shrink-0 opacity-50 transition-transform', open && 'rotate-180')}
        aria-hidden="true"
      />
    </button>
  );
}

function SelectValue({ placeholder }: { placeholder?: React.ReactNode }) {
  const { value, labels } = useSelect();
  const label = value !== undefined ? labels.get(value) : undefined;
  return label !== undefined ? (
    <span>{label}</span>
  ) : (
    <span className="text-muted-foreground">{placeholder}</span>
  );
}

function SelectContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, setOpen, triggerRef, contentRef, listboxId } = useSelect();
  const position = useFloatingPosition(open, triggerRef, contentRef, {
    matchWidth: true,
    offset: 4,
  });
  const refs = React.useMemo(() => [triggerRef, contentRef], [triggerRef, contentRef]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);
  useDismiss(open, refs, close);

  // Focus the chosen option (or the first) once the list is placed.
  React.useEffect(() => {
    if (!open || !position) return;
    const list = contentRef.current;
    const selected = list?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]');
    if (selected) selected.focus({ preventScroll: false });
    else moveFocus(list, OPTION_SELECTOR, 'Home');
  }, [open, position, contentRef]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={contentRef}
      id={listboxId}
      role="listbox"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        } else if (event.key === 'Tab') {
          setOpen(false);
        } else if (moveFocus(contentRef.current, OPTION_SELECTOR, event.key)) {
          event.preventDefault();
        }
      }}
      style={{
        position: 'fixed',
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        minWidth: position?.minWidth,
        visibility: position ? 'visible' : 'hidden',
      }}
      className={cn(
        'floating-panel z-50 max-h-72 min-w-[8rem] overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none',
        className,
      )}
    >
      {children}
    </div>,
    getPortalContainer(triggerRef.current),
  );
}

function SelectItem({
  value,
  className,
  children,
  disabled,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { value: selected, select } = useSelect();
  const isSelected = selected === value;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      tabIndex={-1}
      onClick={() => !disabled && select(value)}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault();
          select(value);
        }
      }}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        {isSelected && <Check className="size-4" />}
      </span>
      {children}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
