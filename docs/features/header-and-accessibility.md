# Sticky Utility Header & Accessibility

## Overview
Keeps navigation chrome minimal (`56px` height) so playable footage leads from the first viewport, while enforcing WCAG AA+ contrast, keyboard accessibility, and reduced-motion preferences across the entire app.

## Source Files
* `src/components/BoardHeader.tsx`
* `src/app/globals.css`
* `src/app/layout.tsx`

## Sticky Header (`56px`)
* **Left:** Authored `Parallel` SVG bar mark with a live hardware-style tally dot (turns Tally Red `#D91E18` while any clip is actively `2×`-scanning on hover), `Bricolage Grotesque` wordmark, and `tabular-nums` clip count badge (`X / Y clips` when filtered, else `Y clips`).
* **Right (Desktop):** Primary tactile red **+ Add Clips** pill button (`Import / Export JSON` lives cleanly inside that drawer's second tab).
* **Right (Mobile `< 640px`):** Compact `44px × 44px` `⋯` overflow menu (`Import JSON`, `Export JSON`, `Load sample clips`, two-tap `Clear board`) alongside the `+ Add` button (`min-h-[44px]`).

## Accessibility & Browser Surfaces
* **Focus & Selection:** High-visibility `2px solid #D91E18` `:focus-visible` outline (`2px` offset), Tally Red text `::selection`, and Tally Red `caret-color` inside inputs.
* **Semantic Roles:** `radiogroup`/`radio` on category pills, `dialog` (`aria-modal="true"`) on drawer and lightbox, `menu`/`menuitem` on mobile popover, `status`/`aria-live="polite"` on toasts.
* **Reduced Motion:** `@media (prefers-reduced-motion: reduce)` zeroes out hover lifts, button press transforms, and UI transitions while keeping explicit `2×` hover and `1×` lightbox video playback intact.
