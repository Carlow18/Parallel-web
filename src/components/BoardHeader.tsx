"use client";

import { useEffect, useRef, useState } from "react";
import { Download, MoreHorizontal, Plus, Sparkles, Trash2, Upload } from "lucide-react";

interface BoardHeaderProps {
  totalCount: number;
  filteredCount: number;
  isFiltered: boolean;
  isScanning: boolean;
  onOpenAdd: () => void;
  onOpenImport: () => void;
  onExportJson: () => void;
  onLoadSamples: () => void;
  onClearBoard: () => void;
}

export function BoardHeader({
  totalCount,
  filteredCount,
  isFiltered,
  isScanning,
  onOpenAdd,
  onOpenImport,
  onExportJson,
  onLoadSamples,
  onClearBoard,
}: BoardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      setConfirmClear(false);
      return;
    }
    const handlePointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const countDisplay = isFiltered ? `${filteredCount} / ${totalCount}` : `${totalCount}`;

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-[var(--color-hairline-border)] bg-[rgba(246,245,242,0.92)] backdrop-blur-[10px]">
      <div className="mx-auto flex h-[56px] max-w-[1600px] items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect x="3" y="3" width="4" height="14" rx="1.5" fill="#111113" />
              <rect x="9.5" y="3" width="4" height="14" rx="1.5" fill="#111113" />
              <circle
                cx="16.5"
                cy="5.5"
                r="2.25"
                fill={isScanning ? "#D91E18" : "#DCD9D0"}
              />
            </svg>
            <span className="font-display text-[1.125rem] font-bold tracking-[-0.015em] text-[var(--color-carbon-ink)]">
              Parallel
            </span>
          </div>

          <span
            className="tabular-mono inline-flex items-center rounded-[var(--radius-badge)] border border-[var(--color-hairline-border)] bg-[var(--color-surface-well)] px-2 py-1 text-[12px] font-semibold text-[var(--color-ink-secondary)]"
            aria-label={`${filteredCount} of ${totalCount} clips shown`}
          >
            {countDisplay} {totalCount === 1 ? "clip" : "clips"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <button
              type="button"
              onClick={onOpenImport}
              className="btn-ghost h-9 px-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-carbon-ink)]"
            >
              <Upload className="h-4 w-4" aria-hidden="true" />
              <span>Import</span>
            </button>
            <button
              type="button"
              onClick={onExportJson}
              disabled={totalCount === 0}
              className="btn-ghost h-9 px-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-carbon-ink)]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Export</span>
            </button>
          </div>

          <div ref={menuRef} className="relative sm:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Board actions"
              aria-expanded={menuOpen}
              className="btn-ghost h-[44px] w-[44px] border border-[var(--color-hairline-border)] bg-[var(--color-surface-card)]"
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[50px] z-[var(--z-popover)] w-52 rounded-[var(--radius-card)] border border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] p-1.5 shadow-[var(--shadow-drawer)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenImport();
                  }}
                  className="flex min-h-[40px] w-full items-center gap-2.5 rounded-[var(--radius-control)] px-3 text-left text-[14px] font-medium text-[var(--color-carbon-ink)] hover:bg-[var(--color-surface-well)]"
                >
                  <Upload className="h-4 w-4 text-[var(--color-ink-secondary)]" />
                  <span>Import JSON</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  disabled={totalCount === 0}
                  onClick={() => {
                    setMenuOpen(false);
                    onExportJson();
                  }}
                  className="flex min-h-[40px] w-full items-center gap-2.5 rounded-[var(--radius-control)] px-3 text-left text-[14px] font-medium text-[var(--color-carbon-ink)] hover:bg-[var(--color-surface-well)] disabled:opacity-40"
                >
                  <Download className="h-4 w-4 text-[var(--color-ink-secondary)]" />
                  <span>Export JSON</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onLoadSamples();
                  }}
                  className="flex min-h-[40px] w-full items-center gap-2.5 rounded-[var(--radius-control)] px-3 text-left text-[14px] font-medium text-[var(--color-carbon-ink)] hover:bg-[var(--color-surface-well)]"
                >
                  <Sparkles className="h-4 w-4 text-[var(--color-ink-secondary)]" />
                  <span>Load sample clips</span>
                </button>
                {totalCount > 0 && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      if (!confirmClear) {
                        setConfirmClear(true);
                        return;
                      }
                      setMenuOpen(false);
                      onClearBoard();
                    }}
                    className="mt-1 flex min-h-[40px] w-full items-center gap-2.5 rounded-[var(--radius-control)] border-t border-[var(--color-hairline-border)] px-3 pt-1 text-left text-[14px] font-medium text-[var(--color-tally-red-deep)] hover:bg-[var(--color-tally-red-wash)]"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{confirmClear ? "Tap again to clear" : "Clear board"}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenAdd}
            className="btn-primary h-[44px] px-4 sm:h-[40px] sm:px-[18px]"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">Add</span>
            <span className="hidden sm:inline">Add Clips</span>
          </button>
        </div>
      </div>
    </header>
  );
}
