# Pages

Only one "page" exists in the codebase today (no router — see `routes.md`).

## / (root — temporary diagnostic screen)

Entry: `src/main.tsx`
Dependencies:
- `src/App.tsx` (default export, mounted directly)
  - `src/App.css` (styles)
  - `motion/react` (external, `motion.header` fade-in only)
  - `public/branding/wewow-logo.png` (static asset, not a component)
  - `public/videos/wewow-at-work-carlos-landa.mp4` (static asset, not a component)
- `src/index.css` (global reset, imported in `main.tsx`)

This screen will be **discarded**, not extended — it exists only to prove the Vite/React/TS + asset pipeline works (TASK 001). It is not a candidate anchor page for reproduction.

## Target for this design checkpoint: S0_IDLE and S1_MENU

Neither exists in code yet — this is new-target design work (no reproduction step applies). See `ENGINE_SPEC.md` at the repo root for full functional requirements of each state, and `PROJECT_CONTEXT.md` for confirmed client content (7 business units, only "WeWow At Work!" / Carlos Landa / "Head WeWow At Work!" confirmed; other 6 units are demo placeholders).
