'use client';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

export type FloatingAlign = 'start' | 'center' | 'end';

interface Position {
  top: number;
  left: number;
  minWidth?: number;
}

// Places a fixed-position panel next to its trigger, flipping above it when there isn't
// room below. Unlike Radix menus it never locks page scrolling, so the scrollbar stays put;
// the panel follows the trigger while the page scrolls.
export function useFloatingPosition(
  open: boolean,
  triggerRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>,
  {
    align = 'start',
    offset = 6,
    matchWidth = false,
  }: { align?: FloatingAlign; offset?: number; matchWidth?: boolean } = {},
) {
  const [position, setPosition] = useState<Position | null>(null);

  const update = useCallback(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;
    if (!trigger || !content) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.max(content.offsetWidth, matchWidth ? rect.width : 0);
    const height = content.offsetHeight;
    const margin = 8;

    let left =
      align === 'end'
        ? rect.right - width
        : align === 'center'
          ? rect.left + (rect.width - width) / 2
          : rect.left;
    left = Math.min(Math.max(margin, left), window.innerWidth - width - margin);

    // Inside a dialog the panel is rendered in the dialog, whose transform makes it the
    // reference box for position: fixed, so convert to its coordinates.
    const container = getPortalContainer(trigger);
    const origin =
      container === document.body ? { top: 0, left: 0 } : container.getBoundingClientRect();

    const below = rect.bottom + offset;
    const fitsBelow = below + height <= window.innerHeight - margin;
    const fitsAbove = rect.top - offset - height >= margin;
    const top = !fitsBelow && fitsAbove ? rect.top - offset - height : below;

    setPosition({
      top: top - origin.top,
      left: left - origin.left,
      minWidth: matchWidth ? rect.width : undefined,
    });
  }, [align, offset, matchWidth, triggerRef, contentRef]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    update();
  }, [open, update]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, update]);

  return position;
}

// Panels open from inside a dialog render in that dialog, so its focus trap and
// click-outside handling treat them as part of the dialog.
export const getPortalContainer = (trigger: HTMLElement | null): HTMLElement =>
  trigger?.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]') ?? document.body;

// Closes a floating panel on a pointer press outside both the trigger and the panel.
export function useDismiss(
  open: boolean,
  refs: React.RefObject<HTMLElement | null>[],
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      onDismiss();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, refs, onDismiss]);
}

// Arrow-key focus movement inside a list of items.
export function moveFocus(container: HTMLElement | null, selector: string, key: string) {
  if (!container) return false;
  const items = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (item) => !item.hasAttribute('data-disabled'),
  );
  if (items.length === 0) return false;
  const index = items.indexOf(document.activeElement as HTMLElement);
  const next =
    key === 'ArrowDown'
      ? items[(index + 1) % items.length]
      : key === 'ArrowUp'
        ? items[(index - 1 + items.length) % items.length]
        : key === 'Home'
          ? items[0]
          : key === 'End'
            ? items[items.length - 1]
            : null;
  if (!next) return false;
  next.focus();
  return true;
}
