"use client";

import { useCallback, useMemo, useState } from "react";
import { ALL_FILTER, serializeBoardExport } from "@/lib/schema";
import { useVideoBoard } from "@/hooks/useVideoBoard";
import { AddLinksDrawer } from "@/components/modals/AddLinksDrawer";
import { LightboxModal } from "@/components/modals/LightboxModal";
import { ToastStack } from "@/components/ui/ToastStack";
import { BoardHeader } from "./BoardHeader";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { EmptyState } from "./EmptyState";
import { VideoGrid, VideoGridSkeleton } from "./VideoGrid";

export function VideoBoardApp() {
  const {
    items,
    hydrated,
    activeFilter,
    setActiveFilter,
    categories,
    knownCategoryNames,
    filteredItems,
    toasts,
    pushToast,
    dismissToast,
    addItems,
    removeItem,
    updateItemCategory,
    loadSamples,
    clearBoard,
  } = useVideoBoard();

  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  const existingUrls = useMemo(() => items.map((item) => item.url), [items]);

  const activeCategoryLabel = useMemo(() => {
    return (
      categories.find((c) => c.key === activeFilter)?.label ?? "this category"
    );
  }, [categories, activeFilter]);

  const handleHoverStart = useCallback(
    (id: string) => {
      if (drawerOpen || lightboxId !== null) return;
      setActiveHoverId(id);
    },
    [drawerOpen, lightboxId]
  );

  const handleHoverEnd = useCallback((id: string) => {
    setActiveHoverId((prev) => (prev === id ? null : prev));
  }, []);

  const handleOpenLightbox = useCallback((id: string) => {
    setActiveHoverId(null);
    setLightboxId(id);
  }, []);

  const handleOpenDrawer = useCallback(() => {
    setActiveHoverId(null);
    setDrawerOpen(true);
  }, []);

  const handleExportJson = useCallback(() => {
    if (items.length === 0) return;
    const json = serializeBoardExport(items);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `parallel-board-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    pushToast("success", `Exported ${items.length} clips to JSON.`);
  }, [items, pushToast]);

  const isOverlayOpen = drawerOpen || lightboxId !== null;
  const effectiveHoverId = isOverlayOpen ? null : activeHoverId;

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">
      <BoardHeader
        totalCount={items.length}
        filteredCount={filteredItems.length}
        isFiltered={activeFilter !== ALL_FILTER}
        isScanning={effectiveHoverId !== null}
        onOpenAdd={handleOpenDrawer}
        onExportJson={handleExportJson}
        onLoadSamples={loadSamples}
        onClearBoard={clearBoard}
      />

      {hydrated && items.length > 0 && (
        <CategoryFilterBar
          categories={categories}
          activeFilter={activeFilter}
          onSelect={(key) => {
            setActiveHoverId(null);
            setActiveFilter(key);
          }}
        />
      )}

      <main className="mx-auto max-w-[1600px] px-4 py-5 md:px-6 md:py-6">
        {!hydrated ? (
          <VideoGridSkeleton />
        ) : items.length === 0 ? (
          <EmptyState
            mode="empty-board"
            onAddItems={addItems}
            onLoadSamples={loadSamples}
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            mode="empty-filter"
            filterLabel={activeCategoryLabel}
            onResetFilter={() => setActiveFilter(ALL_FILTER)}
          />
        ) : (
          <VideoGrid
            items={filteredItems}
            activeHoverId={effectiveHoverId}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            onOpen={handleOpenLightbox}
            onRemove={removeItem}
          />
        )}
      </main>

      <AddLinksDrawer
        open={drawerOpen}
        existingUrls={existingUrls}
        knownCategories={knownCategoryNames}
        totalCount={items.length}
        onClose={() => setDrawerOpen(false)}
        onAddItems={addItems}
        onExportJson={handleExportJson}
        onLoadSamples={loadSamples}
        onClearBoard={clearBoard}
      />

      <LightboxModal
        items={filteredItems}
        activeId={lightboxId}
        knownCategories={knownCategoryNames}
        onClose={() => setLightboxId(null)}
        onSelectId={(id) => setLightboxId(id)}
        onUpdateCategory={updateItemCategory}
        onRemove={removeItem}
        onNotifyCopied={() => pushToast("success", "Direct video URL copied.")}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
