# Routes

**No router is installed** (no React Router, no file-based routing, no meta-framework). This is a single-page, single-viewport installation app, not a multi-route website.

Entry point: `index.html` → `src/main.tsx` → `src/App.tsx` (mounted at `#root`).

## Intended state model (not routes) — from `ENGINE_SPEC.md`

The product swaps between application STATES within one fullscreen viewport, not between URLs:

```
S0_IDLE
  ↓ touch
S1_MENU
  ↓ select unit
T_UNIT_ENTER
  ↓
S2_PERSON
  ↓ video end OR menu button
T_RETURN
  ↓
S1_MENU
```

- **S0_IDLE** — logo only, monumental, minimal, ambient motion. Entry point of the experience.
- **S1_MENU** — "BIENVENIDOS" + subtitle + 7 business-unit touch targets (data-driven, one confirmed: "WeWow At Work!"). **This is the primary target of the current design checkpoint.**
- **T_UNIT_ENTER** — transition from menu to person (future hero moment).
- **S2_PERSON** — single reusable PersonExperience, receives unit data (video, name, head name/title), "← MENÚ PRINCIPAL" button always visible.
- **T_RETURN** — return transition back to S1_MENU.

## Current implementation status

Only a temporary diagnostic screen exists at the app root (`src/App.tsx`, see `layouts.md`). None of S0/S1/S2 are implemented yet — they are the subject of ENGINE_TASKS.md TASK 003–006, which are gated behind this design checkpoint and TASK 002 (State Controller).
