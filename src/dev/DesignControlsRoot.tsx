import { useEffect, useState } from "react";
import { DesignControls } from "./DesignControls";

/**
 * Punto de entrada dev-only del panel — este módulo completo (incluyendo
 * DesignControls.tsx y designControls.css) solo se carga vía import()
 * dinámico desde App.tsx, gateado por `import.meta.env.DEV`. En build de
 * producción esa rama es código muerto: Vite/Rollup la eliminan y este
 * chunk nunca se solicita ni se ejecuta.
 *
 * Responsable de:
 * - escuchar la tecla D (abrir/cerrar), ignorando cuando el foco está en
 *   un input/textarea/select/contentEditable (evita conflictos al escribir
 *   dentro del propio panel).
 * - montar/desmontar <DesignControls> según el estado open.
 */
export default function DesignControlsRoot() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "d" && event.key !== "D") return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      setOpen((prev) => !prev);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!open) return null;
  return <DesignControls onClose={() => setOpen(false)} />;
}
