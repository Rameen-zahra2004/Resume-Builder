"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* ===================== TYPES ===================== */

export type ToastVariant = "default" | "destructive" | "success" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface Toast extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;

  // Shortcut methods
  success: (options: Omit<ToastOptions, "variant">) => void;
  error: (options: Omit<ToastOptions, "variant">) => void;
  info: (options: Omit<ToastOptions, "variant">) => void;
}

/* ===================== CONTEXT ===================== */

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/* ===================== PROVIDER ===================== */

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  /* ------------------- DISMISS ------------------- */
  const dismiss = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) clearTimeout(timeout);

    timeoutsRef.current.delete(id);
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /* ------------------- TOAST ------------------- */
  const toast = useCallback(
    (options: ToastOptions) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);

      const duration = options.duration ?? 4000;

      const newToast: Toast = {
        id,
        variant: "default",
        ...options,
      };

      setToasts((prev) => [...prev, newToast]);

      const timeout = setTimeout(() => {
        dismiss(id);
      }, duration);

      timeoutsRef.current.set(id, timeout);
    },
    [dismiss]
  );

  /* ------------------- SHORTCUTS ------------------- */
  const success = useCallback(
    (options: Omit<ToastOptions, "variant">) =>
      toast({ ...options, variant: "success" }),
    [toast]
  );

  const error = useCallback(
    (options: Omit<ToastOptions, "variant">) =>
      toast({ ...options, variant: "destructive" }),
    [toast]
  );

  const info = useCallback(
    (options: Omit<ToastOptions, "variant">) =>
      toast({ ...options, variant: "info" }),
    [toast]
  );

  /* ------------------- CLEANUP ON UNMOUNT ------------------- */
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach(clearTimeout);
      timeouts.clear();
    };
  }, []);

  return (
    <ToastContext.Provider
      value={{ toasts, toast, dismiss, success, error, info }}
    >
      {children}
      <ToastViewport toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/* ===================== HOOK ===================== */

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}

/* ===================== VIEWPORT ===================== */

function ToastViewport({
  toasts,
  dismiss,
}: {
  toasts: Toast[];
  dismiss: (id: string) => void;
}) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-3"
      role="region"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        let bgClass = "border-gray-200 bg-white text-gray-900";
        if (toast.variant === "destructive")
          bgClass = "border-red-500 bg-red-50 text-red-900";
        else if (toast.variant === "success")
          bgClass = "border-green-500 bg-green-50 text-green-900";
        else if (toast.variant === "info")
          bgClass = "border-blue-500 bg-blue-50 text-blue-900";

        return (
          <div
            key={toast.id}
            role="alert"
            className={`w-80 rounded-lg border p-4 shadow-lg transition-all ${bgClass}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold leading-none">{toast.title}</h4>
                {toast.description && (
                  <p className="mt-1 text-sm opacity-90">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="text-sm opacity-60 hover:opacity-100 focus:outline-none"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
