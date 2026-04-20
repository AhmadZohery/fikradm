import { useCallback, useRef, useState } from "react";

/**
 * Lightweight undo/redo stack. Stores up to `limit` snapshots.
 * Pushing a new value clears the redo stack (standard editor semantics).
 */
export function useUndoRedo<T>(initial: T, limit = 50) {
  const [present, setPresent] = useState<T>(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);
  const [, force] = useState(0);
  const tick = () => force((n) => n + 1);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setPresent((prev) => {
        const value = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (Object.is(value, prev)) return prev;
        past.current.push(prev);
        if (past.current.length > limit) past.current.shift();
        future.current = [];
        tick();
        return value;
      });
    },
    [limit],
  );

  const reset = useCallback((value: T) => {
    past.current = [];
    future.current = [];
    setPresent(value);
    tick();
  }, []);

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    setPresent((curr) => {
      const prev = past.current.pop()!;
      future.current.push(curr);
      tick();
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    setPresent((curr) => {
      const next = future.current.pop()!;
      past.current.push(curr);
      tick();
      return next;
    });
  }, []);

  return {
    state: present,
    set,
    reset,
    undo,
    redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}
