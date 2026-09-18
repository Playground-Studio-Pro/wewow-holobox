import { useMemo, type CSSProperties } from "react";
import { useDesignConfig } from "../config/designConfig";

interface Particle {
  id: number;
  left: number; // %
  top: number; // %
  duration: number; // s (antes del multiplicador de velocidad)
  delay: number; // s
  drift: number; // px
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 6,
      drift: 10 + Math.random() * 18,
    });
  }
  return particles;
}

/**
 * Sistema de partículas ambientales — PREPARADO, no parte del diseño
 * aprobado todavía (apagado por defecto, ver designConfig.ts). Viven
 * DETRÁS de las glass cards, dentro del canal transparente del Holobox
 * (ver App.css → z-index), nunca como fondo fullscreen con color propio.
 *
 * CSS puro (@keyframes vía custom property por partícula), no Motion —
 * más barato para N elementos simultáneos, alineado con el principio de
 * performance (transform/opacity, sin filtros animados).
 */
export function AmbientParticles() {
  const { particles: config } = useDesignConfig();
  const particles = useMemo(() => generateParticles(config.count), [config.count]);

  if (!config.enabled || config.count === 0) return null;

  return (
    <div className="ambient-particles" aria-hidden="true">
      {particles.map((particle) => {
        const style: CSSProperties & { "--particle-drift"?: string } = {
          left: `${particle.left}%`,
          top: `${particle.top}%`,
          width: `${config.size}px`,
          height: `${config.size}px`,
          opacity: config.opacity,
          animationDuration: `${particle.duration * config.speed}s`,
          animationDelay: `${particle.delay}s`,
          "--particle-drift": `${particle.drift}px`,
        };
        return <span key={particle.id} className="ambient-particle" style={style} />;
      })}
    </div>
  );
}
