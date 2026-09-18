# WEWOW ENGINE TASKS

## MILESTONE 01 — FUNCTIONAL HOLOBOX PROTOTYPE

Objetivo:

Construir una vertical slice profesional para probar físicamente en el Holobox.

### TASK 001 — Project Foundation

Status: DONE

- scaffold frontend → Vite + React + TypeScript en la raíz del repo
- definir estructura mínima → `src/main.tsx`, `src/App.tsx`, `src/App.css`, `src/index.css`
- configurar development/build → `npm run dev`, `npm run build` (verificados)
- comprobar assets existentes → `public/branding/`, `public/videos/` servidos correctamente
- comprobar video playback → HTTP/range requests OK (200/206); reproducción visual no confirmada en el navegador automatizado usado para el check, pendiente verificación manual
- comprobar logo → carga correctamente (confirmado visualmente)
- mantener instalación reproducible → dependencias declaradas en package.json, sin configuración especial de máquina

Acceptance:
App inicia localmente sin errores. ✅ Cumplido (`npm run dev` y `npm run build` sin errores).

### TASK 002 — State Controller

Status: DONE

Implementado:

- `src/state/useHoloboxController.ts` — hook con los 5 estados (S0_IDLE, S1_MENU, T_UNIT_ENTER, S2_PERSON, T_RETURN) y las transiciones `enter()`, `selectUnit(id)`, `returnToMenu()`. T_UNIT_ENTER/T_RETURN son transitorios (placeholder 500ms/400ms — motion real es TASK 005).
- `src/types.ts` + `src/data/businessUnits.ts` — content model data-driven (BusinessUnit: id, name, headName, headTitle, video, enabled), 7 unidades, solo "wewow-at-work" con contenido confirmado.
- `src/screens/S0Idle.tsx`, `S1Menu.tsx`, `S2Person.tsx`, `Transition.tsx` — placeholders mínimos y neutros (sin background diseñado, sin hover, sin glassmorphism todavía — eso es TASK 003+). Un único `S2Person` reutilizable recibe la unidad seleccionada como prop, sin componentes S2A/S2B/S2C.
- `src/App.tsx` reescrito para renderizar según el estado del controller (reemplaza la pantalla de diagnóstico de TASK 001).

Verificado en navegador: flujo completo S0 → S1 → selección de unidad → T_UNIT_ENTER → S2 (con data correcta de la unidad) → toque en "← Menú principal" → T_RETURN → S1 → selección de una unidad distinta → S2 con data distinta. Sin errores en consola. `npm run build` y `npm run dev` sin errores.

Acceptance:
Puede recorrerse el flujo completo. ✅ Cumplido.

### TASK 003 — S0 Logo

Status: DONE

**Corrección aplicada:** todo el árbol (S0/S1/S2/Transition) ahora se monta dentro de `HoloboxStage` (`src/layout/HoloboxStage.tsx`) — un canvas maestro `aspect-ratio: 9/16` que escala vía letterbox (`width: min(100vw, 100dvh*9/16)`), en vez de llenar `100dvw/100dvh` del navegador directamente. Todas las medidas internas (paddings, gaps, font-size, border-radius, blur) se convirtieron de rem/vw/px sueltos a **container query units (cqw/cqh)** relativas a ese canvas (`container-type: size` en `.holobox-canvas`) — así escalan proporcionalmente con la resolución sin ningún breakpoint/reorganización. Verificado: `getBoundingClientRect()` del canvas da ratio exacto 0.5625 (9/16) en una ventana de desarrollo ancha (1280×619 → canvas 348×619, centrado, letterbox del mismo negro, sin fondo artificial). Ver ENGINE_SPEC.md → "HOLOBOX MASTER CANVAS — PORTRAIT 9:16".

Implementado (`src/screens/S0Idle.tsx`, estilos en `src/App.css`):

- SIN fondo diseñado (TRANSPARENT COMPOSITING PRINCIPLE — negro = transparencia, no superficie)
- logo WeWow suspendido, con halo de luz amarilla muy sutil detrás (Motion: opacity/scale breathing en loop, 7s)
- ambient motion extremadamente sutil únicamente: breathing del halo, float vertical del logo (±6px, 8s), hint text pulsante — nada anticipa selección, cero hover/CSS `:hover`
- touch/click → `onEnter` (mouse solo simula touch en dev)
- entrada a S1

No se creó attract animation avanzada (queda para iteración futura, según spec).

Acceptance: verificado visualmente en navegador — logo + halo + hint renderizan correctamente, toque avanza a S1.

### TASK 004 — S1 Business Unit Menu

Status: DONE

**Revisión post-feedback ("el video tiene que entrar mucho más suave, el UI apesta"):**

- **Video persistente (`src/layout/PersonPresence.tsx`, nuevo):** el `<video>` de la persona ya NO vive dentro de S1Menu/S2Person — es una capa única montada una sola vez en `App.tsx`/`HoloboxStage`, que nunca se desmonta entre S1↔S2↔S1. Antes, S2Person montaba su propio `<video>` fresco (reinicio/corte visible al entrar a S2); ahora es literalmente el mismo elemento DOM durante todo el ciclo — solo cambian `opacity`/`filter: blur()` vía Motion, con transición de 1.6s (entrada) / 1.1s (salida) y easing `[0.22,1,0.36,1]`. Verificado con un marcador en `dataset` que el elemento sobrevive S1→S2 sin remount.
  - Modos: `hidden` (S0), `frosted` (S1 en reposo), `clearing` (touch en curso / T_UNIT_ENTER), `clear` (S2).
  - Se desmutea el video ya en reproducción al llegar a `clear` (sin nuevo gesto), y se remutea al volver a `frosted`.
  - `onEnded`: en modo `clear` dispara auto-return al menú (spec); en cualquier otro modo, hace loop manual (reset a 0 + replay) — así el loop ambiental de S1 y el "fin de presentación" de S2 usan la misma lógica sin depender del atributo `loop` nativo.
  - Al volver a `frosted` se resetea `currentTime = 0` (spec: "debe resetearse al regresar al menú").
  - `S1Menu` ya no tiene su propio `<video>`; en su lugar llama a un nuevo prop `onTouchStart(unitId)` inmediatamente al tocar (antes del delay de 900ms) para que `PersonPresence` empiece a des-frostear en sincronía.
- **Composición espacial (ya no columna uniforme):** las 7 unidades ahora tienen ancho/alineación individual (`LAYOUT` en `S1Menu.tsx` — cada card con distinto `width`/`align-self`), en vez de una lista de botones idénticos. WeWow At Work! es la más ancha/prominente (`.glass-unit-primary`).
- **Glass card con más carácter** (`App.css`): fondo con gradiente (no un solo tono plano), highlight óptico superior (`.glass-unit-highlight`, línea de luz en el borde), sombra en capas (ambient + contact + inset highlight/shadow) para sensación de grosor, y un rastro tenue de glow amarillo SIEMPRE visible en reposo (opacity 0.14, sube a 1 con el touch) para que el glass no se sienta plano/muerto por defecto.
- **Tipografía con más contraste:** "BIENVENIDOS" ahora bold/tracked; subtítulo y unit labels con peso más ligero/uppercase tracking distinto, para que no se sienta "default".
- Fix defensivo: `video.play()` ahora captura su promesa (`.catch(() => {})`) — evita un `AbortError` real en consola cuando el browser interrumpe `play()` con un `pause()` (visto en verificación).

Nota de implementación: `T_UNIT_ENTER_MS` del controller se redujo de 500ms a 150ms (`useHoloboxController.ts`) porque la secuencia visual pesada ya ocurre dentro de S1 antes del hand-off — evita una doble espera.

Acceptance: verificado en navegador — cards glass con blur/bordes/glow correctos, secuencia de touch funcional (compression → glow → cards se desvanecen → blur baja), llega a S2 con datos correctos. Sin errores de consola. La velocidad exacta de la animación no pudo confirmarse con precisión en el navegador automatizado usado para el chequeo (mismo tipo de limitación de timing/rendering que con el `<video>` en TASK 001/002 — recomendable revisión manual en navegador real).

### TASK 005 — Menu → Person Transition

Status: DONE

**Implementación de la hero transition completa (FROSTED → CLEAR), 9 pasos exactos del spec final:**

1. Compresión física inmediata del glass tocado, <100ms — `whileTap={{ scale: 0.92, transition: { duration: 0.08 } }}` en `S1Menu.tsx`.
2. Highlight óptico amarillo aparece — `.glass-unit-glow` opacity 0.14 → 1 en 0.22s.
3. CTAs no seleccionados se desvanecen y derivan hacia el perímetro — cada card tiene un `perimeterX/perimeterY` individual en `LAYOUT` (izquierda/derecha/arriba/abajo según su posición), no solo `opacity: 0` en el mismo sitio.
4. El glass seleccionado se abre/disuelve — scale 1→1.16 + opacity 1→0 + `y: -60` (hacia arriba/perímetro), delay 0.18s para que el highlight sea visible primero.
5–6. Blur y contraste de Carlos bajan en paralelo desde el instante del touch — `PersonPresence.tsx` ahora anima `contrast()` además de `blur()`/`opacity` (frosted: blur 30px/contrast 0.75 → clear: blur 0/contrast 1), duración 1.8s con easing `[0.22,1,0.36,1]`.
7. El encabezado "BIENVENIDOS" también se desvanece (antes quedaba plastado sobre Carlos) — `motion.header` en `S1Menu.tsx`, opacity 1→0.
8–9. Tras `TOUCH_SEQUENCE_MS` (1000ms, subido de 900ms) se avisa al controller — para entonces el glass ya es invisible, así que el hand-off de estado nunca se percibe como corte de página. `S2Person` recibe la identidad con fade-in retrasado (0.4s delay) para que Carlos ya esté revelado antes de que llegue el texto.

**Intento revertido — AnimatePresence genérico:** probé envolver el switch de pantallas en `App.tsx` con `<AnimatePresence>` como "red de seguridad" de crossfade entre TODOS los estados (no solo la hero transition). Causó una regresión real: al ciclar de vuelta a un `state` ya usado antes (p.ej. volver a `S1_MENU` tras `T_RETURN`), React reutiliza la misma `key` de un nodo cuya animación de salida nunca terminó de resolverse (visto durante verificación en el navegador automatizado, donde `document.hidden` permanece `true` y congela las animaciones de Motion) — el ciclo de regreso se quedó atascado. **Revertido por completo** (`App.tsx` volvió a un `switch` simple sin `AnimatePresence`); no era necesario para cumplir "no page cut" porque `PersonPresence` (persistente) + la secuencia local de `S1Menu` ya lo resuelven. Verificado tras revertir: dos ciclos completos S0→S1→touch→S2→regreso→S1→touch(otra unidad)→S2, sin acumulación de pantallas, con datos correctos en cada paso.

Acceptance: verificado en navegador — secuencia de 9 pasos presente en código y disparada correctamente (clases/estilos computados confirmados vía DOM), `backdrop-filter: blur(...)` confirmado aplicado y soportado (`CSS.supports` true), ciclo completo repetible sin errores de consola de la app. La calidad final del *timing/easing* visual no pudo juzgarse a ojo en este entorno (ver limitación de `document.hidden` documentada en PROJECT_CONTEXT.md) — recomendable revisión visual del usuario en navegador real.

### TASK 006 — Person Experience

Status: DONE

**⚠️ SUPERSEDIDO — ver "S2 SIMPLIFICATION" bajo TASK 007.** Los bullets de "UI glass mínima alrededor" y "menú principal" describían `S2Person.tsx`/`.s2-identity-glass`/`.s2-back`, que ya NO existen — fueron eliminados por completo en la re-evaluación de S2 (nueva decisión aprobada: S2 = video/person experience puro, sin ninguna UI encima). Se deja el historial abajo tal como se implementó entonces, por trazabilidad, pero NO refleja el estado actual del código.

- reproducir video real → ✅ (capa persistente `PersonPresence`, ver TASK 004/005)
- mostrar Carlos Landa → ✅
- Head WeWow At Work! → ✅
- ~~video hero — persona CLEAR, dominante, sin card/panel que la encierre → ✅ (`S2Person.tsx` no envuelve el video en ningún contenedor; solo pone un chip de identidad)~~
- ~~UI glass mínima alrededor (chips: unit name, head name, head title) → ✅ `.s2-identity-glass`~~
- ~~menú principal → ✅ `.s2-back`~~
- auto-return on video end → ✅ ya implementado en `PersonPresence.handleEnded` (TASK 004/005): en modo `clear`, `onEnded` dispara `onVideoEnd` (= `returnToMenu` del controller) — **esta parte SIGUE vigente**, es la fuente de verdad reutilizada en la simplificación de S2.

~~Todas las unidades usan temporalmente el mismo video~~ — **actualizado**: el cliente entregó videos reales para las 7 unidades (ver `src/data/businessUnits.ts` y PROJECT_CONTEXT.md → "Confirmed content"). Cada unidad ahora reproduce su propio video real, ya no comparten un placeholder.

### TASK 007 — Holobox Visual Polish

Status: IN PROGRESS (dirección visual final de S1 implementada; S0/S2 pendientes de pulido)

**Implementado — dirección visual final S1 (tech glass grid):**

1. **PERSON HIDDEN en S1** (cambio de concepto): Carlos/persona ya NO es visible ni siquiera blurred de fondo durante S1_MENU idle. `PersonPresence.tsx` → target `frosted` cambiado de `{opacity: 0.5, blur: 30}` a `{opacity: 0, blur: 30, contrast: 0.8}` (invisible). El nombre de modo "frosted" se conserva como lenguaje de material (continuidad con FROSTED → CLEAR) aunque su resultado visual en reposo ahora es invisible. `clearing` (touch en curso) pasó a `{opacity: 0.9, blur: 6, contrast: 0.92}` — Carlos "fades/reveals into the transparent stage" en paralelo con la secuencia de S1Menu. Verificado: `getComputedStyle` del `.person-video` en S1 idle confirma `opacity: 0`.
2. **Tipografía Avenir**: `"Avenir Next", Avenir, system-ui, -apple-system, "Segoe UI", sans-serif` en `src/index.css` (body) — sin fonts descargadas, sin Google Fonts, hereda a toda la app.
3. **Composición S1 rediseñada** (`S1Menu.tsx` + `App.css`): logo WeWow arriba + BIENVENIDOS + subtítulo, tech glass grid de 2 columnas al centro (7 unidades, la card 07 centrada ocupando ambas columnas con el mismo ancho que una columna vía `--s1-gap-x`), hint "TOCA UNA UNIDAD PARA EXPLORAR" abajo. Aprovecha mucho más el ancho del canvas que la versión anterior (columna única).
4. **Contenido de card**: número zero-padded (01–07) arriba-izquierda + línea amarilla debajo, slot de icono glass arriba-derecha (placeholder circular si `unit.iconSrc` no existe, `<img>` si existe), nombre de unidad en el cuerpo, indicador circular de navegación (chevron) abajo-derecha.
5. **Material glass reforzado**: gradiente de superficie + backdrop-filter acotado por card + borde fino + highlight largo sutil + highlight corto más brillante (`.glass-unit-highlight-hot`, simula un sector de reflexión real, no una línea uniforme) + edge inferior + sombra en capas.
6. **Amarillo WeWow contenido**: línea de acento bajo el número + glow interno (siempre con un rastro tenue 0.12 en reposo, sube a 1 al touch) — nunca relleno de card.
7. **Ambient motion sutil**: drift vertical de 2px por card, muy lento (6-8s), escalonado por índice — vía Motion `animate`/`transition` por-propiedad (no CSS `@keyframes` separado). Se desactiva automáticamente al tocar (pasa a la animación de receso/selección).
8. **Sistema de iconos preparado, no inventado**: `BusinessUnit.iconSrc?: string` agregado en `types.ts`; `public/icons/units/` creado (solo con `.gitkeep`, sin assets) para los PNG/WebP transparentes que se agregarán después.
9. **Ajuste de presupuesto vertical** (bug real encontrado y corregido durante verificación): la primera versión de la grid desbordaba el canvas 9:16 (contenido 832px vs contenedor 673px en la ventana de prueba) por exceso de padding/gaps + tamaño de icon-slot/nav-circle escalado en cqw. Corregido reduciendo paddings/gaps de `.screen-s1`/`.s1-grid`/`.glass-unit`, y pasando `icon-slot`/`nav` de cqw a tamaño fijo en rem (chrome de UI pequeño no debe escalar al mismo ritmo que el contenido principal). Verificado tras el fix: `s1.scrollHeight === s1.clientHeight` (sin overflow), card 07 centrada, footer visible dentro del canvas.

Evaluar en próxima iteración (S0/S2 aún con el estilo anterior a TASK 007, no rediseñados por instrucción explícita — "No hacer redesign grande todavía" para S2, "No redesign S0 beyond lo necesario"):

- glass visibility / touch targets en S0 y S2 bajo la nueva dirección
- video/person scale definitivo en S2
- transition timing real (motion de T_UNIT_ENTER/T_RETURN, hoy placeholder)
- depth / composition general del set completo

**Tooling interno agregado — Fullscreen fix + Design Controls (antes de continuar con particles/motion polish):**

10. **Fix fullscreen 9:16 real** (Part A): `.holobox-viewport`/`.holobox-canvas` pasaron de `100vw`/`100vh` a `100dvw`/`100dvh` consistentemente; `html`/`body`/`#root` ganaron `width: 100%` explícito (defensivo). La fórmula `width: min(100dvw, calc(100dvh * 9/16))` converge matemáticamente a fullscreen exacto (sin letterbox) cuando el viewport ya es 9:16 — verificado el cálculo y, en una ventana de prueba con otra proporción, que el canvas llena exactamente el eje restrictivo (altura o ancho) sin gap. No se pudo forzar una ventana EXACTAMENTE 9:16 en el navegador automatizado (su `resize_window` no cambia `window.innerWidth` en este entorno) — recomendable confirmar en un navegador real o en el display físico.
11. **DESIGN CONTROLS — panel dev-only** (`src/dev/DesignControls.tsx`, `DesignControlsRoot.tsx`, `designControls.css`): overlay fijo fuera del master canvas 9:16, abre/cierra con `D` (ignora foco en inputs), con sliders/toggles para Glass, Cards, Layout, Yellow Light, Ambient Motion, Particles y Transition, más Debug State (LIVE/S0/S1/S2, override de renderizado que NO toca el state controller real) y RESET DESIGN / COPY CONFIG.
12. **Config central** (`src/config/designConfig.ts`, `src/config/debugState.ts`): store pub-sub sobre `useSyncExternalStore` (nativo de React, sin dependencias nuevas). Defaults = diseño ya aprobado (multiplicadores en 1, offsets en 0) → `RESET DESIGN` es trivialmente correcto. Los valores CSS se aplican como custom properties en `:root`, consumidos vía `calc(<base> * var(--token, 1))` en `App.css` — fallback siempre = diseño actual, cero costo cuando el panel nunca se usó (producción).
13. **Sistema de partículas preparado, apagado por defecto** (`src/layout/AmbientParticles.tsx`): CSS puro (no Motion, más barato para N elementos), vive detrás de las glass cards dentro del canal transparente, nunca fondo fullscreen con color propio.
14. **Producción verificada limpia**: `npm run build` + inspección de `dist/` — cero referencias a `DesignControls`/`dc-section` en el bundle (tree-shaking de Rollup sobre la rama `import.meta.env.DEV` funcionó correctamente). `npm run preview` (modo producción real) confirma que la tecla D no hace nada y el flujo S0→S1→S2→S1 sigue funcionando sin errores de consola.
15. **Documentado en `DESIGN_SYSTEM.md`** (nuevo, raíz del repo): Fullscreen Behavior + Development Design Controls.

**16. RE-EVALUATION / CLEANUP — S2 simplification + re-inventario de video assets (nueva decisión aprobada):**

**S2 simplificado a "video/person experience puro":**

- **Eliminado por completo** (no con opacity — el render entero se quitó): `src/screens/S2Person.tsx` (archivo borrado), y en `App.css` todo el bloque `.screen-s2`/`.s2-back`/`.s2-back:disabled`/`.s2-identity-glass`/`.s2-unit-name`/`.s2-head-name`/`.s2-head-title`. `App.tsx` ya no importa `S2Person`; el case `S2_PERSON` del switch retorna `null` — `PersonPresence` (siempre montado, sibling) ya muestra el video en CLEAR sin overlay.
- **Auto-return reutilizado, no reinventado**: `PersonPresence.handleEnded` (ya existente desde TASK 004/005) sigue siendo la única fuente de verdad — `video.onEnded` real dispara `onVideoEnd` → `returnToMenu`. No se agregó ningún timer.
- **Reset limpio al cambiar de unidad, agregado en `PersonPresence.tsx`**: nuevo `useEffect` keyed en `unit?.video` que llama `video.load()` (+ `play()` si corresponde) cuando el src cambia — refuerzo explícito además del cambio implícito de `src` de React/el navegador, para garantizar `currentTime` en 0 y sin residuo del video anterior en cualquier motor/engine. Sin cache-busting en la URL (son assets locales estáticos).
- **Design Controls**: se revisó si existían controles dedicados a "Identity Card" (width/height/position/glass/border/glow/typography) — **no existían** (nunca se construyeron controles específicos para eso), así que no hubo nada que remover del panel. Los botones de Debug State `[S0] [S1] [S2]` se preservaron intactos y se verificaron funcionando (fuerzan la vista, incluyendo S2 sin overlay).
- **Fullscreen 9:16**: sin cambios — verificado que sigue intacto (ratio exacto 0.5625 tras esta pasada).

**Re-inventario de video assets — el filesystem volvió a cambiar:**

La entrega anterior (carpetas por unidad, `public/videos/<UNIDAD>/archivo.mp4`) ya NO existe. El cliente reemplazó todo por 7 archivos planos directamente en `public/videos/`, con el head y la unidad codificados en el nombre del archivo. Inventario verificado por inspección directa (no se usó información histórica):

| Unidad | Video file | Path | Exists |
|---|---|---|---|
| WeWow At Work! | CARLOS LANDA_WEWORK.mp4 | `/videos/CARLOS LANDA_WEWORK.mp4` | ✅ |
| Consulting | MAURICIO URIBE_ CONSULTING!.mp4 | `/videos/MAURICIO URIBE_ CONSULTING!.mp4` | ✅ |
| Culture & Transformation | _MAURICIO URIBE_ CULTURE!.mp4 | `/videos/_MAURICIO URIBE_ CULTURE!.mp4` | ✅ |
| Hiring (ver ambigüedad abajo) | JORGE ROSAS_ HIRING!.mp4 | `/videos/JORGE ROSAS_ HIRING!.mp4` | ✅ |
| Learning | GERARDO CHAVEZ LEARNING!.mp4 | `/videos/GERARDO CHAVEZ LEARNING!.mp4` | ✅ |
| Outplacement | SANDRA MICHELSEN_ OUTPLACEMENT!.mp4 | `/videos/SANDRA MICHELSEN_ OUTPLACEMENT!.mp4` | ✅ |
| Talent Attraction | MARIABELEN CARABAÑO_TALENT ATTRACTION!.mp4 | `/videos/MARIABELEN CARABAÑO_TALENT ATTRACTION!.mp4` | ✅ |

`src/data/businessUnits.ts` se reescribió completo con estos 7 paths — ningún path del código anterior sigue vigente (los del delivery de carpetas por unidad ya no existen en disco, no se recuperaron ni se dejaron referencias muertas).

**Ambigüedad reportada, no adivinada:** el archivo de Jorge Rosas dice "HIRING", pero la entrega anterior lo tenía como head de "Coaching & Mentoring" — un nombre de unidad que no aparece en ningún archivo actual. Por eliminación (es el único archivo/persona restante para la única unidad restante sin video) se asignó a esa unidad y se renombró `name`/`id` a "Hiring", pero ese nombre viene únicamente del filename, nunca fue confirmado explícitamente como el nuevo nombre oficial — pendiente de confirmación del cliente (ver PROJECT_CONTEXT.md).

**Dos correcciones de ortografía** aplicadas por ser la fuente de verdad actual (el filesystem, no el historial): "Carlos Landa" (confirmado, ya no "Lara" — el archivo ambiguo anterior desapareció) y "Mariabelen Carabaño" (antes "Maribel Carbaño").

**Validación de las 7 unidades** (navegador real, flujo touch completo, disparando el evento real `ended` en vez de esperar la duración completa de cada video para poder ciclar las 7 en una sesión):

1. S1 muestra las 7 unidades (nombres reales) → ✅
2. Touch selecciona unidad → ✅ (probado con las 7)
3. S2 carga el video correcto por unidad → ✅ (verificado `video.currentSrc` para cada una de las 7)
4. Video inicia desde el principio (`currentTime === 0`) → ✅ (verificado en cada una de las 7)
5. No aparece identity/name card → ✅ (`document.querySelector('.s2-identity-glass')` null en las 7)
6. No aparece Back/Menú Principal → ✅ (`.s2-back` null en las 7)
7. Video termina (evento `ended` real disparado) → ✅
8. Regresa automáticamente a S1 → ✅ (verificado tras cada una de las 7)
9. S1 queda listo para seleccionar otra unidad (cards no disabled) → ✅
10. Seleccionar una segunda unidad carga SU video, no reutiliza el anterior → ✅ (verificado en cada transición: WeWow At Work!→Hiring→Consulting→Culture→Learning→Outplacement→Talent Attraction, cada `currentSrc` cambió correctamente)

Sin errores de consola en ningún punto del ciclo (7 unidades × auto-return). `npm run build` limpio. Verificado también en `npm run preview` (producción real): flujo funciona, tecla D no hace nada, sin panel visible, sin errores.

### TASK 008 — Deployment Test

Status: BLOCKED BY 007

- production build
- fresh-machine installation procedure
- fullscreen test
- offline test
- local asset test
- document exact launch procedure

## Milestone complete when:

Otra computadora puede instalar y ejecutar la experiencia completa:

S0 → S1 → select unit → S2 → return S1

sin depender de la máquina de desarrollo.
