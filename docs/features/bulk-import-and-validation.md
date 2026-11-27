# Bulk Link Import & Zod Validation

## Overview
Lets users paste raw lists of direct video URLs (optionally tagged with categories and titles), validates every line in real time with Zod, deduplicates links, and surfaces exact line-by-line issues before anything is added.

## Source Files
* `src/lib/schema.ts` (`DirectVideoUrlSchema`, `VideoItemSchema`, `parseBulkInput`, `deriveTitleFromUrl`)
* `src/components/modals/AddLinksDrawer.tsx`
* `src/components/board/EmptyState.tsx`

## Supported Input Formats
One entry per line (blank lines are ignored):
```text
https://cdn.example.com/clips/intro.mp4
https://cdn.example.com/clips/cut-02.webm | Motion
https://cdn.example.com/clips/cut-03.mp4 | Cinema | Dusk Handheld
```

## Validation & Normalization Rules
* **Protocol check:** Only `http://` and `https://` URLs are accepted.
* **Unsupported platform guardrail:** Flags watch-page links from YouTube, Vimeo, TikTok, Instagram, X/Twitter, and Loom with a clear message instructing the user to provide direct `.mp4`, `.webm`, or CDN/S3/R2 video file URLs.
* **Deduplication:** Normalizes URLs via `new URL()` and skips duplicates against both existing board clips and earlier lines in the same pasted batch.
* **Batch category fallback:** If a line omits an inline category, it inherits the optional batch category field (which offers `<datalist>` autocomplete and quick-pick pills for existing categories).
* **Automatic titles:** When no inline title is provided, `deriveTitleFromUrl()` cleans camelCase, `snake_case`, and hyphenated filenames (stripping `.mp4`/`.webm`/`.mov`/`.m4v`/`.ogv` extensions) into readable labels.

## Live Pre-Submit Feedback
Both `AddLinksDrawer` and `EmptyState` render an inline Zod summary strip as the user types:
* Valid clip count in **Signal Green** (`#157A4B`)
* Skipped duplicate count in **Tape Amber** (`#9A5B00`)
* Unsupported / invalid line list with line numbers and reasons in **Tally Red Deep** (`#B51611`)
