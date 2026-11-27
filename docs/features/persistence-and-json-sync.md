# Local Persistence & JSON Export

## Overview
Stores the entire video board locally in the browser with zero accounts or backend, while providing JSON export so users can back up their board at any time.

## Source Files
* `src/lib/schema.ts` (`STORAGE_KEY`, `BoardStoreSchema`, `loadBoardFromStorage`, `saveBoardToStorage`, `serializeBoardExport`)
* `src/hooks/useVideoBoard.ts`
* `src/components/modals/AddLinksDrawer.tsx`

## Persistence Behavior
* **Storage key & schema:** Persisted in `localStorage` under `parallel.video-board.v1` as `{ version: 1, items: VideoItem[] }`, validated on read via `BoardStoreSchema.safeParse()`.
* **Hydration safety:** Initial server/client render shows `VideoGridSkeleton` until `useEffect` reads `localStorage`, preventing React hydration mismatches.
* **Corruption recovery:** Unreadable or malformed stored JSON resets cleanly to an empty board and surfaces a warning toast rather than throwing runtime errors.
* **Legacy sample migration:** Automatically replaces deprecated `commondatastorage.googleapis.com/gtv-videos-bucket/` sample links with current sample clips on load while preserving all user-added links.

## Board Utilities (via `+ Add Clips`)
* **Export JSON:** Downloads `parallel-board-YYYY-MM-DD.json` containing the current versioned board snapshot.
* **Add Samples:** Restores any missing sample clips without duplicating ones already on the board.
* **Clear Board:** Protected by a two-click confirmation (`Clear Board` → `Click again to confirm`) to prevent accidental wipes.
