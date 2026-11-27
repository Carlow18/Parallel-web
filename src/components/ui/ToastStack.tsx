"use client";

import { AlertTriangle, CheckCircle2, X, XCircle } from "lucide-react";
import type { ToastMessage } from "@/hooks/useVideoBoard";

interface ToastStackProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[var(--z-toast)] flex max-w-[380px] flex-col gap-2"
    >
      {toasts.map((toast) => {
        const toneStyles =
          toast.tone === "success"
            ? "border-[var(--color-signal-green)] bg-[var(--color-signal-green-wash)] text-[var(--color-signal-green)]"
            : toast.tone === "warning"
              ? "border-[var(--color-tape-amber)] bg-[var(--color-tape-amber-wash)] text-[var(--color-tape-amber)]"
              : "border-[var(--color-tally-red-deep)] bg-[var(--color-tally-red-wash)] text-[var(--color-tally-red-deep)]";

        const Icon =
          toast.tone === "success"
            ? CheckCircle2
            : toast.tone === "warning"
              ? AlertTriangle
              : XCircle;

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-2.5 rounded-[var(--radius-card)] border px-3.5 py-2.5 text-[13px] font-semibold shadow-[var(--shadow-drawer)] ${toneStyles}`}
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="flex-1 leading-[1.4]">{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="rounded p-0.5 opacity-75 hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
