"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Film, Play, RotateCw, Trash2 } from "lucide-react";
import { getHostname, type VideoItem } from "@/lib/schema";

interface VideoCardProps {
  item: VideoItem;
  isHovered: boolean;
  onHoverStart: (id: string) => void;
  onHoverEnd: (id: string) => void;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
}

export function VideoCard({
  item,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onOpen,
  onRemove,
}: VideoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [shouldLoadMeta, setShouldLoadMeta] = useState(false);
  const [errorReason, setErrorReason] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const hasError = errorReason !== null;

  // Lazy-enable metadata preload only when the tile enters or nears the viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el || shouldLoadMeta) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoadMeta(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadMeta(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoadMeta]);

  // Imperative single-active 2x hover playback & clean 0:00 reset on hover-out
  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasError) return;

    let rafId = 0;

    const updateProgress = () => {
      if (progressBarRef.current) {
        const ratio =
          video.duration && Number.isFinite(video.duration) && video.duration > 0
            ? Math.min(1, Math.max(0, video.currentTime / video.duration))
            : 0;
        progressBarRef.current.style.transform = `scaleX(${ratio})`;
      }
      if (isHovered && !video.paused) {
        rafId = window.requestAnimationFrame(updateProgress);
      }
    };

    if (isHovered) {
      video.muted = true;
      video.defaultMuted = true;
      video.playbackRate = 2;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
        });
      }
      rafId = window.requestAnimationFrame(updateProgress);
    } else {
      video.pause();
      if (video.readyState >= 1) {
        try {
          video.currentTime = 0;
        } catch {
          // Ignore seek errors on unloaded streams
        }
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = "scaleX(0)";
      }
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [isHovered, hasError, retryKey]);

  const enforceRate = () => {
    const video = videoRef.current;
    if (!video || !isHovered) return;
    video.muted = true;
    if (video.playbackRate !== 2) {
      video.playbackRate = 2;
    }
  };

  const handleRetry = () => {
    setErrorReason(null);
    setShouldLoadMeta(true);
    setRetryKey((k) => k + 1);
  };

  const categoryLabel = item.category.trim() || "Uncategorized";

  return (
    <article ref={cardRef} className="group flex flex-col">
      {hasError ? (
        <div className="flex aspect-video w-full flex-col items-center justify-between rounded-[var(--radius-card)] border-[1.5px] border-dashed border-[var(--color-tally-red-deep)] bg-[var(--color-tally-red-wash)] p-3.5 text-center text-[var(--color-tally-red-deep)]">
          <div className="flex w-full items-center justify-between text-[11px] font-semibold">
            <span className="tabular-mono truncate">{getHostname(item.url)}</span>
            <Film className="h-4 w-4 shrink-0 opacity-80" aria-hidden="true" />
          </div>

          <p className="px-2 text-[12px] font-medium leading-[1.4]">
            {errorReason}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-[var(--radius-badge)] border border-[var(--color-tally-red-deep)] bg-[var(--color-surface-card)] px-2.5 text-[12px] font-semibold text-[var(--color-tally-red-deep)] hover:bg-[var(--color-surface-well)]"
            >
              <RotateCw className="h-3 w-3" aria-hidden="true" />
              <span>Retry</span>
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open video URL in a new tab"
              className="inline-flex h-7 items-center gap-1 rounded-[var(--radius-badge)] border border-[var(--color-tally-red-deep)] bg-[var(--color-surface-card)] px-2 text-[12px] font-semibold text-[var(--color-tally-red-deep)] hover:bg-[var(--color-surface-well)]"
            >
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
              <span>Open</span>
            </a>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-[var(--radius-badge)] bg-[var(--color-tally-red-deep)] px-2.5 text-[12px] font-semibold text-white hover:bg-[var(--color-carbon-ink)]"
            >
              <Trash2 className="h-3 w-3" aria-hidden="true" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          data-active={isHovered ? "true" : "false"}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") {
              onHoverStart(item.id);
            }
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") {
              onHoverEnd(item.id);
            }
          }}
          className="video-card-frame relative aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface-well)]"
        >
          <button
            type="button"
            onClick={() => onOpen(item.id)}
            aria-label={`Inspect ${item.title} at 1x speed`}
            className="block h-full w-full cursor-pointer text-left"
          >
            <video
              key={`${item.id}-${retryKey}`}
              ref={videoRef}
              src={item.url}
              muted
              playsInline
              loop
              preload={shouldLoadMeta || isHovered ? "metadata" : "none"}
              onLoadedMetadata={enforceRate}
              onPlaying={enforceRate}
              onError={(e) => {
                if (isHovered) onHoverEnd(item.id);
                const code = e.currentTarget.error?.code;
                if (code === 2) {
                  setErrorReason("Network error while fetching video.");
                } else if (code === 3) {
                  setErrorReason("Video codec could not be decoded by this browser.");
                } else {
                  setErrorReason("Blocked by host (403/CORP), 404, or unsupported format.");
                }
              }}
              className="h-full w-full object-cover"
            />

            {/* Live 2x Tally Badge (visible only while hovered) */}
            <span
              aria-hidden="true"
              className={`tabular-mono pointer-events-none absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-[var(--radius-badge)] bg-[var(--color-tally-red)] px-2 py-[5px] text-[12px] font-semibold tracking-[0.04em] text-white transition-opacity duration-150 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              2×
            </span>

            {/* Touch-only tap indicator (@media (hover: none)) */}
            <span
              aria-hidden="true"
              className="touch-play-indicator pointer-events-none absolute bottom-2.5 right-2.5 h-8 w-8 items-center justify-center rounded-full bg-[rgba(17,17,19,0.72)] text-white"
            >
              <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
            </span>

            {/* 3px Tally Red bottom progress hairline */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-black/20 transition-opacity duration-150 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                ref={progressBarRef}
                style={{ transform: "scaleX(0)" }}
                className="h-full w-full origin-left bg-[var(--color-tally-red)]"
              />
            </div>
          </button>

          {/* Hover-only quick delete button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onHoverEnd(item.id);
              onRemove(item.id);
            }}
            aria-label={`Delete ${item.title}`}
            title="Delete clip"
            className={`absolute right-2.5 top-2.5 z-10 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[var(--radius-badge)] bg-[rgba(17,17,19,0.78)] text-white backdrop-blur-[4px] transition-[opacity,background-color] duration-150 hover:bg-[var(--color-tally-red)] focus-visible:pointer-events-auto focus-visible:opacity-100 ${
              isHovered
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="mt-2 flex h-9 items-start justify-between gap-2 px-0.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-[13px] font-medium leading-[1.35] text-[var(--color-carbon-ink)]">
              {item.title}
            </h2>
            {item.isSample && (
              <span className="tabular-mono shrink-0 rounded-[4px] border border-[var(--color-hairline-border)] bg-[var(--color-surface-well)] px-1 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-[var(--color-ink-muted)]">
                Sample
              </span>
            )}
          </div>
          <p className="truncate text-[12px] leading-[1.3] text-[var(--color-ink-muted)]">
            {categoryLabel}
          </p>
        </div>
      </div>
    </article>
  );
}
