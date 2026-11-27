# Empty States & Sample Clips

## Overview
Guides first-time visitors straight into pasting links or testing `2×` hover-autoplay with curated direct `.mp4` sample clips, and provides a clean recovery path when a category filter has no matches.

## Source Files
* `src/components/EmptyState.tsx`
* `src/lib/samples.ts` (`createSampleItems`, `SAMPLE_COUNT`)
* `src/components/VideoGrid.tsx` (`VideoGridSkeleton`)

## States
* **Hydration Skeleton (`VideoGridSkeleton`):** Displays 8 pulsing `16:9` `surface-well` (`#ECEAE4`) placeholder tiles during initial client hydration so the layout stays stable.
* **First-Run Empty Board (`mode="empty-board"`):**
  * Centered `surface-card` sheet (`max-w-[720px]`) with `Bricolage Grotesque` display heading (`Your 2× video light table`).
  * Inline bulk-paste textarea + optional batch category input + live Zod validation summary so users can populate the board without opening a modal first.
  * One-click **Load sample clips** button and **Import JSON board** shortcut.
* **Empty Filter State (`mode="empty-filter"`):** Displays the empty category name with a one-click **Show All Clips** reset button.

## Sample Clips
* Defined in `src/lib/samples.ts` with `isSample: true` (renders a compact `SAMPLE` mono badge on cards and in the lightbox).
* Can be restored at any time from **+ Add Clips → Import / Export JSON → Add Samples** (or mobile `⋯ → Load sample clips`); already-present sample URLs are skipped automatically to prevent duplicates.
