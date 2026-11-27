# Broken-Link Resilience & Notifications

## Overview
Isolates dead, hotlink-blocked, or unsupported video links into recoverable error tiles so one bad URL never breaks the grid, and communicates board actions through compact semantic toast notifications.

## Source Files
* `src/components/board/VideoCard.tsx` (error tile variant)
* `src/components/ui/ToastStack.tsx`
* `src/hooks/useVideoBoard.ts` (`toasts`, `pushToast`, `dismissToast`)
* `src/app/layout.tsx` (`referrer: "no-referrer"`)

## Broken-Link Error Tiles
* **Visual isolation:** When `<video>` emits `onError`, only that card switches to a `16:9` dashed red frame (`1.5px dashed #B51611` on `tally-red-wash` `#FCECEB`) displaying the clip's hostname (`getHostname(item.url)`).
* **Diagnostic message (`MediaError.code`):**
  * Code `2` (`MEDIA_ERR_NETWORK`): `"Network error while fetching video."`
  * Code `3` (`MEDIA_ERR_DECODE`): `"Video codec could not be decoded by this browser."`
  * Code `4` / default: `"Blocked by host (403/CORP), 404, or unsupported format."`
* **Per-card recovery actions:**
  * **Retry:** Remounts the `<video>` element (`retryKey`) to attempt loading again.
  * **Open:** Opens the raw URL in a new tab so the user can inspect host errors directly.
  * **Remove:** Deletes the broken link from the board immediately.
* **Referrer policy:** `src/app/layout.tsx` sets `referrer: "no-referrer"` so third-party video hosts don't block playback based on `Referer` headers.

## Semantic Toast Notifications
* Fixed bottom-right stack (`aria-live="polite"`, max 3 visible, auto-dismissed after `3.6s`, manually dismissible).
* Three semantic tones:
  * **Success (Signal Green `#157A4B` / `#E8F5EE`):** Clips added, URL copied, JSON exported, category updated, clip removed.
  * **Warning (Tape Amber `#9A5B00` / `#FEF5E4`):** Duplicates skipped, partial JSON import, corrupted storage recovery.
  * **Error (Tally Red Deep `#B51611` / `#FCECEB`):** Invalid JSON import failures.
