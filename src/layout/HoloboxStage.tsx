import type { ReactNode } from "react";

interface HoloboxStageProps {
  children: ReactNode;
}

/**
 * HOLOBOX MASTER CANVAS — portrait 9:16 (ver ENGINE_SPEC.md).
 *
 * Todos los estados (S0/S1/S2/Transition) se montan DENTRO de este canvas
 * de proporción fija 9:16, nunca directamente contra el viewport del
 * navegador. Cuando el viewport físico YA es 9:16 (el Holobox real en
 * producción), el canvas ocupa el 100% exacto del viewport — fullscreen
 * real, sin letterbox (ver App.css: `width: min(100dvw, 100dvh*9/16)`
 * converge a 100dvw×100dvh cuando la proporción coincide). Cuando el
 * viewport tiene otra proporción (development), el canvas se escala
 * proporcionalmente y se centra (letterbox), pero jamás se reorganiza — no
 * hay breakpoints, solo escala continua vía container query units
 * (cqw/cqh) en App.css.
 *
 * El área fuera del canvas (si el browser no es 9:16) y el propio canvas
 * comparten el mismo negro base — no es un "fondo diseñado" nuevo, sigue
 * siendo la ausencia/transparencia del TRANSPARENT COMPOSITING PRINCIPLE.
 */
export function HoloboxStage({ children }: HoloboxStageProps) {
  return (
    <div className="holobox-viewport">
      <div className="holobox-canvas">{children}</div>
    </div>
  );
}
