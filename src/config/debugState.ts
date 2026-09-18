import { useSyncExternalStore } from "react";
import type { HoloboxState } from "../state/useHoloboxController";

/**
 * Override de RENDERIZADO para el panel de Debug State (dev-only, ver
 * src/dev/DesignControls.tsx). NO modifica el state controller real
 * (useHoloboxController) — App.tsx solo decide QUÉ PANTALLA MOSTRAR en
 * base a este valor cuando existe, pero los handlers de touch (enter,
 * selectUnit, returnToMenu) siguen operando sobre el estado real del
 * controller, que se auto-protege si no coincide con la pantalla forzada
 * (ver App.tsx). Por eso forzar una vista es solo para inspección visual;
 * para probar la interacción real hay que volver a "LIVE".
 *
 * El setter solo es invocado desde el panel dev-only, así que en
 * producción este valor permanece `null` para siempre.
 */
let current: HoloboxState | null = null;
const listeners = new Set<() => void>();

export function getDebugStateOverride(): HoloboxState | null {
  return current;
}

/** Solo usado por el panel dev-only. */
export function setDebugStateOverride(value: HoloboxState | null): void {
  current = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDebugStateOverride(): HoloboxState | null {
  return useSyncExternalStore(subscribe, getDebugStateOverride, getDebugStateOverride);
}
