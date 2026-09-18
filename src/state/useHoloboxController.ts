import { useCallback, useEffect, useRef, useState } from "react";
import { businessUnits } from "../data/businessUnits";
import type { BusinessUnit } from "../types";

/**
 * Estados del flujo (ver ENGINE_SPEC.md → State model).
 * T_UNIT_ENTER y T_RETURN son transiciones, no pantallas finales — su
 * duración y motion real se definen en TASK 005 (Menu → Person Transition).
 */
export type HoloboxState =
  | "S0_IDLE"
  | "S1_MENU"
  | "T_UNIT_ENTER"
  | "S2_PERSON"
  | "T_RETURN";

/**
 * Placeholder durations — TASK 005/007 los ajustarán con motion real.
 * T_UNIT_ENTER es corto a propósito: S1Menu ya ejecuta su propia secuencia
 * FROSTED → TOUCH (glass compression, glow, blur de la persona) ANTES de
 * llamar a selectUnit(), así que este buffer solo cubre el hand-off visual
 * hacia S2, no la animación completa.
 */
export const T_UNIT_ENTER_MS = 150;
export const T_RETURN_MS = 400;

export function useHoloboxController() {
  const [state, setState] = useState<HoloboxState>("S0_IDLE");
  const [selectedUnit, setSelectedUnit] = useState<BusinessUnit | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const enter = useCallback(() => {
    if (state !== "S0_IDLE") return;
    setState("S1_MENU");
  }, [state]);

  const selectUnit = useCallback(
    (unitId: string) => {
      if (state !== "S1_MENU") return;
      const unit = businessUnits.find((u) => u.id === unitId && u.enabled);
      if (!unit) return;

      setSelectedUnit(unit);
      setState("T_UNIT_ENTER");
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setState("S2_PERSON");
      }, T_UNIT_ENTER_MS);
    },
    [state],
  );

  const returnToMenu = useCallback(() => {
    if (state !== "S2_PERSON") return;
    setState("T_RETURN");
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setState("S1_MENU");
      setSelectedUnit(null);
    }, T_RETURN_MS);
  }, [state]);

  return {
    state,
    units: businessUnits,
    selectedUnit,
    enter,
    selectUnit,
    returnToMenu,
  };
}
