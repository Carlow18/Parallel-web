"use client";

import type { CategoryOption } from "@/hooks/useVideoBoard";

interface CategoryFilterBarProps {
  categories: CategoryOption[];
  activeFilter: string;
  onSelect: (key: string) => void;
}

export function CategoryFilterBar({
  categories,
  activeFilter,
  onSelect,
}: CategoryFilterBarProps) {
  return (
    <nav
      aria-label="Category filter"
      className="sticky top-[56px] z-[var(--z-sticky)] border-b border-[var(--color-hairline-border)] bg-[rgba(246,245,242,0.92)] backdrop-blur-[10px]"
    >
      <div className="mx-auto flex h-[48px] max-w-[1600px] items-center justify-between gap-4 px-4 md:px-6">
        <div className="relative min-w-0 flex-1">
          <div
            role="radiogroup"
            aria-label="Filter clips by category"
            className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 pr-8"
          >
            {categories.map((cat) => {
              const selected = activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelect(cat.key)}
                  className={`inline-flex h-[34px] shrink-0 cursor-pointer items-center gap-2 rounded-full px-3.5 text-[14px] font-semibold leading-none tracking-[-0.005em] transition-colors duration-150 ${
                    selected
                      ? "bg-[var(--color-carbon-ink)] text-[var(--color-surface-card)]"
                      : "bg-[var(--color-surface-well)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-well-hover)] hover:text-[var(--color-carbon-ink)]"
                  }`}
                >
                  {selected && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[var(--color-tally-red)]"
                    />
                  )}
                  <span>{cat.label}</span>
                  <span
                    className={`tabular-mono text-[12px] ${
                      selected
                        ? "text-[var(--color-screening-muted)]"
                        : "text-[var(--color-ink-muted)]"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[rgba(246,245,242,0.96)] to-transparent"
          />
        </div>

        <p className="tabular-mono hidden shrink-0 text-[12px] font-medium text-[var(--color-ink-muted)] md:block">
          Hover 2× · Click 1×
        </p>
      </div>
    </nav>
  );
}
