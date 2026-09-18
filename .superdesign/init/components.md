# Components

## Framework detection

- Framework: React 19 (via `react`, `react-dom`)
- Meta-framework: none — plain Vite SPA (`vite`, `@vitejs/plugin-react`)
- Component library: none — no shadcn/ui, MUI, Chakra, Radix, Ant Design
- CSS approach: vanilla CSS (plain `.css` files imported per-component), no Tailwind, no CSS Modules, no styled-components
- Motion library installed: `motion` (Motion for React) — not yet used beyond a single fade-in on the temp diagnostic screen

## Shared UI primitives

**None exist yet.** This is a fresh project (TASK 001 — Project Foundation just completed). The only UI in the repo today is a single temporary diagnostic screen (`src/App.tsx`) that will be discarded once real screens (S0/S1/S2) are built.

The one local sub-component in that screen is a trivial inline status-row renderer, included below for completeness — it is NOT a durable design-system primitive, just scaffolding:

### `StatusRow` (inline in `src/App.tsx`)

```tsx
function StatusRow({
  label,
  status,
}: {
  label: string;
  status: AssetStatus;
}) {
  return (
    <div className={`status-row status-${status}`}>
      <span className="status-dot" />
      <span>{label}</span>
    </div>
  );
}
```

No Button, Card, Input, Dialog, Select, Tabs, etc. exist in the codebase. Any of these needed for S0/S1/S2 will be designed fresh as part of this design checkpoint.
