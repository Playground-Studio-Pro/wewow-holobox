import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { BusinessUnit } from "../types";
import { useDesignConfig } from "../config/designConfig";

export type PersonMode = "hidden" | "frosted" | "clearing" | "clear";

interface PersonPresenceProps {
  unit: BusinessUnit | null;
  mode: PersonMode;
  onVideoEnd?: () => void;
}

const TARGETS: Record<
  PersonMode,
  { opacity: number; blur: number; contrast: number }
> = {
  hidden: { opacity: 0, blur: 30, contrast: 0.8 },
  // TASK 007: la persona NO debe ser visible en S1 idle — el canal
  // permanece transparente, sin silueta humana blurred de fondo. "frosted"
  // sigue siendo el lenguaje del material (mismo blur/contraste "fríos" que
  // antes) pero ahora arranca completamente invisible (opacity 0), igual
  // que "hidden". El nombre del modo se conserva por continuidad conceptual
  // con FROSTED → CLEAR, aunque su resultado visual en reposo es invisible.
  frosted: { opacity: 0, blur: 30, contrast: 0.8 },
  clearing: { opacity: 0.9, blur: 6, contrast: 0.92 },
  clear: { opacity: 1, blur: 0, contrast: 1 },
};

/**
 * Capa de persona/video ÚNICA y persistente (HUMAN PRESENCE, ver
 * ENGINE_SPEC.md). Vive detrás de S1/S2 dentro del mismo canvas 9:16 y
 * NUNCA se desmonta entre estados — así el video jamás reinicia ni "corta"
 * al pasar de S1 a S2; solo cambian blur/opacity/contrast, con una
 * transición larga y suave.
 *
 * TASK 007 — dirección final: Carlos está completamente OCULTO durante
 * S1_MENU (ni siquiera blurred de fondo — el canal permanece transparente,
 * sin ninguna silueta humana). Solo empieza a revelarse ("fades/reveals
 * into the transparent stage") en el mismo instante del touch, en paralelo
 * con la secuencia local de `S1Menu` (glass reacts → menu clears →
 * selected unit activates), y llega a CLEAR total en S2.
 *
 * - En S1 (frosted) el video hace loop ambiental, muted, pero invisible.
 * - Al tocar una unidad (clearing) empieza a aparecer/enfocar.
 * - Al pasar a clear (S2) se desmutea el video YA reproduciéndose (no
 *   requiere nuevo gesto) y, cuando termina naturalmente, dispara
 *   `onVideoEnd` (auto-return al menú, ver ENGINE_SPEC.md → Video behavior).
 * - Al volver a frosted se resetea a 0 (ENGINE_SPEC: "debe resetearse al
 *   regresar al menú"), retoma el loop ambiental y vuelve a desaparecer
 *   por completo ("Carlos fades out → glass menu reforms").
 */
export function PersonPresence({ unit, mode, onVideoEnd }: PersonPresenceProps) {
  const { transition } = useDesignConfig();
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevModeRef = useRef<PersonMode>(mode);
  const prevVideoSrcRef = useRef<string | undefined>(unit?.video);

  // Reset explícito al cambiar de unidad — no confiar únicamente en el
  // cambio implícito de `src` del navegador. `load()` garantiza que el
  // <video> descarta cualquier estado del recurso anterior (currentTime,
  // buffer) y arranca limpio desde 0 con el nuevo archivo, sin importar
  // el motor/engine exacto del Holobox. Se ejecuta ANTES que el efecto de
  // `mode` (definido debajo) para que un `play()` posterior no compita con
  // este reset. Nunca se le agrega cache-busting al URL — son assets
  // locales estáticos, no hay razón real para invalidar cache.
  useEffect(() => {
    if (prevVideoSrcRef.current === unit?.video) return;
    prevVideoSrcRef.current = unit?.video;
    const video = videoRef.current;
    if (!video) return;
    video.load();
    if (mode !== "hidden") {
      video.play().catch(() => {});
    }
    // Deliberadamente solo depende de unit?.video: este efecto reacciona a
    // CAMBIOS DE FUENTE, no a cambios de mode (mode se lee del closure con
    // su valor más reciente en el momento en que el efecto corre).
  }, [unit?.video]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = mode !== "clear";
  }, [mode]);

  useEffect(() => {
    const enteringFrosted = mode === "frosted" && prevModeRef.current !== "frosted";
    prevModeRef.current = mode;
    if (!enteringFrosted) return;
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  }, [mode]);

  function handleEnded() {
    const video = videoRef.current;
    if (!video) return;
    if (mode === "clear") {
      onVideoEnd?.();
      return;
    }
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  const target = TARGETS[mode];

  return (
    <motion.video
      ref={videoRef}
      className="person-video"
      src={unit?.video}
      autoPlay
      muted
      playsInline
      onEnded={handleEnded}
      initial={false}
      animate={{
        opacity: target.opacity,
        filter: `blur(${target.blur}px) contrast(${target.contrast})`,
      }}
      transition={{
        duration: (mode === "clear" || mode === "clearing" ? 1.8 : 1.2) * transition.speedMultiplier,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  );
}
