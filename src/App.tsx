import { Suspense, lazy, useEffect, useState } from "react";
import "./App.css";
import { useHoloboxController } from "./state/useHoloboxController";
import { HoloboxStage } from "./layout/HoloboxStage";
import { PersonPresence, type PersonMode } from "./layout/PersonPresence";
import { AmbientParticles } from "./layout/AmbientParticles";
import { S0Idle } from "./screens/S0Idle";
import { S1Menu } from "./screens/S1Menu";
import { Transition } from "./screens/Transition";
import { useDebugStateOverride } from "./config/debugState";

/**
 * Panel de dirección de arte — DEV ONLY. `import.meta.env.DEV` es una
 * constante de compilación (Vite/Rollup); en build de producción esta rama
 * se vuelve código muerto y se elimina del bundle final (verificar con
 * `npm run build` + inspección de dist/, ver PROJECT_CONTEXT.md).
 */
const DesignControlsRoot = import.meta.env.DEV
  ? lazy(() => import("./dev/DesignControlsRoot"))
  : null;

export default function App() {
  const { state: realState, units, selectedUnit, enter, selectUnit, returnToMenu } =
    useHoloboxController();

  // Override de renderizado SOLO para el panel de debug state (dev-only).
  // NUNCA se activa en producción (ver src/config/debugState.ts).
  const debugOverride = useDebugStateOverride();
  const state = import.meta.env.DEV && debugOverride ? debugOverride : realState;

  // Señal local de "touch ya empezó" — permite que PersonPresence comience a
  // revelar a la persona en sincronía con la secuencia de S1Menu, ANTES de
  // que el controller formalmente entre en T_UNIT_ENTER (ver PersonPresence.tsx).
  const [touchedUnitId, setTouchedUnitId] = useState<string | null>(null);

  useEffect(() => {
    if (state === "S1_MENU") setTouchedUnitId(null);
  }, [state]);

  const personUnit =
    selectedUnit ?? units.find((unit) => unit.id === touchedUnitId) ?? units[0] ?? null;

  const personMode: PersonMode =
    state === "S0_IDLE"
      ? "hidden"
      : state === "S2_PERSON"
        ? "clear"
        : state === "T_UNIT_ENTER" || (state === "S1_MENU" && touchedUnitId)
          ? "clearing"
          : "frosted"; // S1_MENU sin touch todavía, o T_RETURN

  return (
    <>
      <HoloboxStage>
        <PersonPresence unit={personUnit} mode={personMode} onVideoEnd={returnToMenu} />
        <AmbientParticles />
        {renderScreen()}
      </HoloboxStage>
      {import.meta.env.DEV && DesignControlsRoot && (
        <Suspense fallback={null}>
          <DesignControlsRoot />
        </Suspense>
      )}
    </>
  );

  function renderScreen() {
    switch (state) {
      case "S0_IDLE":
        return <S0Idle onEnter={enter} />;
      case "S1_MENU":
        return (
          <S1Menu
            units={units}
            onTouchStart={setTouchedUnitId}
            onSelectUnit={selectUnit}
          />
        );
      case "T_UNIT_ENTER":
      case "T_RETURN":
        return <Transition />;
      case "S2_PERSON":
        // S2 = video/person experience puro (ver ENGINE_SPEC.md → S2_PERSON).
        // No hay pantalla propia: PersonPresence (siempre montado arriba) ya
        // renderiza el video en CLEAR — no hay identity card ni botón de
        // regreso manual. El auto-return corre por PersonPresence.onEnded →
        // onVideoEnd → returnToMenu, sin intervención del usuario.
        return null;
    }
  }
}
