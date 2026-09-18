# Layouts

**No shared layout components exist yet.** There is no nav bar, sidebar, header, footer, breadcrumb, or layout wrapper/HOC anywhere in the codebase.

This is intentional: the product is not a website — it is a single-viewport, fullscreen, vertical touchscreen installation (Holobox) that swaps between states (S0_IDLE → S1_MENU → S2_PERSON), not between routed "pages" with a persistent chrome. See `ENGINE_SPEC.md` at the repo root for the state model.

## Root shell (`src/main.tsx`)

The entire app shell today is just a React root mount, no providers, no router, no layout wrapper:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

## Current root component (`src/App.tsx`) — TEMPORARY, to be replaced

`App.tsx` currently renders only the TASK 001 technical diagnostic screen (verifies React mount, logo load, video load/playback, click/touch). It is not representative of the final product UI and will be replaced by the real state machine (S0/S1/S2) in TASK 002+. Full source:

```tsx
import { useRef, useState } from "react";
import { motion } from "motion/react";
import "./App.css";

type AssetStatus = "loading" | "ok" | "error";

export default function App() {
  const [logoStatus, setLogoStatus] = useState<AssetStatus>("loading");
  const [videoStatus, setVideoStatus] = useState<AssetStatus>("loading");
  const [clicks, setClicks] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function handleContainerClick() {
    setClicks((count) => count + 1);
  }

  return (
    <div className="diagnostic-viewport" onClick={handleContainerClick}>
      <motion.header
        className="diagnostic-header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>WeWow Holobox — Foundation Check</h1>
        <p>Pantalla técnica temporal · TASK 001</p>
      </motion.header>

      <section className="diagnostic-status">
        <StatusRow label="React montado" status="ok" />
        <StatusRow label="Logo" status={logoStatus} />
        <StatusRow label="Video" status={videoStatus} />
        <StatusRow
          label={`Clicks/touches detectados: ${clicks}`}
          status={clicks > 0 ? "ok" : "loading"}
        />
      </section>

      <section className="diagnostic-asset">
        <img
          className="diagnostic-logo"
          src="/branding/wewow-logo.png"
          alt="WeWow logo"
          onLoad={() => setLogoStatus("ok")}
          onError={() => setLogoStatus("error")}
        />
      </section>

      <section className="diagnostic-asset">
        <video
          ref={videoRef}
          className="diagnostic-video"
          src="/videos/wewow-at-work-carlos-landa.mp4"
          playsInline
          muted
          onCanPlay={() => setVideoStatus("ok")}
          onError={() => setVideoStatus("error")}
          onClick={(event) => {
            event.stopPropagation();
            toggleVideo();
          }}
        />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleVideo();
          }}
        >
          {isPlaying ? "Pausar video" : "Reproducir video"}
        </button>
      </section>
    </div>
  );
}
```

## Constraints that stand in for a design system (from `CLAUDE.md` / `ENGINE_SPEC.md`)

- Deep black environment, subtle glass, restrained transparency, thin borders, controlled highlights, depth, premium typography, generous spacing, large touch targets, subtle ambient motion.
- Avoid: dashboard aesthetic, generic website UI, excessive glassmorphism, unnecessary UI chrome.
- Fullscreen, vertical viewport, touch + mouse, 60 FPS target, offline.
