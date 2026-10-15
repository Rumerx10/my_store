'use client';

// Custom dropdown menu with the shadcn API used across the app. Unlike the Radix version it
// doesn't lock page scrolling, so the scrollbar never disappears and the page doesn't shift.
import * as React from 'react';
import { createPortal } from 'react-dom';
import { Slot } from '@radix-ui/react-slot';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getPortalContainer,
  moveFocus,
  useDismiss,
  useFloatingPosition,
  type FloatingAlign,
} from './floating';

const ITEM_SELECTOR = '[role="menuitem"], [role="menuitemcheckbox"]';

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  menuId: string;
  // Focus the first item when the menu was opened from the keyboard.
  focusFirst: React.RefObject<boolean>;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);

const useMenu = () => {
  const context = React.useContext(MenuContext);
  if (!context) throw new Error('Dropdown menu parts must be inside <DropdownMenu>');
  return context;
};

function DropdownMenu({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Accepted for compatibility with the Radix API; the menu never locks scrolling.
  modal?: boolean;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const focusFirst = React.useRef(false);
  const menuId = React.useId();

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <MenuContext.Provider value={{ open, setOpen, triggerRef, contentRef, menuId, focusFirst }}>
      {children}
    </MenuContext.Provider>
  );
}

function DropdownMenuTrigger({
  asChild,
  onClick,
  onKeyDown,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const { open, setOpen, triggerRef, menuId, focusFirst } = useMenu();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={triggerRef}
      type={asChild ? undefined : 'button'}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? menuId : undefined}
      data-state={open ? 'open' : 'closed'}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        focusFirst.current = event.detail === 0; // keyboard "click" has no pointer detail
        setOpen(!open);
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          focusFirst.current = true;
          setOpen(true);
        }
      }}
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  align = 'start',
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<'div'> & { align?: FloatingAlign; sideOffset?: number }) {
  const { open, setOpen, triggerRef, contentRef, menuId, focusFirst } = useMenu();
  const position = useFloatingPosition(open, triggerRef, contentRef, { align, offset: sideOffset });
  const refs = React.useMemo(() => [triggerRef, contentRef], [triggerRef, contentRef]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);
  useDismiss(open, refs, close);

  React.useEffect(() => {
    if (open && position && focusFirst.current) {
      focusFirst.current = false;
      moveFocus(contentRef.current, ITEM_SELECTOR, 'Home');
    }
  }, [open, position, focusFirst, contentRef]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={contentRef}
      id={menuId}
      role="menu"
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape' || event.key === 'Tab') {
          if (event.key === 'Escape') event.preventDefault();
          setOpen(false);
          if (event.key === 'Escape') triggerRef.current?.focus();
        } else if (moveFocus(contentRef.current, ITEM_SELECTOR, event.key)) {
          event.preventDefault();
        }
      }}
      style={{
        position: 'fixed',
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? 'visible' : 'hidden',
      }}
      className={cn(
        'floating-panel z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>,
    getPortalContainer(triggerRef.current),
  );
}

const itemClass =
  'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

function DropdownMenuItem({
  className,
  asChild,
  disabled,
  onSelect,
  onClick,
  children,
  ...props
}: Omit<React.ComponentProps<'button'>, 'onSelect'> & {
  asChild?: boolean;
  onSelect?: (event: Event) => void;
}) {
  const { setOpen, triggerRef } = useMenu();
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      role="menuitem"
      type={asChild ? undefined : 'button'}
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        onClick?.(event);
        onSelect?.(event.nativeEvent);
        setOpen(false);
        if (event.detail === 0) triggerRef.current?.focus();
      }}
      className={cn(itemClass, className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

// Toggles without closing, so several columns can be switched in one go.
function DropdownMenuCheckboxItem({
  className,
  checked,
  onCheckedChange,
  children,
  ...props
}: Omit<React.ComponentProps<'button'>, 'onChange'> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={Boolean(checked)}
      tabIndex={-1}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(itemClass, 'pl-8', className)}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        {checked && <Check className="size-4" />}
      </span>
      {children}
    </button>
  );
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('px-2 py-1.5 text-sm font-semibold', className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<'div'>) {
  return <div role="separator" className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
};
