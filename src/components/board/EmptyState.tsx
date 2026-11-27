"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Film, Plus, RotateCcw, Sparkles, Upload } from "lucide-react";
import { SAMPLE_COUNT } from "@/lib/samples";
import { parseBulkInput, type VideoItem } from "@/lib/schema";

interface EmptyBoardProps {
  mode: "empty-board";
  onAddItems: (items: VideoItem[], duplicateCount: number) => void;
  onLoadSamples: () => void;
  onOpenImport: () => void;
}

interface EmptyFilterProps {
  mode: "empty-filter";
  filterLabel: string;
  onResetFilter: () => void;
}

type EmptyStateProps = EmptyBoardProps | EmptyFilterProps;

export function EmptyState(props: EmptyStateProps) {
  const [rawText, setRawText] = useState("");
  const [category, setCategory] = useState("");

  const preview = useMemo(() => {
    if (props.mode !== "empty-board" || !rawText.trim()) return null;
    return parseBulkInput(rawText, category);
  }, [props.mode, rawText, category]);

  if (props.mode === "empty-filter") {
    return (
      <section className="mx-auto my-12 max-w-[480px] rounded-[var(--radius-modal)] border border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] p-6 text-center md:p-8">
        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-well)] text-[var(--color-ink-secondary)]">
          <Film className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 className="font-display text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--color-carbon-ink)]">
          No clips in {props.filterLabel}
        </h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-[var(--color-ink-secondary)]">
          There are no video links tagged with this category right now.
        </p>
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={props.onResetFilter}
            className="btn-secondary h-10 px-4"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Show All Clips</span>
          </button>
        </div>
      </section>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || preview.validItems.length === 0) return;
    props.onAddItems(preview.validItems, preview.duplicateCount);
    setRawText("");
  };

  return (
    <section className="mx-auto my-6 max-w-[720px] rounded-[var(--radius-modal)] border border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] p-6 md:my-12 md:p-8">
      <h1 className="font-display text-[clamp(2rem,3.2vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--color-carbon-ink)]">
        Your 2× video light table
      </h1>
      <p className="mt-3 max-w-[62ch] text-[15px] leading-[1.55] text-[var(--color-ink-secondary)]">
        Paste direct <span className="tabular-mono text-[13px]">.mp4</span> or{" "}
        <span className="tabular-mono text-[13px]">.webm</span> URLs to build a local reference board. Hover any tile to scan at{" "}
        <span className="tabular-mono font-semibold text-[var(--color-tally-red)]">2×</span> speed, and click to inspect at{" "}
        <span className="tabular-mono font-semibold text-[var(--color-carbon-ink)]">1×</span> with sound.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
            <label
              htmlFor="empty-bulk-urls"
              className="text-[13px] font-semibold text-[var(--color-carbon-ink)]"
            >
              Direct video URLs (one per line)
            </label>
            <span className="tabular-mono text-[12px] text-[var(--color-ink-muted)]">
              Optional: url | Category | Title
            </span>
          </div>
          <textarea
            id="empty-bulk-urls"
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={
              "https://cdn.example.com/motion/hero-loop.mp4\nhttps://cdn.example.com/ui/drawer-snap.webm | UI | Drawer Snap"
            }
            className="w-full rounded-[var(--radius-card)] border-[1.5px] border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] px-3.5 py-2.5 font-mono text-[13px] leading-[1.6] text-[var(--color-carbon-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-carbon-ink)] focus:shadow-[var(--shadow-focus-input)] focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="empty-batch-category"
              className="mb-1.5 block text-[13px] font-semibold text-[var(--color-carbon-ink)]"
            >
              Category for this batch (optional)
            </label>
            <input
              id="empty-batch-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Motion, Cinema, Product"
              maxLength={48}
              className="h-10 w-full rounded-[var(--radius-card)] border-[1.5px] border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] px-3.5 text-[14px] text-[var(--color-carbon-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-carbon-ink)] focus:shadow-[var(--shadow-focus-input)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!preview || preview.validItems.length === 0}
            className="btn-primary h-[42px] shrink-0 px-5"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>
              Add{preview && preview.validItems.length > 0 ? ` ${preview.validItems.length}` : ""} to Board
            </span>
          </button>
        </div>

        {preview && (
          <div className="rounded-[var(--radius-card)] border border-[var(--color-hairline-border)] bg-[var(--color-surface-well)] px-3.5 py-2.5 text-[13px]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
              <span className="text-[var(--color-signal-green)]">
                {preview.validItems.length} ready
              </span>
              {preview.duplicateCount > 0 && (
                <span className="text-[var(--color-tape-amber)]">
                  {preview.duplicateCount} duplicate{preview.duplicateCount === 1 ? "" : "s"} skipped
                </span>
              )}
              {preview.invalidLines.length > 0 && (
                <span className="text-[var(--color-tally-red-deep)]">
                  {preview.invalidLines.length} unsupported line{preview.invalidLines.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
            {preview.invalidLines.length > 0 && (
              <ul className="mt-2 space-y-1 border-t border-[var(--color-hairline-border)] pt-2 text-[12px] text-[var(--color-tally-red-deep)]">
                {preview.invalidLines.slice(0, 3).map((err) => (
                  <li key={err.line} className="flex items-start gap-1.5">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      Line {err.line}: {err.reason}
                    </span>
                  </li>
                ))}
                {preview.invalidLines.length > 3 && (
                  <li className="text-[var(--color-ink-muted)]">
                    +{preview.invalidLines.length - 3} more invalid lines
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </form>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--color-hairline-border)] pt-5">
        <button
          type="button"
          onClick={props.onLoadSamples}
          className="btn-secondary h-10 px-4"
        >
          <Sparkles className="h-4 w-4 text-[var(--color-tally-red)]" aria-hidden="true" />
          <span>Load {SAMPLE_COUNT} sample clips</span>
        </button>

        <button
          type="button"
          onClick={props.onOpenImport}
          className="btn-ghost h-10 px-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-carbon-ink)]"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          <span>Import JSON board</span>
        </button>
      </div>
    </section>
  );
}
