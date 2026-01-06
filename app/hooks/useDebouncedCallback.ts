
"use client";

import { useRef, useCallback } from "react";

type AnyFunction = (...args: unknown[]) => void;

export function useDebouncedCallback<T extends AnyFunction>(
  callback: T,
  delay = 1000
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
