# `2×` Hover-Autoplay Video Grid

## Overview
Displays direct video links in a uniform `16:9` responsive grid built for rapid visual scanning on desktop, with instant `2×` muted hover previews, hover-only quick deletion, and a clean tap fallback on touch devices.

## Source Files
* `src/components/VideoGrid.tsx`
* `src/components/VideoCard.tsx`
* `src/components/VideoBoardApp.tsx`
* `src/app/globals.css` (`.parallel-grid`, `.video-card-frame`, `.touch-play-indicator`)

## User Behavior
* **Resting state:** Clean `16:9` video frames with zero permanent text overlays, gradients, or drop shadows (`1px solid #DCD9D0`). Title, optional `SAMPLE` tag, and category sit in a compact `36px` caption bar beneath the frame.
* **Hover state (desktop mouse):**
  * Immediately starts muted looping playback at `2×` speed (`playbackRate = 2.0`).
  * Lifts the frame `-2px`, activates the Tally Red (`#D91E18`) border/ring, shows the top-left `2×` tally badge, and animates a `3px` Tally Red bottom progress hairline.
  * Reveals a top-right trash-icon delete button (`Delete clip`). Clicking it deletes the clip without opening the lightbox, and hovering over the delete button keeps `2×` playback steady.
* **Hover-out state:** Pauses playback immediately and resets `currentTime = 0` and the progress bar to `0%` so every hover starts from the beginning.
* **Click / keyboard activation:** Clicking the frame (or pressing `Enter` / `Space`) pauses hover playback and opens the clip in the `1×` Screening Lightbox.
* **Touch / mobile fallback:** Hover-autoplay only triggers for `pointerType === "mouse"`. On `@media (hover: none)` devices, a subtle bottom-right `▶` indicator is shown and tapping any card opens the lightbox directly.

## Technical Details
* **Single-active controller:** `VideoBoardApp` owns `activeHoverId` so only one video plays at a time and any open drawer/lightbox immediately halts background playback.
* **Reliable `2×` speed:** `video.muted = true` and `video.playbackRate = 2` are set imperatively before `.play()` and re-enforced in `onLoadedMetadata` / `onPlaying`.
* **Rapid sweep resilience:** Expected `AbortError` promise rejections from fast pointer sweeps are caught and ignored.
* **Scale optimization:** `IntersectionObserver` (`rootMargin: "240px"`) defers `preload="metadata"` until near the viewport—no `<canvas>` thumbnail extraction is used, avoiding cross-origin CORS failures.
* **Responsive columns:** `1` (`<520px`), `2` (`520–899px`), `3` (`900–1199px`), `4` (`1200–1519px`), `5` (`≥1520px`).
