---
name: Parallel
description: Minimal, playful red-and-black studio light table for instant 2x video reference scanning.
colors:
  tally-red: "#D91E18"
  tally-red-deep: "#B51611"
  tally-red-bright: "#FF423B"
  tally-red-wash: "#FCECEB"
  carbon-ink: "#111113"
  ink-secondary: "#4B4A4E"
  ink-muted: "#636266"
  paper-canvas: "#F6F5F2"
  surface-card: "#FFFFFF"
  surface-well: "#ECEAE4"
  hairline-border: "#DCD9D0"
  screening-black: "#0E0E10"
  screening-surface: "#1A1A1E"
  screening-border: "#2C2C32"
  screening-muted: "#A4A3A8"
  signal-green: "#157A4B"
  signal-green-wash: "#E8F5EE"
  tape-amber: "#9A5B00"
  tape-amber-wash: "#FEF5E4"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  ui:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "0em"
  mono-badge:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.04em"
    fontFeature: "\"tnum\" 1"
rounded:
  badge: "6px"
  control: "8px"
  card: "10px"
  modal: "14px"
  pill: "9999px"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.tally-red}"
    textColor: "{colors.surface-card}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.tally-red-deep}"
    textColor: "{colors.surface-card}"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.carbon-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-well}"
    textColor: "{colors.carbon-ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.carbon-ink}"
    typography: "{typography.ui}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    height: "36px"
  filter-pill:
    backgroundColor: "{colors.surface-well}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    height: "34px"
  filter-pill-active:
    backgroundColor: "{colors.carbon-ink}"
    textColor: "{colors.surface-card}"
    typography: "{typography.ui}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    height: "34px"
  video-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.carbon-ink}"
    rounded: "{rounded.card}"
    padding: "0px"
  video-card-error:
    backgroundColor: "{colors.tally-red-wash}"
    textColor: "{colors.tally-red-deep}"
    rounded: "{rounded.card}"
    padding: "16px"
  tally-badge:
    backgroundColor: "{colors.tally-red}"
    textColor: "{colors.surface-card}"
    typography: "{typography.mono-badge}"
    rounded: "{rounded.badge}"
    padding: "5px 8px"
  input-field:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.carbon-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.card}"
    padding: "10px 14px"
---

# Design System: Parallel

## Overview

**Creative North Star: "The Tally Light Table"**

Parallel translates the tactile precision of a Swiss editing room and physical film light table into a fast, zero-account browser reference board. Most video tools default to heavy dark-slate toolbars that smother footage or generic social feeds full of chrome. Parallel flips the dynamic: at rest, the board is a crisp, archival off-white light table (`paper-canvas`) ruled in deep carbon ink (`carbon-ink`) so 50 to 200+ heterogeneous video clips sit side-by-side with zero visual friction.

Playfulness lives in kinetic feedback rather than decoration. Borrowing the red "on-air" tally light from broadcast monitors and the crisp click of hardware transport keys, a single Tally Red (`tally-red`) accent wakes up only when the user engages: hovering a clip illuminates its frame, flips on a live `2×` tally pill, and runs a 3px progress hairline along the bottom edge. Because only one clip plays at a time, the red tally becomes a moving spotlight that follows the user's eye across the grid. Clicking any clip dims the workspace into an Obsidian Screening Room (`screening-black`) for distraction-free `1×` playback with audio.

**Key Characteristics:**
- **Videos are the interface:** Compact 104px combined top chrome puts playable footage in the first viewport immediately.
- **Minimal at rest, playful in motion:** Quiet neutral surfaces pair with tactile pill buttons, crisp ink lips, and an unmistakable red `2×` tally state.
- **Two-room contrast:** Archival light-table browsing (`#F6F5F2`) transitions cleanly into an obsidian cinema lightbox (`#0E0E10`) on click.
- **Accessible by structure:** High-contrast ink-on-paper typography, tabular monospace indicators, visible focus rings, and touch-first mobile fallbacks.

## Colors

A disciplined red-and-black palette anchored on an archival light-table neutral, paired with a dedicated obsidian cinema surface for full-speed inspection.

### Primary
- **Tally Red** (`#D91E18`): Primary action fills (`+ Add Clips`, `Add to Board`), active `2×` hover card ring, live `2×` tally pill, playback progress hairline, and keyboard focus outlines. Achieves 5.06:1 contrast with white text and 4.66:1 on `paper-canvas`.
- **Tally Red Deep** (`#B51611`): Hover and pressed fills for primary red buttons, small red text links, and broken-clip error copy. Achieves 6.80:1 with white text and 6.26:1 on `paper-canvas`.
- **Tally Red Bright** (`#FF423B`): High-visibility red indicator used exclusively on dark `screening-black` lightbox surfaces (5.60:1 contrast).
- **Tally Red Wash** (`#FCECEB`): Subtle background tint for broken-URL error tiles and destructive hover fills.

### Neutral
- **Carbon Ink** (`#111113`): Primary headings, wordmark, selected category filter pill fill, structural button borders, and tactile bottom lips. Achieves 17.37:1 contrast on `paper-canvas`.
- **Ink Secondary** (`#4B4A4E`): Body copy, descriptions, inactive filter labels, and secondary metadata (8.08:1 on `paper-canvas`).
- **Ink Muted** (`#636266`): Timestamps, hostnames, clip counters, and keyboard shortcut hints (5.57:1 on `paper-canvas`).
- **Paper Canvas** (`#F6F5F2`): Global application background; softer than pure white so bright and dark video frames alike hold sharp edge definition.
- **Surface Card** (`#FFFFFF`): Elevated drawers, popovers, modal sheets, and secondary button fills.
- **Surface Well** (`#ECEAE4`): Unloaded video frames, inactive category pills, and recessed input surfaces.
- **Hairline Border** (`#DCD9D0`): Subtle 1px structural dividers and resting clip frame borders.
- **Screening Black** (`#0E0E10`): Lightbox modal backdrop and `1×` screening canvas.
- **Screening Surface** (`#1A1A1E`): Lightbox top/bottom utility bars and metadata controls, paired with **Screening Border** (`#2C2C32`) and **Screening Muted** (`#A4A3A8`, 7.74:1 on obsidian).

### Semantic
- **Signal Green** (`#157A4B` / wash `#E8F5EE`): Ephemeral toast confirmations (URL copied, JSON exported, clips added).
- **Tape Amber** (`#9A5B00` / wash `#FEF5E4`): Non-blocking Zod import notices (duplicate URLs skipped, partial batch warnings).
- **Broken Clip Error**: Uses **Tally Red Deep** (`#B51611`) on **Tally Red Wash** (`#FCECEB`) with a dashed cut-line border to separate failures cleanly from the solid active `2×` tally ring.

### Named Rules
**The 85/12/3 Tally Rule.** Keep 85% of every viewport in light-table neutrals, 12% in Carbon Ink for text and active pills, and at most 3% in Tally Red. Red's rarity is what makes the single active `2×` clip jump off the grid instantly.

**The Two-Room Rule.** Never mix dark cinema chrome into the light-table grid, and never open a white modal over a playing `1×` video. Browsing belongs on `paper-canvas`; sound-on inspection belongs in `screening-black`.

## Typography

**Display Font:** Bricolage Grotesque (fallback: `system-ui, sans-serif`)
**Body Font:** Figtree (fallback: `system-ui, sans-serif`)
**Label/Mono Font:** JetBrains Mono (fallback: `ui-monospace, monospace`)

**Character:** Bricolage Grotesque pairs Swiss structural clarity with subtle optical ink-traps and friendly bounce, supplying playful personality without ornament. Figtree keeps controls, filter pills, and modal copy effortless to scan, while JetBrains Mono anchors technical precision for `2×` badges, timecodes, URLs, and keyboard keycaps.

### Hierarchy
- **Display** (700, `clamp(2rem, 3.2vw, 2.5rem)`, line-height `1.08`, tracking `-0.03em`): Empty-board welcome headline only.
- **Headline** (700, `1.5rem` / 24px, line-height `1.2`, tracking `-0.02em`): Bulk-paste drawer title and modal headers.
- **Title** (700, `1.125rem` / 18px, line-height `1.3`, tracking `-0.015em`): Top bar wordmark and lightbox active clip title.
- **Body** (400–500, `0.9375rem` / 15px, line-height `1.55`, max-width `62ch`): Modal instructions, empty-state copy, and Zod validation feedback.
- **UI** (600, `0.875rem` / 14px, line-height `1.25`): Buttons, single-select category pills, and top navigation actions.
- **Label** (500, `0.8125rem` / 13px, line-height `1.35`): Single-line video card titles and compact category tags beneath thumbnails.
- **Mono Badge** (600, `0.75rem` / 12px, line-height `1`, tracking `0.04em`, `tabular-nums`): `2×` tally indicators, clip counts (`48`), timecodes, `SAMPLE` markers, and keyboard caps (`ESC`, `←`, `→`).

### Named Rules
**The Tabular Count Rule.** Every counter, playback rate (`2×`, `1×`), and timecode uses `JetBrains Mono` with `font-variant-numeric: tabular-nums` so numbers never shift width when filters or loops update.

## Layout

Parallel uses a full-width studio board layout (`max-width: 1600px`, centered) designed for rapid desktop scanning while collapsing gracefully on mobile.

- **Vertical Chrome Budget:** A `56px` sticky utility bar plus a `48px` sticky single-select category rail (`104px` combined) keeps video clips visible immediately in the first viewport with zero marketing hero above the board.
- **Outer Gutters:** `24px` on desktop (`>= 768px`), `16px` on mobile (`< 768px`).
- **Responsive Video Grid (`gap: 16px` desktop, `12px` mobile):**
  - `< 520px` (Mobile): 1 column (full-width `16:9` clips with tap-to-open play pill).
  - `520px – 899px` (Large mobile / Tablet): 2 columns.
  - `900px – 1199px` (Small desktop): 3 columns.
  - `1200px – 1519px` (Standard desktop): 4 columns.
  - `>= 1520px` (Wide studio monitor): 5 columns.
- **Spacing Rhythm:** Strict 4px base scale (`4, 8, 12, 16, 24, 32, 48, 64px`). Generous breathing room inside drawers/modals (`24px` padding) contrasts with crisp, tight card captions (`8px` top gap) so each label visually locks to its video frame.

## Elevation & Depth

Parallel avoids cloudy drop shadows on the light table in favor of **flat archival layering** paired with **crisp, tactile micro-lips** inspired by physical editing-deck switches. Surfaces remain flat at rest (`1px solid hairline-border`), and depth appears strictly as tactile feedback on interactive buttons, hovered cards, and elevated overlays.

### Shadow Vocabulary
- **Tactile Lip** (`box-shadow: 0 2px 0 #111113`): Resting bottom edge on primary and secondary pill buttons; collapses to `0 0 0 #111113` with `translateY(2px)` on press.
- **Tactile Lift** (`box-shadow: 0 3px 0 #111113`): Hover state for pill buttons (`translateY(-1px)`).
- **Tally Active Ring** (`box-shadow: 0 0 0 2px #D91E18, 0 8px 20px rgba(17, 17, 19, 0.10)`): Applied exclusively to the single hovered `2×` playing video card.
- **Drawer & Popover** (`box-shadow: 0 12px 32px rgba(17, 17, 19, 0.12)`): Floating bulk-paste sheet and menus over the light table.
- **Screening Room** (`box-shadow: 0 24px 64px rgba(14, 14, 16, 0.55)`): Elevated `1×` lightbox player frame.

### Named Rules
**The Flat-By-Default Rule.** Video cards carry zero drop shadow at rest. Elevation appears only on the single active hovered card or modal overlays, keeping a 200-clip grid visually calm and GPU-light.

## Shapes

A deliberate tension between **architectural media frames** and **playful tactile pills** defines the silhouette:
- **Interactive Actions & Filter Chips:** Full capsules (`9999px`) with crisp `1.5px` Carbon Ink borders on primary/secondary buttons — inviting, pressable, and unmistakably distinct from media thumbnails.
- **Video Frames & Inputs:** Gently cropped corners (`10px`) that echo mounted 35mm slides without clipping subtitles or corner details inside footage.
- **Overlays & Drawers:** Slightly softer `14px` corners (`modal`) framing multi-line URL forms and settings.
- **Badges & Keycaps:** Crisp `6px` corners (`badge`) for `2×` pills, `SAMPLE` tags, and keyboard hints (`ESC`, `←`, `→`).
- **Error Tiles:** `1.5px dashed` cut-line borders (`#B51611`) so broken URLs visually read like a spliced/missing film frame.

## Components

Every component is built around single-focus scanning, immediate feedback, and WCAG AA+ legibility.

### Buttons
- **Shape:** Full pill (`9999px`) for primary/secondary actions; `8px` radius for compact ghost/icon utilities.
- **Primary (`+ Add Clips`, `Add to Board`):** Tally Red (`#D91E18`) fill, white (`#FFFFFF`) bold UI text, `1.5px solid #111113` stroke, tactile `0 2px 0 #111113` lip, `40px` height (`44px` on touch).
- **Hover / Active / Focus:** Hover shifts fill to `#B51611` and lifts `-1px`; active presses down `+2px` collapsing the lip; keyboard focus displays a `2px solid #D91E18` outline with `2px` offset.
- **Secondary (`Export JSON`, `Import JSON`):** White (`#FFFFFF`) fill, `#111113` text, `1.5px solid #111113` stroke, tactile `0 2px 0 #111113` lip; hover fills `surface-well` (`#ECEAE4`).
- **Ghost / Destructive:** Transparent fill at rest; ghost hovers to `#ECEAE4` (`rgba(255,255,255,0.12)` in lightbox). Destructive uses `#B51611` text and hovers to `#FCECEB` fill.

### Chips
- **Style:** Single-select category filter pills (`9999px` radius, `34px` height, `6px 14px` padding) with an integrated `tabular-nums` count.
- **State:** Unselected uses `surface-well` (`#ECEAE4`) with `ink-secondary` (`#4B4A4E`). Selected switches to solid `carbon-ink` (`#111113`) with `#FFFFFF` text and a `6px` `tally-red` (`#D91E18`) indicator dot on the left.

### Cards / Containers
- **Corner Style:** `10px` radius on the `16:9` `<video>` media frame (`overflow: hidden`).
- **Background:** `surface-well` (`#ECEAE4`) behind loading `<video>` media; transparent below-frame caption bar (`36px` height) on `paper-canvas` showing single-line title + compact category tag.
- **Shadow Strategy:** Flat `1px solid #DCD9D0` at rest. On hover (`@media (hover: hover)`), lifts `-2px`, activates the `Tally Active Ring`, pops in the top-left `2×` Tally Badge, and animates a `3px` Tally Red progress hairline along the bottom edge of the video frame.
- **Touch / Mobile Fallback (`@media (hover: none)`):** Displays a quiet translucent black (`rgba(17,17,19,0.72)`) `▶` play pill in the bottom-right corner of the frame to indicate tap-to-open `1×` lightbox.
- **Error Tile Variant:** `16:9` container filled with `tally-red-wash` (`#FCECEB`), `1.5px dashed #B51611` border, broken-frame SVG icon, hostname/filename, concise failure reason, and inline `Retry` + `Remove` actions.

### Inputs / Fields
- **Style:** `10px` radius, `#FFFFFF` fill, `1.5px solid #DCD9D0` border, `10px 14px` padding. Bulk URL paste textarea uses `JetBrains Mono` (`13px`, `line-height: 1.6`) so multi-line `.mp4`/`.webm` links scan cleanly.
- **Focus:** Border transitions to `#111113` paired with a `0 0 0 3px rgba(217, 30, 24, 0.18)` focus halo.
- **Error / Validation:** Border turns `#B51611` with an inline Zod summary strip breaking down valid links, duplicates skipped, and unsupported URLs before submission.

### Navigation
- **Top Utility Bar:** `56px` sticky bar (`rgba(246, 245, 242, 0.92)` with `backdrop-filter: blur(10px)` and `1px solid #DCD9D0` bottom rule). Left: `‖ Parallel` wordmark + mono clip count pill. Right: `Import`, `Export`, and red `+ Add Clips` primary CTA. On mobile (`< 640px`), `Import` and `Export` collapse into a single `⋯` menu button (`44px × 44px`) beside `+ Add`.
- **Category Filter Rail:** `48px` sticky bar directly underneath, single-row horizontally scrollable (`overflow-x: auto`, hidden scrollbar, subtle right edge fade), with a quiet desktop scan hint (`Hover 2× · Click 1×`) aligned right.

### Lightbox Screening Modal
- **Behavior:** Clicking any clip pauses hover playback and opens a full-viewport `screening-black` (`#0E0E10` at 96% opacity) modal. The video plays at `1×` speed unmuted with native controls and `object-contain` so vertical, square, and wide clips remain uncropped.
- **Controls:** Top bar displays clip title, `SAMPLE` badge (if applicable), index (`14 / 48`), and `ESC` close button. Left/right viewport edges hold keyboard-linked `←` / `→` stepper buttons. Bottom bar provides inline Category reassignment dropdown, `Copy URL`, `Open Original`, and `Remove Clip`.

## Do's and Don'ts

### Do:
- **Do** keep video frames completely free of permanent text overlays, dark gradients, or player controls at rest so clips lead from pixel one.
- **Do** enforce single-active `2×` hover playback with Tally Red (`#D91E18`) border, `2×` badge, and 3px progress hairline—and immediately reset `currentTime = 0` on pointer leave.
- **Do** rely on native `<video preload="metadata">` gated by `IntersectionObserver` for thumbnails instead of `<canvas>` frame extraction.
- **Do** isolate broken or unplayable video URLs inside removable dashed red error tiles without interrupting neighboring clips.
- **Do** maintain a `44px × 44px` minimum touch target on mobile controls and show the resting `▶` tap indicator on `@media (hover: none)` devices.
- **Do** honor `prefers-reduced-motion: reduce` by removing hover lifts and badge spring animations while keeping explicit `2×`/`1×` video playback intact.

### Don't:
- **Don't** add a marketing hero section, login button, search bar, or multi-select filter drawer above the board in v1.
- **Don't** flood large backgrounds or card surfaces with Tally Red—keep red under 3% of the viewport so active states stay unmistakable.
- **Don't** use blurry SaaS drop shadows on resting grid cards or rounded `24px+` corners that crop into video corners.
- **Don't** open a white modal for `1×` video playback; always transition into the obsidian `screening-black` (`#0E0E10`) screening room.
- **Don't** require hover to inspect clips on touch devices; tapping any card on mobile must open the lightbox immediately.
