# WEWOW HOLOBOX — DESIGN SYSTEM TOOLING

Este documento describe herramientas internas de desarrollo/dirección de
arte. No confundir con la dirección visual del producto en sí (ver
`ENGINE_SPEC.md` → VISUAL LANGUAGE, TRANSPARENT COMPOSITING PRINCIPLE,
TOUCH-FIRST / TOUCH-ONLY, etc.) ni con `.superdesign/design-system.md`
(historial de exploraciones visuales de los Design Checkpoints).

## Fullscreen Behavior

**Production Holobox:** el display físico es portrait 9:16. Cuando el
viewport (`100dvw`/`100dvh`) coincide exactamente con esa proporción, el
master canvas (`.holobox-canvas`) ocupa el 100% del viewport — fullscreen
real, sin letterbox, sin márgenes, sin scroll.

**Development:** cuando el viewport del navegador tiene otra proporción, el
canvas 9:16 completo se muestra escalado proporcionalmente y centrado
(letterbox), compartiendo el mismo negro base que el resto de la
composición (no es un fondo nuevo — sigue siendo la ausencia/transparencia
del TRANSPARENT COMPOSITING PRINCIPLE). El layout interno NUNCA se
reorganiza según el viewport — no hay responsive breakpoints; todo escala
de forma continua vía container query units (`cqw`/`cqh`).

Implementación: `src/layout/HoloboxStage.tsx` + `.holobox-viewport`/
`.holobox-canvas` en `src/App.css`. La fórmula clave:

```css
width: min(100dvw, calc(100dvh * 9 / 16));
```

converge matemáticamente a `100dvw` (y por `aspect-ratio: 9/16`, a
`100dvh`) cuando el viewport ya es 9:16 — fullscreen exacto sin necesitar
ninguna rama condicional.

## Development Design Controls

**Propósito:** panel de dirección de arte para iterar rápido sobre
parámetros visuales de S1 (y algunos globales) sin editar CSS/código a
mano durante producción de contenido.

**Tecla:** `D` abre/cierra el panel (se ignora si el foco está en un
input/textarea/select, para no interferir con la escritura dentro del
propio panel).

**No forma parte del Holobox UI.** Vive fuera del master canvas 9:16, como
overlay fijo anclado al viewport del navegador (columna a la derecha).

**Excluido del build de producción:** el panel (`src/dev/DesignControls.tsx`,
`src/dev/DesignControlsRoot.tsx`, `src/dev/designControls.css`) se carga
únicamente vía `import()` dinámico, gateado por `import.meta.env.DEV`
(constante de compilación de Vite/Rollup). En `npm run build`, esa rama se
vuelve código muerto y se elimina del bundle — verificado: `dist/` no
contiene ninguna referencia a `DesignControls`/`dc-section`, y la tecla D
no hace nada en el preview de producción (`npm run preview`).

Lo que SÍ se incluye en producción es el **sistema de configuración**
(`src/config/designConfig.ts`) — porque los componentes de producto
(S0/S1/S2/PersonPresence) necesitan leerlo siempre. En producción esos
valores son simplemente los defaults aprobados y congelados (nadie los
muta, porque el único lugar que los muta es el panel dev-only).

### Parámetros disponibles

**Glass:** glass opacity, glass blur, border opacity, highlight intensity,
shadow intensity, card radius.

**Cards:** card scale, horizontal gap, vertical gap, internal padding, icon
scale, navigation indicator scale.

**Layout:** menu vertical position, grid width, header scale, header/menu
spacing, footer/hint position.

**Yellow Light:** yellow glow intensity, yellow accent opacity, selected
glow intensity.

**Ambient Motion:** on/off, movement distance, movement speed.

**Particles:** on/off, count, opacity, speed, size — sistema preparado y
**apagado por defecto** (ver más abajo).

**Transition:** global transition speed multiplier, touch glow intensity.

**Debug State:** `LIVE` / `S0` / `S1` / `S2` — override de **solo
renderizado** para inspección visual rápida sin recorrer el flujo
manualmente. No modifica `useHoloboxController` (el state controller real
sigue intacto); los handlers de touch (`enter`, `selectUnit`,
`returnToMenu`) siguen operando sobre el estado real y se auto-protegen si
no coincide con la pantalla forzada — por eso forzar una vista sirve para
mirar composición/spacing, pero para probar la interacción real hay que
volver a `LIVE`. Forzar `S2` sirve para ver el video en CLEAR directamente
(útil para probar assets) — S2 no tiene ningún control propio en este
panel (glass/typography/border/glow de identidad): esos controles nunca
existieron, porque S2 no tiene ninguna UI de identidad que ajustar (ver
ENGINE_SPEC.md → S2_PERSON: "video/person experience puro").

**Reset / Copy:** `RESET DESIGN` vuelve todos los valores a los defaults
aprobados (los defaults son literalmente el diseño ya shippeado — todo
multiplicador parte de 1, todo offset parte de 0). `COPY CONFIG` copia el
JSON del config actual al portapapeles, para poder convertir ajustes
aprobados en nuevos defaults manualmente.

### Cómo funciona técnicamente

- Los parámetros CSS (Glass, Cards, Layout, Yellow) se aplican como CSS
  custom properties en `:root` (`document.documentElement.style.setProperty`)
  y el CSS de producto los consume vía `calc(<valor base> * var(--token, 1))`
  — el fallback (`1` o `0px`) es siempre el diseño aprobado, así que si la
  custom property nunca se define (producción), el resultado es idéntico
  al diseño actual, sin costo.
- Los parámetros JS-driven (Ambient Motion, Particles, Transition) se leen
  vía el hook `useDesignConfig()` directamente en los componentes
  (`S0Idle`, `S1Menu`, `PersonPresence`, `AmbientParticles`) y
  escalan/activan sus animaciones de Motion. S2 no tiene componente propio
  (ver nota abajo) — `PersonPresence` cubre también su parámetro de
  transición.
- Store: un pub-sub minimalista sobre `useSyncExternalStore` (nativo de
  React, sin dependencias nuevas) — `src/config/designConfig.ts` y
  `src/config/debugState.ts`.

### Sistema de partículas — preparado, no activo

`AmbientParticles` (`src/layout/AmbientParticles.tsx`) vive DETRÁS de las
glass cards, dentro del canal transparente del Holobox (mismo `z-index`
que la capa de persona/video) — nunca como fondo fullscreen con color
propio. Está **desactivado por defecto** (`particles.enabled: false` en
`DEFAULT_DESIGN_CONFIG`) porque no forma parte de la dirección visual
aprobada todavía; el panel permite activarlo/ajustarlo para evaluación
durante desarrollo.

## Comportamiento touch-only del panel (nota)

El panel DesignControls es una herramienta de mouse/teclado para
desarrollo — no está sujeto a las reglas TOUCH-FIRST / TOUCH-ONLY del
producto (esas aplican al Holobox UI, no a este tooling).
