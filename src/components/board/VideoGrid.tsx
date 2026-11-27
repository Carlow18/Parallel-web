"use client";

import type { VideoItem } from "@/lib/schema";
import { VideoCard } from "./VideoCard";

interface VideoGridProps {
  items: VideoItem[];
  activeHoverId: string | null;
  onHoverStart: (id: string) => void;
  onHoverEnd: (id: string) => void;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
}

export function VideoGrid({
  items,
  activeHoverId,
  onHoverStart,
  onHoverEnd,
  onOpen,
  onRemove,
}: VideoGridProps) {
  return (
    <div className="parallel-grid">
      {items.map((item) => (
        <VideoCard
          key={item.id}
          item={item}
          isHovered={activeHoverId === item.id}
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
          onOpen={onOpen}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

export function VideoGridSkeleton() {
  return (
    <div className="parallel-grid" aria-label="Loading video board">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="flex flex-col">
          <div className="aspect-video w-full animate-pulse rounded-[var(--radius-card)] border border-[var(--color-hairline-border)] bg-[var(--color-surface-well)]" />
          <div className="mt-2 h-9 space-y-1.5 px-0.5">
            <div className="h-3.5 w-2/3 animate-pulse rounded bg-[var(--color-surface-well)]" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-[var(--color-surface-well)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
