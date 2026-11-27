"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Download,
  FileJson,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { parseBulkInput, type VideoItem } from "@/lib/schema";

interface AddLinksDrawerProps {
  open: boolean;
  initialTab: "paste" | "import";
  existingUrls: string[];
  knownCategories: string[];
  totalCount: number;
  onClose: () => void;
  onAddItems: (items: VideoItem[], duplicateCount: number) => void;
  onImportJson: (raw: string, mode: "merge" | "replace") => { ok: boolean; error?: string };
  onExportJson: () => void;
  onLoadSamples: () => void;
  onClearBoard: () => void;
}

export function AddLinksDrawer({
  open,
  initialTab,
  existingUrls,
  knownCategories,
  totalCount,
  onClose,
  onAddItems,
  onImportJson,
  onExportJson,
  onLoadSamples,
  onClearBoard,
}: AddLinksDrawerProps) {
  const [tab, setTab] = useState<"paste" | "import">(initialTab);
  const [rawText, setRawText] = useState("");
  const [batchCategory, setBatchCategory] = useState("");
  const [importText, setImportText] = useState("");
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [importError, setImportError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTab(initialTab);
      setImportError(null);
      setConfirmClear(false);
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    if (tab === "paste") {
      window.setTimeout(() => textareaRef.current?.focus(), 40);
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, tab, onClose]);

  const preview = useMemo(() => {
    if (!rawText.trim()) return null;
    return parseBulkInput(rawText, batchCategory, existingUrls);
  }, [rawText, batchCategory, existingUrls]);

  if (!open) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || preview.validItems.length === 0) return;
    onAddItems(preview.validItems, preview.duplicateCount);
    setRawText("");
    onClose();
  };

  const handleJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setImportText(text);
    setImportError(null);
    e.target.value = "";
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) {
      setImportError("Paste exported JSON or choose a .json file first.");
      return;
    }
    const res = onImportJson(importText, importMode);
    if (!res.ok) {
      setImportError(res.error ?? "Import failed.");
      return;
    }
    setImportText("");
    setImportError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[var(--z-drawer)] flex items-end justify-center bg-[rgba(17,17,19,0.45)] p-0 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-heading"
        className="flex max-h-[92vh] w-full max-w-[640px] flex-col overflow-hidden rounded-t-[var(--radius-modal)] border border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-drawer)] sm:rounded-[var(--radius-modal)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-hairline-border)] px-6 py-4">
          <h2
            id="drawer-heading"
            className="font-display text-[1.5rem] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--color-carbon-ink)]"
          >
            Manage Board Links
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="btn-ghost h-9 w-9 text-[var(--color-ink-secondary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[var(--color-hairline-border)] bg-[var(--color-paper-canvas)] px-6 py-2.5">
          <button
            type="button"
            onClick={() => setTab("paste")}
            className={`h-8 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
              tab === "paste"
                ? "bg-[var(--color-carbon-ink)] text-white"
                : "text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-well)]"
            }`}
          >
            Paste Video Links
          </button>
          <button
            type="button"
            onClick={() => setTab("import")}
            className={`h-8 cursor-pointer rounded-full px-3.5 text-[13px] font-semibold transition-colors ${
              tab === "import"
                ? "bg-[var(--color-carbon-ink)] text-white"
                : "text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-well)]"
            }`}
          >
            Import / Export JSON
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          {tab === "paste" ? (
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                  <label
                    htmlFor="drawer-bulk-urls"
                    className="text-[13px] font-semibold text-[var(--color-carbon-ink)]"
                  >
                    Direct video URLs (one per line)
                  </label>
                  <span className="tabular-mono text-[12px] text-[var(--color-ink-muted)]">
                    url | Category | Title
                  </span>
                </div>
                <textarea
                  ref={textareaRef}
                  id="drawer-bulk-urls"
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={
                    "https://cdn.example.com/clips/intro.mp4\nhttps://cdn.example.com/clips/hover.webm | Motion | Button Micro"
                  }
                  className="w-full rounded-[var(--radius-card)] border-[1.5px] border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] px-3.5 py-2.5 font-mono text-[13px] leading-[1.6] text-[var(--color-carbon-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-carbon-ink)] focus:shadow-[var(--shadow-focus-input)] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="drawer-batch-category"
                  className="mb-1.5 block text-[13px] font-semibold text-[var(--color-carbon-ink)]"
                >
                  Batch category (optional)
                </label>
                <input
                  id="drawer-batch-category"
                  list="parallel-known-categories"
                  type="text"
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                  placeholder="Leave blank for Uncategorized"
                  maxLength={48}
                  className="h-10 w-full rounded-[var(--radius-card)] border-[1.5px] border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] px-3.5 text-[14px] text-[var(--color-carbon-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-carbon-ink)] focus:shadow-[var(--shadow-focus-input)] focus:outline-none"
                />
                <datalist id="parallel-known-categories">
                  {knownCategories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>

                {knownCategories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {knownCategories.slice(0, 8).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setBatchCategory(cat)}
                        className={`cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
                          batchCategory === cat
                            ? "bg-[var(--color-carbon-ink)] text-white"
                            : "bg-[var(--color-surface-well)] text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-well-hover)]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {preview && (
                <div
                  className={`rounded-[var(--radius-card)] border px-3.5 py-2.5 text-[13px] ${
                    preview.invalidLines.length > 0
                      ? "border-[var(--color-tally-red-deep)] bg-[var(--color-tally-red-wash)]"
                      : "border-[var(--color-hairline-border)] bg-[var(--color-surface-well)]"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold">
                    <span className="text-[var(--color-signal-green)]">
                      {preview.validItems.length} valid
                    </span>
                    {preview.duplicateCount > 0 && (
                      <span className="text-[var(--color-tape-amber)]">
                        {preview.duplicateCount} duplicate{preview.duplicateCount === 1 ? "" : "s"} skipped
                      </span>
                    )}
                    {preview.invalidLines.length > 0 && (
                      <span className="text-[var(--color-tally-red-deep)]">
                        {preview.invalidLines.length} unsupported
                      </span>
                    )}
                  </div>

                  {preview.invalidLines.length > 0 && (
                    <ul className="mt-2 space-y-1 border-t border-[var(--color-tally-red-deep)]/20 pt-2 text-[12px] text-[var(--color-tally-red-deep)]">
                      {preview.invalidLines.slice(0, 4).map((err) => (
                        <li key={err.line} className="flex items-start gap-1.5">
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>
                            Line {err.line}: {err.reason}
                          </span>
                        </li>
                      ))}
                      {preview.invalidLines.length > 4 && (
                        <li>+{preview.invalidLines.length - 4} more invalid lines</li>
                      )}
                    </ul>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary h-10 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!preview || preview.validItems.length === 0}
                  className="btn-primary h-10 px-5"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>
                    Add{" "}
                    {preview && preview.validItems.length > 0
                      ? `${preview.validItems.length} ${preview.validItems.length === 1 ? "Clip" : "Clips"}`
                      : "to Board"}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Export / Samples / Clear bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-[var(--color-hairline-border)] bg-[var(--color-surface-well)] p-3.5">
                <div>
                  <p className="text-[14px] font-semibold text-[var(--color-carbon-ink)]">
                    Share or back up this board
                  </p>
                  <p className="text-[12px] text-[var(--color-ink-secondary)]">
                    Saved locally in your browser. Export JSON to share with teammates.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onExportJson}
                    disabled={totalCount === 0}
                    className="btn-secondary h-9 px-3.5 text-[13px]"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLoadSamples();
                      onClose();
                    }}
                    className="btn-ghost h-9 border border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] px-3 text-[13px]"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[var(--color-tally-red)]" />
                    <span>Add Samples</span>
                  </button>
                </div>
              </div>

              {/* Import Form */}
              <form onSubmit={handleImportSubmit} className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="import-json-text"
                    className="text-[13px] font-semibold text-[var(--color-carbon-ink)]"
                  >
                    Import JSON board file
                  </label>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/json,.json"
                      onChange={handleJsonFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-ghost h-8 border border-[var(--color-hairline-border)] px-3 text-[12px]"
                    >
                      <FileJson className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Choose .json file</span>
                    </button>
                  </div>
                </div>

                <textarea
                  id="import-json-text"
                  rows={5}
                  value={importText}
                  onChange={(e) => {
                    setImportText(e.target.value);
                    setImportError(null);
                  }}
                  placeholder='{"version": 1, "items": [...]}'
                  className="w-full rounded-[var(--radius-card)] border-[1.5px] border-[var(--color-hairline-border)] bg-[var(--color-surface-card)] px-3.5 py-2.5 font-mono text-[12px] leading-[1.55] text-[var(--color-carbon-ink)] placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-carbon-ink)] focus:shadow-[var(--shadow-focus-input)] focus:outline-none"
                />

                {importError && (
                  <div className="flex items-start gap-2 rounded-[var(--radius-card)] border border-[var(--color-tally-red-deep)] bg-[var(--color-tally-red-wash)] px-3 py-2 text-[13px] font-medium text-[var(--color-tally-red-deep)]">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{importError}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 text-[13px]">
                    <span className="font-medium text-[var(--color-ink-secondary)]">
                      Mode:
                    </span>
                    <button
                      type="button"
                      onClick={() => setImportMode("merge")}
                      className={`cursor-pointer rounded-full px-3 py-1 font-semibold ${
                        importMode === "merge"
                          ? "bg-[var(--color-carbon-ink)] text-white"
                          : "bg-[var(--color-surface-well)] text-[var(--color-ink-secondary)]"
                      }`}
                    >
                      Merge
                    </button>
                    <button
                      type="button"
                      onClick={() => setImportMode("replace")}
                      className={`cursor-pointer rounded-full px-3 py-1 font-semibold ${
                        importMode === "replace"
                          ? "bg-[var(--color-carbon-ink)] text-white"
                          : "bg-[var(--color-surface-well)] text-[var(--color-ink-secondary)]"
                      }`}
                    >
                      Replace Board
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!importText.trim()}
                    className="btn-primary h-10 px-4"
                  >
                    <Upload className="h-4 w-4" aria-hidden="true" />
                    <span>Import Clips</span>
                  </button>
                </div>
              </form>

              {totalCount > 0 && (
                <div className="flex items-center justify-between border-t border-[var(--color-hairline-border)] pt-4">
                  <span className="text-[13px] text-[var(--color-ink-secondary)]">
                    Remove all {totalCount} saved clips from this browser
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirmClear) {
                        setConfirmClear(true);
                        return;
                      }
                      onClearBoard();
                      onClose();
                    }}
                    className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] px-3 text-[13px] font-semibold text-[var(--color-tally-red-deep)] hover:bg-[var(--color-tally-red-wash)]"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    <span>{confirmClear ? "Click again to confirm" : "Clear Board"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
