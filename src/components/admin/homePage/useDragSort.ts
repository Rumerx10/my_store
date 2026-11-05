'use client';
import { useEffect, useRef, useState } from 'react';

interface Drag {
  id: string;
  from: number;
  to: number;
  // How far the row has moved since it was picked up.
  dy: number;
  // How far a passed row slides: the dragged row's height plus the gap.
  shift: number;
}

const EDGE = 80;

// Drag and drop for a vertical list, with pointer events so it works with a mouse, a finger or
// a pen. The picked-up row follows the pointer, the rows it passes slide out of the way, and
// letting go moves it there. Held near the top or bottom of the window, the page scrolls.
// Rows register with `rowRef`; the grip spreads `gripProps`.
export const useDragSort = (ids: string[], onMove: (from: number, to: number) => void) => {
  const [drag, setDrag] = useState<Drag | null>(null);
  const current = useRef<Drag | null>(null);
  const start = useRef<{ pageY: number; mids: number[]; pointerId: number } | null>(null);
  const pointerY = useRef(0);
  const frame = useRef(0);
  const rows = useRef(new Map<string, HTMLElement>());

  const update = (next: Drag | null) => {
    current.current = next;
    setDrag(next);
  };

  // Where the row is now, from the pointer and the scroll position.
  const follow = () => {
    const origin = start.current;
    const active = current.current;
    if (!origin || !active) return;
    const pointer = pointerY.current + window.scrollY;
    const dy = pointer - origin.pageY;
    // The new place follows the pointer (the grip), not the row's middle, which on a tall
    // preview is far below it: after every other row whose middle the pointer has passed.
    const to = origin.mids.filter((mid, i) => i !== active.from && mid < pointer).length;
    if (dy !== active.dy || to !== active.to) update({ ...active, dy, to });
  };

  const autoScroll = () => {
    if (!start.current) return;
    const y = pointerY.current;
    const speed =
      y < EDGE
        ? -Math.ceil((EDGE - y) / 3)
        : y > window.innerHeight - EDGE
          ? Math.ceil((y - window.innerHeight + EDGE) / 3)
          : 0;
    if (speed !== 0) {
      window.scrollBy(0, speed);
      follow();
    }
    frame.current = requestAnimationFrame(autoScroll);
  };

  const finish = (commit: boolean) => {
    const done = current.current;
    start.current = null;
    cancelAnimationFrame(frame.current);
    update(null);
    if (commit && done && done.to !== done.from) onMove(done.from, done.to);
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const rowRef = (id: string) => (node: HTMLElement | null) => {
    if (node) rows.current.set(id, node);
    else rows.current.delete(id);
  };

  const gripProps = (id: string) => ({
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      const from = ids.indexOf(id);
      const rects = ids.map((other) => rows.current.get(other)?.getBoundingClientRect());
      if (from < 0 || rects.some((rect) => !rect)) return;
      const boxes = rects as DOMRect[];
      const gap = boxes.length > 1 ? Math.max(0, boxes[1].top - boxes[0].bottom) : 0;
      start.current = {
        pageY: event.clientY + window.scrollY,
        // Centres in page coordinates, so scrolling while dragging keeps them right.
        mids: boxes.map((rect) => rect.top + window.scrollY + rect.height / 2),
        pointerId: event.pointerId,
      };
      pointerY.current = event.clientY;
      try {
        // Keeps the moves coming to the grip even when the pointer leaves it.
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // The pointer is already gone (released before this ran); the drag still works.
      }
      event.preventDefault();
      update({ id, from, to: from, dy: 0, shift: boxes[from].height + gap });
      frame.current = requestAnimationFrame(autoScroll);
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      if (!start.current || event.pointerId !== start.current.pointerId) return;
      pointerY.current = event.clientY;
      follow();
    },
    onPointerUp: () => finish(true),
    onPointerCancel: () => finish(false),
    onLostPointerCapture: () => {
      if (start.current) finish(true);
    },
  });

  // Where each row sits while something is being dragged.
  const rowStyle = (id: string, index: number): React.CSSProperties | undefined => {
    if (!drag) return undefined;
    if (id === drag.id) {
      return { transform: `translateY(${drag.dy}px)`, zIndex: 20, position: 'relative' };
    }
    const { from, to, shift } = drag;
    if (from < to && index > from && index <= to) return { transform: `translateY(${-shift}px)` };
    if (from > to && index >= to && index < from) return { transform: `translateY(${shift}px)` };
    return { transform: 'translateY(0)' };
  };

  return { draggingId: drag?.id ?? null, rowRef, gripProps, rowStyle };
};
