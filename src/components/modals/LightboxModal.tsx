"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Film,
  Trash2,
  X,
} from "lucide-react";
import { getHostname, type VideoItem } from "@/lib/schema";

interface LightboxModalProps {
  items: VideoItem[];
  activeId: string | null;
  knownCategories: string[];
  onClose: () => void;
  onSelectId: (id: string) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onRemove: (id: string) => void;
  onNotifyCopied: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const;

export function LightboxModal({
  items,
  activeId,
  knownCategories,
  onClose,
  onSelectId,
  onUpdateCategory,
  onRemove,
  onNotifyCopied,
}: LightboxModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const currentIndex = activeId
    ? items.findIndex((item) => item.id === activeId)
    : -1;
  const clip = currentIndex >= 0 ? items[currentIndex] : null;

  const goPrev = useCallback(() => {
    if (items.length <= 1 || currentIndex < 0) return;
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    const target = items[prevIdx];
    if (target) onSelectId(target.id);
  }, [items, currentIndex, onSelectId]);

  const goNext = useCallback(() => {
    if (items.length <= 1 || currentIndex < 0) return;
    const nextIdx = (currentIndex + 1) % items.length;
    const target = items[nextIdx];
    if (target) onSelectId(target.id);
  }, [items, currentIndex, onSelectId]);

  // Reset speed to 1x and clear transient state whenever switching clips
  useEffect(() => {
    setSpeed(1);
    setCopied(false);
    setVideoError(false);
    setAddingCategory(false);
    setCustomCategory("");
  }, [activeId]);

  // Sync playbackRate onto the <video> element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
  }, [speed, activeId]);

  // Lock page scroll & attach keyboard shortcuts (Esc, Left, Right, Space)
  useEffect(() => {
    if (!clip) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isEditing =
        tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (isEditing) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (
        e.key === " " &&
        tag !== "BUTTON" &&
        tag !== "A" &&
        tag !== "VIDEO"
      ) {
        e.preventDefault();
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clip, onClose, goPrev, goNext]);

  if (!clip) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(clip.url);
      setCopied(true);
      onNotifyCopied();
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const handleDeleteCurrent = () => {
    const nextTarget =
      items.length > 1
        ? items[(currentIndex + 1) % items.length]?.id ?? null
        : null;
    onRemove(clip.id);
    if (nextTarget && nextTarget !== clip.id) {
      onSelectId(nextTarget);
    } else {
      onClose();
    }
  };

  const handleSaveNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    onUpdateCategory(clip.id, trimmed);
    setAddingCategory(false);
    setCustomCategory("");
  };

  const currentCat = clip.category.trim();
  const categoryOptions = Array.from(
    new Set(currentCat ? [...knownCategories, currentCat] : knownCategories)
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[var(--z-lightbox)] flex flex-col bg-[rgba(14,14,16,0.96)] text-[var(--color-screening-text)]"
    >
      {/* Top screening bar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-screening-border)] bg-[var(--color-screening-surface)] px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <h2
            id="lightbox-title"
            className="font-display truncate text-[1.125rem] font-bold tracking-[-0.015em] text-[var(--color-screening-text)]"
          >
            {clip.title}
          </h2>
          {clip.isSample && (
            <span className="tabular-mono shrink-0 rounded-[var(--radius-badge)] border border-[var(--color-screening-border)] bg-[var(--color-screening-black)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-[var(--color-screening-muted)]">
              Sample
            </span>
          )}
          <span className="tabular-mono shrink-0 text-[12px] font-semibold text-[var(--color-screening-muted)]">
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close screening room"
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-screening-border)] bg-[var(--color-screening-black)] px-3 text-[13px] font-semibold text-[var(--color-screening-text)] hover:bg-white/10"
        >
          <span className="tabular-mono hidden rounded border border-[var(--color-screening-border)] px-1.5 py-0.5 text-[11px] text-[var(--color-screening-muted)] sm:inline">
            ESC
          </span>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      {/* Center screening stage */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center p-4 md:p-8"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {items.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous clip"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[var(--color-screening-border)] bg-[rgba(26,26,30,0.85)] text-white hover:border-white/40 hover:bg-[var(--color-screening-surface)] md:left-6"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {videoError ? (
          <div className="flex max-w-md flex-col items-center rounded-[var(--radius-modal)] border border-dashed border-[var(--color-tally-red-bright)] bg-[var(--color-screening-surface)] p-6 text-center">
            <Film className="mb-3 h-8 w-8 text-[var(--color-tally-red-bright)]" />
            <p className="text-[15px] font-semibold text-white">
              Unable to play clip in browser
            </p>
            <p className="tabular-mono mt-1 text-[12px] text-[var(--color-screening-muted)]">
              {getHostname(clip.url)}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href={clip.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-screening-border)] bg-[var(--color-screening-black)] px-4 text-[13px] font-semibold text-white hover:bg-white/10"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Direct File</span>
              </a>
              <button
                type="button"
                onClick={handleDeleteCurrent}
                className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-[var(--color-tally-red)] px-4 text-[13px] font-semibold text-white hover:bg-[var(--color-tally-red-deep)]"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <video
            key={clip.id}
            ref={videoRef}
            src={clip.url}
            controls
            autoPlay
            playsInline
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.playbackRate = speed;
                videoRef.current.muted = false;
              }
            }}
            onError={() => setVideoError(true)}
            className="max-h-full max-w-full rounded-[var(--radius-card)] bg-black object-contain shadow-[var(--shadow-screening)]"
          />
        )}

        {items.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next clip"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[var(--color-screening-border)] bg-[rgba(26,26,30,0.85)] text-white hover:border-white/40 hover:bg-[var(--color-screening-surface)] md:right-6"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Bottom utility bar */}
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[var(--color-screening-border)] bg-[var(--color-screening-surface)] px-4 py-3 md:px-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Speed selector */}
          <div
            role="group"
            aria-label="Playback speed"
            className="flex items-center gap-1 rounded-full border border-[var(--color-screening-border)] bg-[var(--color-screening-black)] p-1"
          >
            {SPEED_OPTIONS.map((rate) => {
              const active = speed === rate;
              return (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setSpeed(rate)}
                  className={`tabular-mono h-7 cursor-pointer rounded-full px-2.5 text-[12px] font-semibold transition-colors ${
                    active
                      ? "bg-[var(--color-tally-red-bright)] text-[var(--color-screening-black)]"
                      : "text-[var(--color-screening-muted)] hover:text-white"
                  }`}
                >
                  {rate}×
                </button>
              );
            })}
          </div>

          {/* Inline Category reassignment */}
          {addingCategory ? (
            <form onSubmit={handleSaveNewCategory} className="flex items-center gap-1.5">
              <input
                type="text"
                autoFocus
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="New category..."
                maxLength={48}
                className="h-9 w-36 rounded-[var(--radius-control)] border border-[var(--color-screening-border)] bg-[var(--color-screening-black)] px-2.5 text-[13px] text-white placeholder:text-[var(--color-screening-muted)] focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="h-9 cursor-pointer rounded-[var(--radius-control)] bg-white px-2.5 text-[12px] font-semibold text-[var(--color-screening-black)]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setAddingCategory(false)}
                className="h-9 cursor-pointer rounded-[var(--radius-control)] px-2 text-[12px] text-[var(--color-screening-muted)] hover:text-white"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <label htmlFor="lightbox-category-select" className="sr-only">
                Clip category
              </label>
              <select
                id="lightbox-category-select"
                value={currentCat}
                onChange={(e) => {
                  if (e.target.value === "__NEW__") {
                    setAddingCategory(true);
                    return;
                  }
                  onUpdateCategory(clip.id, e.target.value);
                }}
                className="h-9 cursor-pointer rounded-[var(--radius-control)] border border-[var(--color-screening-border)] bg-[var(--color-screening-black)] px-3 text-[13px] font-medium text-[var(--color-screening-text)] focus:border-white focus:outline-none"
              >
                <option value="">Uncategorized</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__NEW__">+ New category...</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyUrl}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-screening-border)] bg-[var(--color-screening-black)] px-3 text-[13px] font-semibold text-[var(--color-screening-text)] hover:bg-white/10"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[var(--color-signal-green)]" />
            ) : (
              <Copy className="h-4 w-4 text-[var(--color-screening-muted)]" />
            )}
            <span>{copied ? "Copied" : "Copy URL"}</span>
          </button>

          <a
            href={clip.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-control)] border border-[var(--color-screening-border)] bg-[var(--color-screening-black)] px-3 text-[13px] font-semibold text-[var(--color-screening-text)] hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4 text-[var(--color-screening-muted)]" />
            <span>Open File</span>
          </a>

          <button
            type="button"
            onClick={handleDeleteCurrent}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-[var(--radius-control)] px-3 text-[13px] font-semibold text-[var(--color-tally-red-bright)] hover:bg-white/10"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            <span>Remove</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
