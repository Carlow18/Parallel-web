# Local Persistence & JSON Export/Import

## Overview
Stores the entire video board locally in the browser with zero accounts or backend, while providing Zod-validated JSON export and import so individuals and small teams can back up or share boards easily.

## Source Files
* `src/lib/schema.ts` (`STORAGE_KEY`, `BoardStoreSchema`, `loadBoardFromStorage`, `saveBoardToStorage`, `serializeBoardExport`, `parseBoardImportJson`)
* `src/hooks/useVideoBoard.ts`
* `src/components/AddLinksDrawer.tsx` (`Import / Export JSON` tab)

## Persistence Behavior
* **Storage key & schema:** Persisted in `localStorage` under `parallel.video-board.v1` as `{ version: 1, items: VideoItem[] }`, validated on read via `BoardStoreSchema.safeParse()`.
* **Hydration safety:** Initial server/client render shows `VideoGridSkeleton` until `useEffect` reads `localStorage`, preventing React hydration mismatches.
* **Corruption recovery:** Unreadable or malformed stored JSON resets cleanly to an empty board and surfaces a warning toast rather than throwing runtime errors.
* **Legacy sample migration:** Automatically replaces deprecated `commondatastorage.googleapis.com/gtv-videos-bucket/` sample links with current sample clips on load while preserving all user-added links.

## JSON Export & Import (via `+ Add Clips → Import / Export JSON`)
* **Export JSON:** Downloads `parallel-board-YYYY-MM-DD.json` containing the current versioned board snapshot.
* **Import JSON:** Accepts either a `.json` file upload or pasted JSON text. Supports both `{ version: 1, items: [...] }` and plain arrays of clip objects, skipping any malformed/duplicate entries cleanly with status feedback.
* **Import Modes:**
  * **Merge (default):** Appends only non-duplicate clips to the existing board.
  * **Replace Board:** Replaces the entire board and resets the active filter to `All`.
* **Clear Board:** Protected by a two-click confirmation (`Clear Board` → `Click again to confirm`) to prevent accidental wipes.
