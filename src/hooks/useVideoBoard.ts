"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createSampleItems } from "@/lib/samples";
import {
  ALL_FILTER,
  UNCATEGORIZED_FILTER,
  loadBoardFromStorage,
  normalizeCategory,
  normalizeUrl,
  parseBoardImportJson,
  saveBoardToStorage,
  type VideoItem,
} from "@/lib/schema";

export interface CategoryOption {
  key: string;
  label: string;
  count: number;
}

export interface ToastMessage {
  id: string;
  tone: "success" | "warning" | "error";
  message: string;
}

export function useVideoBoard() {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback(
    (tone: ToastMessage["tone"], message: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-2), { id, tone, message }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3600);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const { items: loaded, recoveredError } = loadBoardFromStorage();
    const isLegacyBrokenSample = (item: VideoItem) =>
      item.isSample === true &&
      item.url.includes("commondatastorage.googleapis.com/gtv-videos-bucket/");

    if (loaded.some(isLegacyBrokenSample)) {
      const userAndValid = loaded.filter((item) => !isLegacyBrokenSample(item));
      const existingUrls = new Set(
        userAndValid.map((item) => normalizeUrl(item.url))
      );
      const freshSamples = createSampleItems().filter(
        (sample) => !existingUrls.has(normalizeUrl(sample.url))
      );
      const migrated = [...freshSamples, ...userAndValid];
      saveBoardToStorage(migrated);
      setItems(migrated);
      setHydrated(true);
      pushToast("success", "Updated sample clips to fresh direct video sources.");
      return;
    }

    setItems(loaded);
    setHydrated(true);
    if (recoveredError) {
      pushToast(
        "warning",
        "Saved board data was unreadable and has been reset cleanly."
      );
    }
  }, [pushToast]);

  const persist = useCallback(
    (updater: (prev: VideoItem[]) => VideoItem[]) => {
      setItems((prev) => {
        const next = updater(prev);
        saveBoardToStorage(next);
        return next;
      });
    },
    []
  );

  const categories = useMemo<CategoryOption[]>(() => {
    const counts = new Map<string, number>();
    let uncategorizedCount = 0;

    for (const item of items) {
      const cat = normalizeCategory(item.category);
      if (!cat) {
        uncategorizedCount += 1;
      } else {
        counts.set(cat, (counts.get(cat) ?? 0) + 1);
      }
    }

    const sortedCategories: CategoryOption[] = Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cat, count]) => ({
        key: cat,
        label: cat,
        count,
      }));

    const options: CategoryOption[] = [
      { key: ALL_FILTER, label: "All", count: items.length },
      ...sortedCategories,
    ];

    if (uncategorizedCount > 0) {
      options.push({
        key: UNCATEGORIZED_FILTER,
        label: "Uncategorized",
        count: uncategorizedCount,
      });
    }

    return options;
  }, [items]);

  const knownCategoryNames = useMemo(
    () =>
      categories
        .filter((c) => c.key !== ALL_FILTER && c.key !== UNCATEGORIZED_FILTER)
        .map((c) => c.label),
    [categories]
  );

  // If the active category becomes empty/removed, stay graceful or auto-reset when board empties
  useEffect(() => {
    if (items.length === 0 && activeFilter !== ALL_FILTER) {
      setActiveFilter(ALL_FILTER);
    }
  }, [items.length, activeFilter]);

  const filteredItems = useMemo(() => {
    if (activeFilter === ALL_FILTER) return items;
    if (activeFilter === UNCATEGORIZED_FILTER) {
      return items.filter((item) => normalizeCategory(item.category) === "");
    }
    return items.filter(
      (item) => normalizeCategory(item.category) === activeFilter
    );
  }, [items, activeFilter]);

  const addItems = useCallback(
    (newItems: VideoItem[], duplicateCount = 0) => {
      if (newItems.length === 0) {
        if (duplicateCount > 0) {
          pushToast(
            "warning",
            `${duplicateCount} duplicate ${duplicateCount === 1 ? "link" : "links"} skipped.`
          );
        }
        return;
      }

      persist((prev) => [...newItems, ...prev]);

      const addedLabel = `${newItems.length} ${newItems.length === 1 ? "clip" : "clips"} added`;
      if (duplicateCount > 0) {
        pushToast(
          "warning",
          `${addedLabel} · ${duplicateCount} ${duplicateCount === 1 ? "duplicate" : "duplicates"} skipped.`
        );
      } else {
        pushToast("success", `${addedLabel} to board.`);
      }
    },
    [persist, pushToast]
  );

  const removeItem = useCallback(
    (id: string) => {
      persist((prev) => prev.filter((item) => item.id !== id));
      pushToast("success", "Clip removed from board.");
    },
    [persist, pushToast]
  );

  const updateItemCategory = useCallback(
    (id: string, nextCategory: string) => {
      const normalized = normalizeCategory(nextCategory);
      persist((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, category: normalized } : item
        )
      );
      pushToast(
        "success",
        normalized ? `Moved to ${normalized}.` : "Moved to Uncategorized."
      );
    },
    [persist, pushToast]
  );

  const loadSamples = useCallback(() => {
    const samples = createSampleItems();
    const existing = new Set(items.map((item) => normalizeUrl(item.url)));
    const fresh = samples.filter((s) => !existing.has(normalizeUrl(s.url)));
    if (fresh.length === 0) {
      pushToast("warning", "Sample clips are already on your board.");
      return;
    }
    persist((prev) => [...fresh, ...prev]);
    setActiveFilter(ALL_FILTER);
    pushToast("success", `Loaded ${fresh.length} sample clips — hover any card for 2× preview.`);
  }, [items, persist, pushToast]);

  const clearBoard = useCallback(() => {
    persist(() => []);
    setActiveFilter(ALL_FILTER);
    pushToast("success", "Board cleared.");
  }, [persist, pushToast]);

  const importJson = useCallback(
    (rawText: string, mode: "merge" | "replace"): { ok: boolean; error?: string } => {
      const parsed = parseBoardImportJson(rawText);
      if (!parsed.ok) {
        pushToast("error", parsed.error);
        return { ok: false, error: parsed.error };
      }

      if (mode === "replace") {
        persist(() => parsed.items);
        setActiveFilter(ALL_FILTER);
        pushToast(
          parsed.skippedCount > 0 ? "warning" : "success",
          parsed.skippedCount > 0
            ? `Imported ${parsed.items.length} clips (${parsed.skippedCount} invalid skipped).`
            : `Board replaced with ${parsed.items.length} clips.`
        );
        return { ok: true };
      }

      const existing = new Set(items.map((item) => normalizeUrl(item.url)));
      const unique = parsed.items.filter(
        (item) => !existing.has(normalizeUrl(item.url))
      );
      const dupes = parsed.items.length - unique.length;

      if (unique.length > 0) {
        persist((prev) => [...unique, ...prev]);
      }

      const skippedTotal = dupes + parsed.skippedCount;
      pushToast(
        skippedTotal > 0 ? "warning" : "success",
        unique.length > 0
          ? `Imported ${unique.length} new ${unique.length === 1 ? "clip" : "clips"}${skippedTotal > 0 ? ` · ${skippedTotal} skipped` : ""}.`
          : "All clips in that JSON file are already on your board."
      );
      return { ok: true };
    },
    [items, persist, pushToast]
  );

  return {
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
    importJson,
  };
}
