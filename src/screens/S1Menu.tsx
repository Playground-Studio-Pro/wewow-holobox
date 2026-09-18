import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { BusinessUnit } from "../types";
import { useDesignConfig } from "../config/designConfig";

interface S1MenuProps {
  units: BusinessUnit[];
  onTouchStart: (unitId: string) => void;
  onSelectUnit: (unitId: string) => void;
}

/**
 * Duración base de la secuencia local FROSTED → CLEAR antes de avisar al
 * controller (ver ENGINE_SPEC.md → T_UNIT_ENTER), escalada por
 * `transition.speedMultiplier` (ver designConfig.ts). Debe ser suficiente
 * para que el glass ya esté completamente disuelto/fuera de vista antes
 * del hand-off a S2 — así el cambio de estado nunca se percibe como corte.
 */
const TOUCH_SEQUENCE_BASE_MS = 1000;

/**
 * S1_MENU — WeWow visual spec final, TASK 007 (tech glass grid).
 * Persona/video vive en <PersonPresence> (capa persistente, ver
 * src/layout/PersonPresence.tsx) — S1Menu solo avisa cuándo empezar a
 * revelar a Carlos (`onTouchStart`); mientras no se toca, la persona
 * permanece completamente INVISIBLE (ver PersonPresence.tsx) — S1 es una
 * composición gráfica limpia sobre el canal transparente, sin silueta
 * humana de fondo, y sin ningún background diseñado (TRANSPARENT
 * COMPOSITING PRINCIPLE — el espacio entre cards sigue siendo transparente).
 *
 * Composición: logo + BIENVENIDOS arriba, tech glass grid de 2 columnas (7
 * unidades, la última centrada ocupando ambas columnas) al centro, hint de
 * touch abajo.
 *
 * Secuencia de touch (hero transition):
 * 1. compresión física inmediata del glass tocado (<100ms, whileTap) + un
 *    flash breve de glow (touchGlowIntensity, ver designConfig.ts)
 * 2. highlight óptico amarillo sostenido aparece (selectedGlowIntensity)
 * 3. CTAs no seleccionados se desvanecen y derivan lateralmente (según su
 *    columna) — "menu clears"
 * 4. el glass seleccionado se abre/disuelve (scale up + opacity → 0,
 *    desplazándose hacia arriba) — "selected unit activates"
 * 5–6. Carlos empieza a revelarse en el canal transparente en el mismo
 *    instante del touch, en paralelo (ver App.tsx → onTouchStart dispara
 *    personMode="clearing")
 * 7. encabezado y footer hint también se desvanecen — nada de decoración
 *    queda una vez que Carlos aparece
 * 8–9. tras completarse (duración escalada por speedMultiplier) se avisa
 *    al controller; para entonces el glass ya es invisible, así que el
 *    cambio de estado hacia S2_PERSON nunca se percibe como un corte de
 *    página.
 *
 * CERO hover / mouse interaction (TOUCH-FIRST / TOUCH-ONLY) — el único
 * input es touch/click, y toda animación de CTA dispara AL TOCAR, nunca
 * antes. El único movimiento pre-touch es un drift óptico muy lento y
 * escalonado por card (ambient motion, configurable/desactivable — ver
 * DESIGN CONTROLS —, nunca "floating" exagerado).
 */
export function S1Menu({ units, onTouchStart, onSelectUnit }: S1MenuProps) {
  const config = useDesignConfig();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const speed = config.transition.speedMultiplier;
  const ambient = config.ambientMotion;

  function handleTouch(unitId: string) {
    if (selectedId) return; // touch ya comprometido — ignorar más input
    setPressedId(null);
    setSelectedId(unitId);
    onTouchStart(unitId);
    timeoutRef.current = window.setTimeout(() => {
      onSelectUnit(unitId);
    }, TOUCH_SEQUENCE_BASE_MS * speed);
  }

  const enabledUnits = units.filter((unit) => unit.enabled);
  const touched = selectedId !== null;

  return (
    <div className="screen screen-s1">
      <motion.header
        className="s1-header"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: touched ? 0 : 1, y: 0 }}
        transition={{ duration: (touched ? 0.4 : 0.6) * speed, ease: "easeOut" }}
      >
        <img className="s1-logo" src="/branding/wewow-logo.png" alt="WeWow" />
        <h1>BIENVENIDOS</h1>
        <p>Conoce a las unidades de negocio que forman parte de nuestra organización.</p>
      </motion.header>

      <div className="s1-grid">
        {enabledUnits.map((unit, index) => {
          const isSelected = selectedId === unit.id;
          const isReceding = touched && !isSelected;
          const isPressed = pressedId === unit.id;
          const isLast = index === enabledUnits.length - 1;
          const column = index % 2;
          const driftX = column === 0 ? -22 : 22;

          const idleAnimate = {
            opacity: 1,
            scale: 1,
            x: 0,
            y: ambient.enabled ? [0, -ambient.distance, 0] : 0,
          };
          const idleTransition = {
            y: {
              duration: ambient.enabled ? (6 + (index % 3)) * ambient.speed : 0.5 * speed,
              repeat: ambient.enabled ? Infinity : 0,
              ease: "easeInOut" as const,
              delay: ambient.enabled ? index * 0.35 : 0,
            },
            opacity: { duration: 0.5 * speed, ease: "easeOut" as const },
            scale: { duration: 0.5 * speed, ease: "easeOut" as const },
            x: { duration: 0.5 * speed, ease: "easeOut" as const },
          } as const;
          const recedingAnimate = { opacity: 0, scale: 0.86, x: driftX, y: 0 };
          const recedingTransition = { duration: 0.55 * speed, ease: "easeOut" } as const;
          const selectedAnimate = { opacity: 0, scale: 1.14, x: 0, y: -50 };
          const selectedTransition = {
            duration: 0.75 * speed,
            delay: 0.18 * speed,
            ease: [0.22, 1, 0.36, 1] as const,
          };

          const glowTarget = isPressed
            ? config.transition.touchGlowIntensity
            : isSelected
              ? config.yellow.selectedGlowIntensity
              : 0.12;

          return (
            <div
              key={unit.id}
              className={`s1-grid-item${isLast ? " s1-grid-item--last" : ""}`}
            >
              <motion.button
                type="button"
                className="glass-unit"
                disabled={touched}
                onClick={() => handleTouch(unit.id)}
                onPointerDown={() => {
                  if (!touched) setPressedId(unit.id);
                }}
                onPointerUp={() => setPressedId(null)}
                onPointerLeave={() =>
                  setPressedId((current) => (current === unit.id ? null : current))
                }
                initial={{ opacity: 0, scale: 0.92 }}
                whileTap={
                  touched ? undefined : { scale: 0.94, transition: { duration: 0.08 * speed } }
                }
                animate={isSelected ? selectedAnimate : isReceding ? recedingAnimate : idleAnimate}
                transition={isSelected ? selectedTransition : isReceding ? recedingTransition : idleTransition}
              >
                <span className="glass-unit-highlight" />
                <span className="glass-unit-highlight-hot" />
                <span className="glass-unit-edge" />
                <motion.span
                  className="glass-unit-glow"
                  animate={{ opacity: glowTarget }}
                  transition={{ duration: 0.22 * speed, ease: "easeOut" }}
                />

                <div className="glass-unit-top">
                  <div className="glass-unit-index">
                    <span className="glass-unit-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="glass-unit-accent" />
                  </div>
                  <div className="glass-unit-icon-slot">
                    {unit.iconSrc ? (
                      <img
                        src={unit.iconSrc}
                        alt=""
                        className="glass-unit-icon-img"
                      />
                    ) : (
                      <span className="glass-unit-icon-placeholder" />
                    )}
                  </div>
                </div>

                <span className="unit-label">{unit.name}</span>

                <span className="glass-unit-nav" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      <motion.p
        className="s1-footer-hint"
        animate={touched ? { opacity: 0 } : { opacity: [0.35, 0.65, 0.35] }}
        transition={
          touched
            ? { duration: 0.3 * speed, ease: "easeOut" }
            : { duration: 3.5 * speed, repeat: Infinity, ease: "easeInOut" }
        }
      >
        TOCA UNA UNIDAD PARA EXPLORAR
      </motion.p>
    </div>
  );
}
