import { motion } from "motion/react";
import { useDesignConfig } from "../config/designConfig";

interface S0IdleProps {
  onEnter: () => void;
}

/**
 * TASK 003. Sin background diseñado (TRANSPARENT COMPOSITING PRINCIPLE).
 * Único input: touch/click en cualquier parte (TOUCH-FIRST / TOUCH-ONLY —
 * sin hover, sin CSS :hover). El único movimiento antes del touch es ambient
 * motion extremadamente sutil (breathing del logo + halo amarillo), nunca
 * anticipación de selección. Duraciones escaladas por
 * `transition.speedMultiplier` (ver DESIGN CONTROLS, designConfig.ts).
 */
export function S0Idle({ onEnter }: S0IdleProps) {
  const { transition } = useDesignConfig();
  const speed = transition.speedMultiplier;

  return (
    <div className="screen screen-s0" onClick={onEnter}>
      <div className="s0-logo-wrap">
        <motion.div
          className="s0-logo-halo"
          animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.96, 1.05, 0.96] }}
          transition={{ duration: 7 * speed, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          className="s0-logo"
          src="/branding/wewow-logo.png"
          alt="WeWow"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 8 * speed, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.p
        className="s0-hint"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 3.5 * speed, repeat: Infinity, ease: "easeInOut" }}
      >
        Toca para comenzar
      </motion.p>
    </div>
  );
}
