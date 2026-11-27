# Parallel — Feature Documentation

One document per implemented feature in **Parallel**.

* **Product Brief:** [PRODUCT.md](../../PRODUCT.md)
* **Design System:** [DESIGN.md](../../DESIGN.md) · [design-tokens.css](../../design-tokens.css)

## Features

| Feature | Doc | Key Files |
|---|---|---|
| `2×` Hover-Autoplay Video Grid | [hover-autoplay-grid.md](./hover-autoplay-grid.md) | `src/components/VideoGrid.tsx`, `src/components/VideoCard.tsx` |
| Single-Select Category Filter Bar | [category-filter-bar.md](./category-filter-bar.md) | `src/components/CategoryFilterBar.tsx`, `src/hooks/useVideoBoard.ts` |
| `1×` Obsidian Screening Lightbox | [screening-lightbox.md](./screening-lightbox.md) | `src/components/LightboxModal.tsx` |
| Bulk Link Import & Zod Validation | [bulk-import-and-validation.md](./bulk-import-and-validation.md) | `src/components/AddLinksDrawer.tsx`, `src/lib/schema.ts` |
| Local Persistence & JSON Export/Import | [persistence-and-json-sync.md](./persistence-and-json-sync.md) | `src/lib/schema.ts`, `src/hooks/useVideoBoard.ts`, `src/components/AddLinksDrawer.tsx` |
| Empty States & Sample Clips | [empty-states-and-samples.md](./empty-states-and-samples.md) | `src/components/EmptyState.tsx`, `src/lib/samples.ts` |
| Broken-Link Resilience & Notifications | [error-handling-and-toasts.md](./error-handling-and-toasts.md) | `src/components/VideoCard.tsx`, `src/components/ToastStack.tsx`, `src/app/layout.tsx` |
| Sticky Header & Accessibility | [header-and-accessibility.md](./header-and-accessibility.md) | `src/components/BoardHeader.tsx`, `src/app/globals.css` |
