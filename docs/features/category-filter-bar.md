# Single-Select Category Filter Bar

## Overview
Provides a single, lightweight category filter rail pinned directly below the sticky header so users can narrow a large video board in one click without multi-filter or search clutter.

## Source Files
* `src/components/board/CategoryFilterBar.tsx`
* `src/hooks/useVideoBoard.ts` (`categories`, `activeFilter`, `filteredItems`)

## User Behavior
* **Dynamic pills:** Automatically derives filter options from saved clips:
  1. `All` (total clip count)
  2. Alphabetically sorted custom categories
  3. `Uncategorized` (shown only when at least one clip has an empty category)
* **Selection state:** Selecting a pill filters the grid in place immediately. The active pill switches to Carbon Ink (`#111113`) with white text and a `6px` Tally Red (`#D91E18`) indicator dot on the left.
* **Tabular counters:** Each pill renders its count in `JetBrains Mono` with `font-variant-numeric: tabular-nums` so pill widths never jitter as clips are added or removed.
* **Overflow handling:** Uses a single-row horizontally scrollable rail (`no-scrollbar`) with a subtle right-edge fade into `paper-canvas` (`#F6F5F2`).
* **Desktop scan hint:** Shows `Hover 2× · Click 1×` aligned right on `md+` screens.
* **Auto-hide on empty board:** Hidden when `items.length === 0`.

## Technical Details
* Implemented with `role="radiogroup"` and `role="radio"` (`aria-checked`) for keyboard and screen-reader accessibility.
* Switching categories clears `activeHoverId` so no off-screen hover preview lingers.
