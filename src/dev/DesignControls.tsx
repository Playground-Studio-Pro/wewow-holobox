import { useState } from "react";
import "./designControls.css";
import {
  getDesignConfig,
  resetDesignConfig,
  updateDesignConfigValue,
  useDesignConfig,
  type DesignConfig,
} from "../config/designConfig";
import { setDebugStateOverride, useDebugStateOverride } from "../config/debugState";
import type { HoloboxState } from "../state/useHoloboxController";

interface DesignControlsProps {
  onClose: () => void;
}

const DEBUG_STATES: { label: string; value: HoloboxState | null }[] = [
  { label: "LIVE", value: null },
  { label: "S0", value: "S0_IDLE" },
  { label: "S1", value: "S1_MENU" },
  { label: "S2", value: "S2_PERSON" },
];

/**
 * Panel de dirección de arte — DEVELOPMENT ONLY (ver DesignControlsRoot.tsx
 * para el gate de import.meta.env.DEV + la tecla D). No forma parte del
 * Holobox UI: vive fuera del master canvas 9:16, como overlay fijo al
 * viewport del navegador.
 */
export function DesignControls({ onClose }: DesignControlsProps) {
  const config = useDesignConfig();
  const debugState = useDebugStateOverride();
  const [copied, setCopied] = useState(false);

  function slider(
    section: keyof DesignConfig,
    key: string,
    label: string,
    min: number,
    max: number,
    step: number,
  ) {
    const sectionValues = config[section] as unknown as Record<string, number>;
    const value = sectionValues[key];
    return (
      <label className="dc-row" key={`${section}-${key}`}>
        <span className="dc-row-label">
          <span>{label}</span>
          <span className="dc-row-value">{value}</span>
        </span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) =>
            updateDesignConfigValue(section, key, Number(event.target.value))
          }
        />
      </label>
    );
  }

  function toggle(section: keyof DesignConfig, key: string, label: string) {
    const sectionValues = config[section] as unknown as Record<string, boolean>;
    const value = sectionValues[key];
    return (
      <label className="dc-row dc-row-toggle" key={`${section}-${key}`}>
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => updateDesignConfigValue(section, key, event.target.checked)}
        />
        <span>{label}</span>
      </label>
    );
  }

  function handleCopy() {
    const json = JSON.stringify(getDesignConfig(), null, 2);
    navigator.clipboard
      ?.writeText(json)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <div className="design-controls">
      <div className="dc-header">
        <span>DESIGN CONTROLS</span>
        <button type="button" className="dc-close" onClick={onClose}>
          ✕
        </button>
      </div>
      <p className="dc-note">
        Development tooling · presiona D para abrir/cerrar · no forma parte
        del producto · excluido del build de producción.
      </p>

      <section className="dc-section">
        <h3>Debug State</h3>
        <div className="dc-state-buttons">
          {DEBUG_STATES.map((entry) => (
            <button
              key={entry.label}
              type="button"
              className={debugState === entry.value ? "dc-active" : ""}
              onClick={() => setDebugStateOverride(entry.value)}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <p className="dc-hint">
          Override solo de renderizado, para inspección visual rápida. El
          touch sigue reaccionando al estado real del controller — usa LIVE
          para probar el flujo interactivo real.
        </p>
      </section>

      <section className="dc-section">
        <h3>Glass</h3>
        {slider("glass", "opacity", "Glass opacity", 0, 2, 0.05)}
        {slider("glass", "blur", "Glass blur", 0, 2, 0.05)}
        {slider("glass", "borderOpacity", "Border opacity", 0, 2, 0.05)}
        {slider("glass", "highlightIntensity", "Highlight intensity", 0, 2, 0.05)}
        {slider("glass", "shadowIntensity", "Shadow intensity", 0, 2, 0.05)}
        {slider("glass", "cardRadius", "Card radius", 0, 2, 0.05)}
      </section>

      <section className="dc-section">
        <h3>Cards</h3>
        {slider("cards", "scale", "Card scale", 0.7, 1.3, 0.01)}
        {slider("cards", "gapX", "Horizontal gap", 0, 2, 0.05)}
        {slider("cards", "gapY", "Vertical gap", 0, 2, 0.05)}
        {slider("cards", "padding", "Internal padding", 0.5, 1.8, 0.05)}
        {slider("cards", "iconScale", "Icon scale", 0.5, 1.8, 0.05)}
        {slider("cards", "navScale", "Nav indicator scale", 0.5, 1.8, 0.05)}
      </section>

      <section className="dc-section">
        <h3>Layout</h3>
        {slider("layout", "menuVerticalOffset", "Menu vertical position", -80, 80, 1)}
        {slider("layout", "gridWidth", "Grid width", 0.7, 1.15, 0.01)}
        {slider("layout", "headerScale", "Header scale", 0.7, 1.4, 0.02)}
        {slider("layout", "headerSpacingExtra", "Header/menu spacing", -40, 80, 1)}
        {slider("layout", "footerOffset", "Footer/hint position", -40, 60, 1)}
      </section>

      <section className="dc-section">
        <h3>Yellow Light</h3>
        {slider("yellow", "glowIntensity", "Yellow glow intensity", 0, 2.5, 0.05)}
        {slider("yellow", "accentOpacity", "Yellow accent opacity", 0, 2, 0.05)}
        {slider("yellow", "selectedGlowIntensity", "Selected glow intensity", 0, 2.5, 0.05)}
      </section>

      <section className="dc-section">
        <h3>Ambient Motion</h3>
        {toggle("ambientMotion", "enabled", "Ambient motion ON/OFF")}
        {slider("ambientMotion", "distance", "Movement distance (px)", 0, 12, 0.5)}
        {slider("ambientMotion", "speed", "Movement speed ×", 0.3, 2.5, 0.05)}
      </section>

      <section className="dc-section">
        <h3>Particles</h3>
        {toggle("particles", "enabled", "Particles ON/OFF")}
        {slider("particles", "count", "Particle count", 0, 40, 1)}
        {slider("particles", "opacity", "Particle opacity", 0, 1, 0.02)}
        {slider("particles", "speed", "Particle speed ×", 0.3, 2.5, 0.05)}
        {slider("particles", "size", "Particle size (px)", 1, 6, 0.5)}
      </section>

      <section className="dc-section">
        <h3>Transition</h3>
        {slider("transition", "speedMultiplier", "Global transition speed ×", 0.2, 2.5, 0.05)}
        {slider("transition", "touchGlowIntensity", "Touch glow intensity", 0, 2.5, 0.05)}
      </section>

      <div className="dc-actions">
        <button type="button" className="dc-btn" onClick={() => resetDesignConfig()}>
          RESET DESIGN
        </button>
        <button type="button" className="dc-btn" onClick={handleCopy}>
          {copied ? "COPIED ✓" : "COPY CONFIG"}
        </button>
      </div>
    </div>
  );
}
