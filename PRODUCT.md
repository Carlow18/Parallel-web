# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Zod; client-side `localStorage` persistence with JSON export/import; deployed on Vercel.

## Users

Primary users are individual creators, designers, editors, or small teams maintaining a desktop-first visual reference board of direct video clips. They arrive to quickly scan dozens of clips to spot visual references without opening tabs or waiting for heavy video embeds.

## Product Purpose

Take a user-supplied list of direct video file URLs (`.mp4`, `.webm`, CDN/S3/R2 links), display them in a responsive grid with a single category filter, autoplay hovered clips at fast playback speed (`2x`, muted) for rapid visual scanning, and let the user click any clip to inspect it at normal `1x` speed with sound in a lightbox modal.

Success means a user can paste a batch of video links, filter by one category, sweep across the grid with instant glitch-free `2x` hover previews (resetting to `0:00` on mouse leave), and click straight into full `1x` playback with zero accounts or backend setup.

## Positioning

A zero-account, zero-backend local reference board built specifically around instant `2x` muted hover-scanning over direct video URLs—avoiding the slow load times, player chrome, and API limits of embedded social/video platforms.

## Operating Context

- Desktop-first review workflow where users paste raw lists of direct video URLs from local notes, asset folders, S3/R2 buckets, or CDN links.
- Small teams share boards by exporting/importing a lightweight `.json` snapshot rather than managing accounts or databases.
- Mobile/touch devices are secondary and use a clean tap-to-open lightbox fallback instead of hover interactions.

## Capabilities and Constraints

- **Video Sources:** Direct video file URLs only (`.mp4`, `.webm`, S3/R2/CDN links) rendered via native HTML5 `<video>`. No YouTube/Vimeo/TikTok scraping, embedding, or proxy servers in v1.
- **Hover Autoplay:** Hovered cards play immediately, muted (`muted`, `playsInline`, `loop`), at `playbackRate = 2.0`. Only one card plays at a time. Leaving a card pauses playback and resets `currentTime` to `0`.
- **Single Filter:** One single-select category/tag filter (`All`, derived categories, and `Uncategorized`). No multi-filter or boolean search in v1.
- **Click Action:** Clicking a card pauses any hover preview and opens an in-page lightbox modal playing at `1x` speed, unmuted, with native controls, category reassignment, copy/open link actions, and keyboard navigation (`Esc`, `←`, `→`).
- **Link Management & Persistence:** Users bulk-paste URLs (and optional category/title metadata) in the browser, validated with Zod, deduplicated, and stored in `localStorage` with JSON export/import backup.
- **Performance & Resilience:** Must handle 50–200+ links smoothly via lazy metadata loading (`IntersectionObserver`) and display graceful removable error tiles for broken/unplayable URLs. Must never rely on `<canvas>` thumbnail extraction (which breaks on cross-origin CDNs without CORS headers).
- **Explicit v1 Non-Goals:** User accounts/login, cloud database/sync, file upload/transcoding, comments/likes, video trimming/editing.

## Evidence on Hand

- Greenfield repository with no existing application code or user-provided video assets yet.
- First-run experience may include clearly labeled sample direct video links so the user can test `2x` hover-autoplay immediately before pasting their own list.

## Product Principles

1. **Videos are the interface:** Keep chrome minimal and restrained so clips remain the focal point from the first viewport.
2. **Instant scan, zero friction:** Hover-to-play at `2x` and click-to-inspect at `1x` must feel immediate, deterministic, and single-active.
3. **Resilient to messy real-world input:** Validate pasted lists and JSON imports strictly with Zod, deduplicate cleanly, and isolate broken URLs without disrupting the grid.
4. **Zero-backend simplicity:** Keep all state local and portable via JSON export/import; avoid unnecessary server routes or accounts in v1.

## Accessibility & Inclusion

- Keyboard-accessible filter pills, card activation (`Enter`/`Space`), and lightbox modal focus management with `Esc` close and `←`/`→` clip stepping.
- Respect `prefers-reduced-motion` for UI transitions while keeping explicit user-initiated video playback functional.
- Clear touch fallback on mobile/tablet where hover is unavailable (tap card to open lightbox).
