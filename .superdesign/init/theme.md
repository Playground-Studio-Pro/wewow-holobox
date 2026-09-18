# Theme

## Part 1 — Compact token summary

No formal design-token system exists yet (no Tailwind config, no CSS variables, no theme provider). What exists today is scaffolding CSS for the temporary diagnostic screen only. Treat the values below as **starting reference points, not a locked system** — this design checkpoint is explicitly meant to define the real visual direction.

**Colors observed in code today:**
| Use | Value |
|---|---|
| Background | `#05050a` (near-black) |
| Primary text | `#f5f5f5` |
| Status: ok | `#3ddc84` (green) |
| Status: error | `#ff4d4f` (red) |
| Status: loading | `#f5c542` (amber — close to but not the brand yellow) |
| Glass panel fill | `rgba(255,255,255,0.04)` |
| Glass panel border | `rgba(255,255,255,0.12)` |
| Button fill | `rgba(255,255,255,0.08)` / hover `rgba(255,255,255,0.14)` |
| Button border | `rgba(255,255,255,0.2)` |

**Brand identity (from logo asset, not yet expressed as CSS tokens):**
- WeWow logo (`public/branding/wewow-logo.png`) uses an orange/amber "We" wordmark + white "Wow!" wordmark on transparent background. The orange is the brand energy color — per `ENGINE_SPEC.md` it should be used as an **accent/energy color, not a dominant fill**.
- No official hex has been extracted from the logo file yet; approximate visually as a warm amber/orange (~`#F5A623`–`#FFA733` range). Treat as approximate until picked precisely from the logo asset.

**Typography:**
- Font stack: `system-ui, -apple-system, "Segoe UI", sans-serif` (no custom/brand typeface loaded yet)
- Header size: `clamp(1.1rem, 3vw, 1.6rem)` (diagnostic screen only, not representative of final premium typography)

**Spacing / radius / shadow:**
- Border radius: `12px` (panels), `8px` (video, buttons)
- No shadow system defined
- No breakpoint system defined (diagnostic screen uses `min(100%, 420px)` fluid widths and `100dvh`/`100dvw`)

## Part 2 — Raw source dumps

No `tailwind.config` exists (project intentionally does not use Tailwind — see `CLAUDE.md` architecture rules: no Tailwind, no component libraries).

### `src/index.css` (global reset)

```css
* {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background: #05050a;
  color: #f5f5f5;
  font-family:
    system-ui,
    -apple-system,
    "Segoe UI",
    sans-serif;
  overflow: hidden;
}
```

### `src/App.css` (diagnostic screen styles — temporary, not the final design system)

```css
.diagnostic-viewport {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  padding: 2rem 1.25rem;
  overflow-y: auto;
  cursor: pointer;
}

.diagnostic-header {
  text-align: center;
}

.diagnostic-header h1 {
  font-size: clamp(1.1rem, 3vw, 1.6rem);
  margin: 0 0 0.25rem;
}

.diagnostic-header p {
  margin: 0;
  opacity: 0.6;
  font-size: 0.85rem;
}

.diagnostic-status {
  width: min(100%, 420px);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 1rem;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #555;
  flex-shrink: 0;
}

.status-ok .status-dot {
  background: #3ddc84;
}

.status-error .status-dot {
  background: #ff4d4f;
}

.status-loading .status-dot {
  background: #f5c542;
}

.diagnostic-asset {
  width: min(100%, 420px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.diagnostic-logo {
  max-width: 220px;
  width: 60%;
  height: auto;
}

.diagnostic-video {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  cursor: pointer;
}

.diagnostic-asset button {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f5f5f5;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
}

.diagnostic-asset button:hover {
  background: rgba(255, 255, 255, 0.14);
}
```
