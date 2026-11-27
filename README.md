# Parallel

A zero-account, desktop-first video reference light table for rapidly scanning direct video URLs (`.mp4`, `.webm`, CDN/S3/R2) at **`2×` speed on hover** and inspecting clips at **`1×` speed with sound** in an obsidian screening lightbox.

## Stack
* **Framework:** Next.js (App Router) + React + TypeScript
* **Styling:** Tailwind CSS v4 + design tokens (`src/styles/design-tokens.css`)
* **Validation:** Zod
* **Persistence:** Browser `localStorage` + JSON Export/Import
* **Deployment:** Vercel

## Local Development
```bash
pnpm install
pnpm run dev
```

Other scripts:
```bash
pnpm run typecheck
pnpm run build
```

## Documentation
* **Product Brief:** [docs/PRODUCT.md](./docs/PRODUCT.md)
* **Design System:** [docs/DESIGN.md](./docs/DESIGN.md)
* **Feature Docs:** [docs/features/README.md](./docs/features/README.md)

## Project Structure
```text
src/
├── app/                # Next.js App Router entry, layout, global styles
├── styles/             # Design tokens (CSS & JSON)
├── components/
│   ├── board/          # Header, category filter rail, video grid, cards, empty states
│   ├── modals/         # Bulk-paste / JSON drawer & 1x obsidian lightbox
│   └── ui/             # Semantic toast notifications
├── hooks/              # Hydration-safe localStorage board state hook
└── lib/                # Zod schemas, bulk URL parser, curated sample clips
```
