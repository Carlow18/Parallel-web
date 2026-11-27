# `1×` Obsidian Screening Lightbox

## Overview
Full-viewport dark screening room (`#0E0E10`) for inspecting any clip at normal `1×` speed with sound, native controls, speed adjustments, and quick metadata/organization actions.

## Source Files
* `src/components/LightboxModal.tsx`
* `src/components/VideoBoardApp.tsx`

## User Behavior
* **Two-Room Contrast:** Opening a clip dims the entire viewport into `rgba(14, 14, 16, 0.96)` so bright and dark footage can be evaluated without light-table chrome distracting the eye.
* **Uncropped `1×` Playback:** Renders native `<video controls autoPlay playsInline>` with `object-contain` starting unmuted at `1×` speed.
* **Speed Switcher:** Bottom bar includes `0.5×`, `1×`, `1.5×`, and `2×` pills; active speed is highlighted in Tally Red Bright (`#FF423B`). Switching clips resets speed back to `1×`.
* **Inline Category Editing:** Dropdown lets users move the current clip to `Uncategorized`, any existing category, or select `+ New category...` to type and save a new category on the spot.
* **Clip Actions:**
  * **Copy URL:** Copies the direct video link to the clipboard and triggers a confirmation toast.
  * **Open File:** Opens the raw video URL in a new browser tab.
  * **Remove:** Deletes the clip and automatically steps to the next filtered clip (or closes the lightbox if it was the last clip).
* **Stepping & Shortcuts:**
  * Left/right viewport edge buttons and `←` / `→` keys cycle through the currently filtered grid.
  * `Esc` or clicking the backdrop closes the screening room.
  * `Space` toggles play/pause (ignored while typing in an input or focusing native video controls).

## Technical Details
* Locks `document.body.style.overflow = "hidden"` while open and restores it on unmount.
* Includes a dark-themed in-modal fallback view with `Open Direct File` and `Remove` if a clip fails to decode inside the lightbox.
