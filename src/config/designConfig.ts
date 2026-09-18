import { useSyncExternalStore } from "react";

/**
 * DESIGN CONTROLS — configuración central de parámetros visuales ajustables.
 *
 * Este archivo NO es dev-only: se importa desde componentes de producto
 * (S1Menu, PersonPresence, S0Idle) porque ellos necesitan LEER estos
 * valores siempre (en producción son simplemente los defaults aprobados,
 * congelados). Lo que SÍ es dev-only es el panel que permite MODIFICARlos
 * en caliente — ver src/dev/DesignControls.tsx.
 *
 * S2 no tiene componente propio: es video/person experience puro,
 * renderizado íntegramente por PersonPresence (ver App.tsx / ENGINE_SPEC.md).
 *
 * Todos los valores "multiplicadores" (opacity/blur/scale/intensity/speed)
 * tienen 1 como default → 1× significa "sin cambio respecto al diseño
 * aprobado". Los valores de "offset"/posición tienen 0 como default → 0
 * significa "sin desplazamiento adicional". Esto hace que
 * `resetDesignConfig()` sea trivialmente correcto: los defaults SON el
 * diseño ya aprobado.
 */
export interface DesignConfig {
  glass: {
    opacity: number;
    blur: number;
    borderOpacity: number;
    highlightIntensity: number;
    shadowIntensity: number;
    cardRadius: number;
  };
  cards: {
    scale: number;
    gapX: number;
    gapY: number;
    padding: number;
    iconScale: number;
    navScale: number;
  };
  layout: {
    /** px — desplazamiento vertical adicional del grid de unidades */
    menuVerticalOffset: number;
    /** multiplicador del ancho máximo del grid respecto al área segura */
    gridWidth: number;
    headerScale: number;
    /** px — espacio extra entre el header y el grid, además del gap base */
    headerSpacingExtra: number;
    /** px — desplazamiento vertical adicional del hint inferior */
    footerOffset: number;
  };
  yellow: {
    glowIntensity: number;
    accentOpacity: number;
    selectedGlowIntensity: number;
  };
  ambientMotion: {
    enabled: boolean;
    /** px — distancia del drift vertical sutil en reposo */
    distance: number;
    /** multiplicador de duración (1 = velocidad actual) */
    speed: number;
  };
  particles: {
    enabled: boolean;
    count: number;
    opacity: number;
    /** multiplicador de duración (1 = velocidad base) */
    speed: number;
    /** px */
    size: number;
  };
  transition: {
    /** multiplica todas las duraciones de Motion en la app */
    speedMultiplier: number;
    /** intensidad del flash de glow al tocar (antes de comprometerse) */
    touchGlowIntensity: number;
  };
}

/**
 * Defaults aprobados — corresponden exactamente al diseño ya shippeado en
 * TASK 007 antes de esta herramienta (valores hardcodeados previos en
 * App.css/S1Menu.tsx). "RESET DESIGN" siempre vuelve aquí.
 */
export const DEFAULT_DESIGN_CONFIG: DesignConfig = {
  glass: {
    opacity: 1,
    blur: 1,
    borderOpacity: 1,
    highlightIntensity: 1,
    shadowIntensity: 1,
    cardRadius: 1,
  },
  cards: {
    scale: 1,
    gapX: 1,
    gapY: 1,
    padding: 1,
    iconScale: 1,
    navScale: 1,
  },
  layout: {
    menuVerticalOffset: 0,
    gridWidth: 1,
    headerScale: 1,
    headerSpacingExtra: 0,
    footerOffset: 0,
  },
  yellow: {
    glowIntensity: 1,
    accentOpacity: 1,
    selectedGlowIntensity: 1,
  },
  ambientMotion: {
    enabled: true,
    distance: 2,
    speed: 1,
  },
  particles: {
    // Sistema preparado, no activado por defecto — ver ENGINE_TASKS.md.
    enabled: false,
    count: 14,
    opacity: 0.35,
    speed: 1,
    size: 2,
  },
  transition: {
    speedMultiplier: 1,
    touchGlowIntensity: 1,
  },
};

function cloneDefaults(): DesignConfig {
  return JSON.parse(JSON.stringify(DEFAULT_DESIGN_CONFIG)) as DesignConfig;
}

let currentConfig: DesignConfig = cloneDefaults();
const listeners = new Set<() => void>();

/**
 * Aplica los valores CSS-consumibles del config como custom properties en
 * :root. Solo se invoca desde las funciones de escritura del store de
 * abajo, y esas únicamente son llamadas por el panel dev-only
 * (DesignControls) — en producción esta función nunca se ejecuta, así que
 * ninguna custom property llega a definirse y todo el CSS usa sus valores
 * de fallback (el diseño aprobado), sin costo alguno.
 */
function applyDesignConfigToDOM(config: DesignConfig): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement.style;
  root.setProperty("--glass-opacity", String(config.glass.opacity));
  root.setProperty("--glass-blur", String(config.glass.blur));
  root.setProperty("--glass-border-opacity", String(config.glass.borderOpacity));
  root.setProperty("--glass-highlight", String(config.glass.highlightIntensity));
  root.setProperty("--glass-shadow", String(config.glass.shadowIntensity));
  root.setProperty("--card-radius", String(config.glass.cardRadius));
  root.setProperty("--card-scale", String(config.cards.scale));
  root.setProperty("--card-gap-x", String(config.cards.gapX));
  root.setProperty("--card-gap-y", String(config.cards.gapY));
  root.setProperty("--card-padding", String(config.cards.padding));
  root.setProperty("--icon-scale", String(config.cards.iconScale));
  root.setProperty("--nav-scale", String(config.cards.navScale));
  root.setProperty("--menu-offset-y", `${config.layout.menuVerticalOffset}px`);
  root.setProperty("--grid-width", String(config.layout.gridWidth));
  root.setProperty("--header-scale", String(config.layout.headerScale));
  root.setProperty("--header-spacing-extra", `${config.layout.headerSpacingExtra}px`);
  root.setProperty("--footer-offset-y", `${config.layout.footerOffset}px`);
  root.setProperty("--yellow-glow", String(config.yellow.glowIntensity));
  root.setProperty("--yellow-accent-opacity", String(config.yellow.accentOpacity));
}

function emitChange(): void {
  applyDesignConfigToDOM(currentConfig);
  listeners.forEach((listener) => listener());
}

export function getDesignConfig(): DesignConfig {
  return currentConfig;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Solo usado por el panel dev-only. */
export function updateDesignConfigValue(
  section: keyof DesignConfig,
  key: string,
  value: number | boolean,
): void {
  currentConfig = {
    ...currentConfig,
    [section]: { ...currentConfig[section], [key]: value },
  };
  emitChange();
}

/** Solo usado por el panel dev-only. */
export function resetDesignConfig(): void {
  currentConfig = cloneDefaults();
  emitChange();
}

/**
 * Leído por componentes de producto (S0/S1/S2/PersonPresence) para valores
 * JS-driven (ambient motion, glow, transition speed) y por el panel
 * dev-only para reflejar el estado actual en los sliders.
 */
export function useDesignConfig(): DesignConfig {
  return useSyncExternalStore(subscribe, getDesignConfig, getDesignConfig);
}
